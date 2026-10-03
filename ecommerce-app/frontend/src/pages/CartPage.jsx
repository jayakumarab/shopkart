import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";
import EmptyState from "../components/EmptyState";
import { useToast } from "../context/ToastContext";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdate = async (productId, newQuantity) => {
    try {
      setUpdatingId(productId);
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      error(err.response?.data?.detail || "Failed to update item quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId, name) => {
    try {
      setUpdatingId(productId);
      await removeFromCart(productId);
      success(`Removed "${name ? name.slice(0, 24) : "item"}..." from cart`);
    } catch (err) {
      error(err.response?.data?.detail || "Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
    return (
      <EmptyState
        type="cart"
        title="Your cart is empty!"
        description="Explore our wide range of products and discover great deals."
        buttonText="Continue Shopping"
        buttonLink="/products"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">
        Shopping Cart ({cart.total_items} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-md shadow-xs border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {cart.items.map((item) => {
            const prod = item.product;
            if (!prod) return null;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between"
              >
                {/* Product thumbnail */}
                <Link
                  to={`/products/${prod.id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded border border-gray-100 p-2 flex items-center justify-center flex-shrink-0"
                >
                  <img
                    src={prod.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex-1 space-y-2">
                  <Link
                    to={`/products/${prod.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-xs text-gray-400">
                    Category: {prod.category?.name || "General"}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.original_price && prod.original_price > prod.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(prod.original_price)}
                      </span>
                    )}
                    {prod.discount > 0 && (
                      <span className="text-xs font-bold text-emerald-600">
                        {Math.round(prod.discount)}% Off
                      </span>
                    )}
                  </div>

                  {/* Controls: Quantity [- 1 +] & Remove */}
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center border border-gray-300 rounded-sm bg-white">
                      <button
                        onClick={() => handleUpdate(prod.id, item.quantity - 1)}
                        disabled={updatingId === prod.id}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-40"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdate(prod.id, item.quantity + 1)}
                        disabled={updatingId === prod.id || item.quantity >= prod.stock}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-40"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(prod.id, prod.name)}
                      disabled={updatingId === prod.id}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 uppercase transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right sm:self-start w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-xs text-gray-400">Subtotal:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <Link
              to="/products"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              ← Add More Items
            </Link>
            <button
              onClick={() => navigate("/checkout")}
              className="py-2.5 px-6 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition flex items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: Price Details Summary (Sticky) */}
        <div className="lg:col-span-4 bg-white rounded-md shadow-xs border border-gray-100 p-5 space-y-4 sticky top-20">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
            PRICE DETAILS
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-700">
              <span>Price ({cart.total_items} items)</span>
              <span>{formatPrice(cart.total_original_price || cart.total_amount)}</span>
            </div>

            {cart.total_discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>- {formatPrice(cart.total_discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>Delivery Charges</span>
              <span>
                {cart.delivery_charge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  formatPrice(cart.delivery_charge)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between text-base font-bold text-gray-900">
              <span>Total Amount</span>
              <span>{formatPrice(cart.final_total)}</span>
            </div>
          </div>

          {cart.total_discount > 0 && (
            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 flex-shrink-0" />
              <span>
                You will save {formatPrice(cart.total_discount)} on this order!
              </span>
            </div>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold rounded-sm shadow-md transition uppercase text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span>Safe and Secure Payments. 100% Authentic products.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;

