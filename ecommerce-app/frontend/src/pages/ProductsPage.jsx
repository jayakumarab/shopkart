import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Star, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { productsAPI, categoriesAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { formatPrice } from "../utils/formatters";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state params
  const urlSearch = searchParams.get("search") || "";
  const urlCategoryId = searchParams.get("category_id") || "";
  const urlCategoryName = searchParams.get("category_name") || "";
  const urlSort = searchParams.get("sort") || "newest";
  const urlMinPrice = searchParams.get("min_price") || "";
  const urlMaxPrice = searchParams.get("max_price") || "";
  const urlMinRating = searchParams.get("min_rating") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // Component state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Price slider state
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(urlMaxPrice || "150000");

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products based on current searchParams
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: urlPage,
        limit: 12,
        sort: urlSort,
      };

      if (urlSearch) params.search = urlSearch;
      if (urlCategoryId) params.category_id = urlCategoryId;
      if (urlCategoryName) params.category_name = urlCategoryName;
      if (urlMinPrice) params.min_price = urlMinPrice;
      if (urlMaxPrice) params.max_price = urlMaxPrice;
      if (urlMinRating) params.min_rating = urlMinRating;

      const res = await productsAPI.getAll(params);
      setProducts(res.items || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [urlSearch, urlCategoryId, urlCategoryName, urlSort, urlMinPrice, urlMaxPrice, urlMinRating, urlPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update query params helper
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== "") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter changes unless changing page itself
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId, catName) => {
    if (urlCategoryId === String(catId)) {
      // Toggle off
      updateParam("category_id", "");
      updateParam("category_name", "");
    } else {
      updateParam("category_id", catId);
      updateParam("category_name", catName);
    }
  };

  const handlePriceApply = () => {
    updateParam("max_price", selectedMaxPrice);
  };

  const handleRatingChange = (rating) => {
    if (urlMinRating === String(rating)) {
      updateParam("min_rating", "");
    } else {
      updateParam("min_rating", rating);
    }
  };

  const handleClearFilters = () => {
    setSelectedMaxPrice("150000");
    setSearchParams(urlSearch ? { search: urlSearch } : {});
  };

  const hasActiveFilters = Boolean(
    urlCategoryId || urlCategoryName || urlMinPrice || urlMaxPrice || urlMinRating
  );

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Title Bar */}
      <div className="bg-white rounded-md p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {urlSearch
              ? `Results for "${urlSearch}"`
              : urlCategoryName
              ? urlCategoryName
              : "All Products"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {products.length} of {total} products
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 hidden sm:inline">Sort By:</span>
            <div className="flex bg-gray-100 p-1 rounded-sm text-xs font-medium">
              {[
                { label: "Newest", value: "newest" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Customer Rating", value: "rating_desc" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateParam("sort", s.value)}
                  className={`px-2.5 py-1 rounded transition text-xs ${
                    urlSort === s.value
                      ? "bg-white text-blue-600 font-bold shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block md:col-span-1 bg-white rounded-md p-4 shadow-xs border border-gray-100 space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Categories
            </h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected =
                  urlCategoryId === String(cat.id) ||
                  urlCategoryName?.toLowerCase() === cat.name.toLowerCase();
                return (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 cursor-pointer py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryChange(cat.id, cat.name)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={isSelected ? "font-bold text-blue-600" : ""}>
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Price Range
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="150000"
                step="2000"
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>₹0</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                  Max: {formatPrice(Number(selectedMaxPrice))}
                </span>
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-bold transition"
              >
                Apply Price
              </button>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Customer Ratings
            </h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:text-blue-600 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={urlMinRating === String(r)}
                    onChange={() => handleRatingChange(r)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 font-medium">
                    <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      {r} <Star className="w-2.5 h-2.5 fill-current" />
                    </span>
                    <span>& above</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID & PAGINATION */}
        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              type="search"
              title="No products matched your criteria"
              description="Try adjusting your category selection, price range, or search keyword."
              buttonText="Reset All Filters"
              buttonLink="/products"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {pages > 1 && (
                <div className="bg-white rounded-md p-4 shadow-xs flex items-center justify-between border border-gray-100 mt-6">
                  <div className="text-xs text-gray-500">
                    Page <span className="font-bold text-gray-800">{urlPage}</span> of{" "}
                    <span className="font-bold text-gray-800">{pages}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateParam("page", urlPage - 1)}
                      disabled={urlPage <= 1}
                      className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: pages }).map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateParam("page", pageNum)}
                          className={`w-8 h-8 rounded text-xs font-semibold transition ${
                            urlPage === pageNum
                              ? "bg-[#2874f0] text-white shadow-xs"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => updateParam("page", urlPage + 1)}
                      disabled={urlPage >= pages}
                      className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs md:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full p-5 overflow-y-auto ml-auto space-y-6 animate-slide-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={urlCategoryId === String(cat.id)}
                      onChange={() => handleCategoryChange(cat.id, cat.name)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price (Up to {formatPrice(Number(selectedMaxPrice))})
              </h3>
              <input
                type="range"
                min="0"
                max="150000"
                step="2000"
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Mobile Ratings */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Customer Ratings
              </h3>
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={urlMinRating === String(r)}
                    onChange={() => handleRatingChange(r)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>{r}★ & above</span>
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  handlePriceApply();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

