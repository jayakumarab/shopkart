import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, TrendingUp, Award, Sparkles, ChevronRight } from "lucide-react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/SkeletonLoader";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from backend
        const res = await productsAPI.getAll({ limit: 20 });
        setProducts(res.items || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Segment products into sections
  const topDeals = products.filter((p) => (p.discount || 0) >= 20).slice(0, 4);
  const bestSellers = products.filter((p) => (p.rating || 0) >= 4.5).slice(0, 4);
  const trendingProducts = products.slice(4, 8);
  const recommendedProducts = products.slice(8, 12);

  return (
    <div className="space-y-6">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-lg">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-amber-400/30">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Big Festive Bonanza 2026
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Mega Savings Days <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Up to 80% Off
              </span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 max-w-lg">
              Explore the latest smartphones, premium electronics, ethnic fashion, and daily essentials with instant bank discounts & free fast delivery.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-md shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?sort=price_asc"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md backdrop-blur-xs transition text-sm border border-white/20"
              >
                Explore Deals
              </Link>
            </div>
          </div>

          {/* Banner Graphic Showcase */}
          <div className="hidden md:flex flex-col items-center justify-center relative">
            <div className="w-72 h-72 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col items-center justify-center text-center shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
              <span className="text-5xl mb-3">📱🎧👗</span>
              <p className="font-extrabold text-2xl text-white">20,000+ Products</p>
              <p className="text-xs text-blue-200 mt-1">Verified Brands • 7 Days Replacement</p>
              <div className="mt-4 px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full shadow-xs">
                Free Delivery on ₹500+
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white rounded-md p-4 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-center border border-gray-100">
        <div className="p-2 border-r border-gray-100 last:border-r-0">
          <p className="text-xs font-semibold text-gray-800">Top Brands</p>
          <p className="text-[11px] text-gray-500">Apple, Samsung, Sony & More</p>
        </div>
        <div className="p-2 border-r border-gray-100 last:border-r-0">
          <p className="text-xs font-semibold text-gray-800">Best Prices</p>
          <p className="text-[11px] text-gray-500">Unmatched discount deals</p>
        </div>
        <div className="p-2 border-r border-gray-100 last:border-r-0">
          <p className="text-xs font-semibold text-gray-800">Fast Delivery</p>
          <p className="text-[11px] text-gray-500">Quick dispatch to your doorstep</p>
        </div>
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-800">Easy Returns</p>
          <p className="text-[11px] text-gray-500">7-day replacement guarantee</p>
        </div>
      </section>

      {/* 1. TOP DEALS */}
      <section className="bg-white rounded-md p-5 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Top Deals</h2>
              <p className="text-xs text-gray-500">Biggest price cuts on bestselling gadgets and styles</p>
            </div>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#2874f0] hover:text-blue-700"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(topDeals.length > 0 ? topDeals : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 2. BEST SELLERS */}
      <section className="bg-white rounded-md p-5 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Best Sellers</h2>
              <p className="text-xs text-gray-500">Highest rated products loved by thousands</p>
            </div>
          </div>
          <Link
            to="/products?sort=rating_desc"
            className="flex items-center gap-1 text-sm font-semibold text-[#2874f0] hover:text-blue-700"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(bestSellers.length > 0 ? bestSellers : products.slice(2, 6)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Mid Banner Promo Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-lg p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Special Deal</span>
            <h3 className="text-xl font-bold">Latest Flagship Phones</h3>
            <p className="text-xs text-purple-200">Starting from ₹27,999 with No Cost EMI</p>
            <Link to="/products?category_name=Mobiles" className="inline-block mt-2 text-xs font-bold text-amber-300 hover:underline">
              Explore Mobiles →
            </Link>
          </div>
          <div className="text-5xl">📱</div>
        </div>

        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-lg p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Trending Now</span>
            <h3 className="text-xl font-bold">Audio & Accessories</h3>
            <p className="text-xs text-teal-200">Noise cancellation headphones up to 50% off</p>
            <Link to="/products?category_name=Electronics" className="inline-block mt-2 text-xs font-bold text-amber-300 hover:underline">
              Explore Electronics →
            </Link>
          </div>
          <div className="text-5xl">🎧</div>
        </div>
      </div>

      {/* 3. TRENDING PRODUCTS */}
      <section className="bg-white rounded-md p-5 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Trending Products</h2>
              <p className="text-xs text-gray-500">Most sought-after items this week</p>
            </div>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#2874f0] hover:text-blue-700"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(trendingProducts.length > 0 ? trendingProducts : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. RECOMMENDED PRODUCTS */}
      <section className="bg-white rounded-md p-5 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Recommended Products</h2>
              <p className="text-xs text-gray-500">Curated picks based on current trends and top reviews</p>
            </div>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#2874f0] hover:text-blue-700"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(recommendedProducts.length > 0 ? recommendedProducts : products.slice(4, 8)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

