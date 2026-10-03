import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  RefreshCw,
  Truck,
  MapPin,
  Check,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { productsAPI } from "../services/api";
import { formatPrice } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ProductDetailSkeleton } from "../components/SkeletonLoader";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [pincode, setPincode] = useState("560001");
  const [pincodeChecked, setPincodeChecked] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product && next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      success(`Added ${quantity} item(s) to your cart!`);
    } catch (err) {
      error(err.response?.data?.detail || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/checkout` } } });
      return;
    }

    try {
      setBuyingNow(true);
      await addToCart(product.id, quantity);
      navigate("/checkout");
    } catch (err) {
      error(err.response?.data?.detail || "Could not initiate checkout");
    } finally {
      setBuyingNow(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="bg-white rounded-md p-10 text-center max-w-lg mx-auto my-12 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested product may be out of stock or removed.
        </p>
        <Link
          to="/products"
          className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-semibold text-sm"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all products</span>
      </Link>

      <div className="bg-white rounded-md shadow-xs border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: Product Image & Action Buttons */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md h-96 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center p-4 relative group">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
                alt={product.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                  {Math.round(product.discount)}% OFF
                </span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#ff9f00] hover:bg-amber-500 text-white font-bold rounded-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{adding ? "Adding..." : "Add to Cart"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buyingNow || product.stock <= 0}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#fb641b] hover:bg-orange-600 text-white font-bold rounded-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{buyingNow ? "Processing..." : "Buy Now"}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details & Specifications */}
          <div className="md:col-span-7 space-y-5">
            {/* Title & Category */}
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {product.category?.name || "General"}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating ? Number(product.rating).toFixed(1) : "4.0"}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                1,428 Ratings & 312 Customer Reviews
              </span>
              <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                ShopKart Assured ✨
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50/70 p-4 rounded-md border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-base font-bold text-emerald-600">
                    {Math.round(product.discount)}% off
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Stock & Quantity Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Out of Stock
                  </span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="inline-flex items-center border border-gray-300 rounded-sm bg-white">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-1.5 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <span className="px-4 py-1 text-sm font-bold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-1.5 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Check Pin Code */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Delivery Options</span>
              </div>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter PIN code"
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 font-medium"
                />
                <button
                  onClick={() => setPincodeChecked(true)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                >
                  Check
                </button>
              </div>

              {pincodeChecked && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    Delivery by Tomorrow, 11:00 PM | Free on ₹500+
                  </p>
                  <p className="text-gray-500">Cash on Delivery available for PIN {pincode}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Product Description</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description || "No detailed description provided for this product."}
              </p>
            </div>

            {/* Trust Assurance Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center p-2 rounded bg-gray-50 border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-[11px] font-bold text-gray-800">100% Genuine</span>
                <span className="text-[10px] text-gray-500">Verified Brand</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-gray-50 border border-gray-100">
                <RefreshCw className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold text-gray-800">7 Days Return</span>
                <span className="text-[10px] text-gray-500">Hassle Free</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-gray-50 border border-gray-100">
                <Truck className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-[11px] font-bold text-gray-800">Express Shipping</span>
                <span className="text-[10px] text-gray-500">Safe Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

