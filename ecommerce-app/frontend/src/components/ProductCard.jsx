import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/products/${product.id}` } } });
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      success(`Added "${product.name.slice(0, 28)}..." to cart!`);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      error(err.response?.data?.detail || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-3.5 group relative">
      <Link to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="w-full h-48 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center mb-3 relative">
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              {Math.round(product.discount)}% OFF
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition title-hover min-h-[40px]" title={product.name}>
          {product.name}
        </h3>

        {/* Rating Badge */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            <span>{product.rating ? Number(product.rating).toFixed(1) : "4.0"}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-[11px] text-gray-400 font-medium">({Math.floor((product.id * 147) % 800 + 42)})</span>
        </div>

        {/* Price & Discount */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-xs font-semibold text-emerald-600">
              {Math.round(product.discount)}% off
            </span>
          )}
        </div>

        {/* Stock / Delivery info */}
        <div className="text-[11px] text-gray-500 mt-1">
          {product.stock > 0 ? (
            <span className="text-emerald-700 font-medium">Free Delivery</span>
          ) : (
            <span className="text-rose-500 font-medium">Out of stock</span>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
        <Link
          to={`/products/${product.id}`}
          className="flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          className={`flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded transition shadow-xs ${
            added
              ? "bg-emerald-600 text-white"
              : product.stock <= 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#ff9f00] hover:bg-amber-500 text-white"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{adding ? "Adding..." : "Add to Cart"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

