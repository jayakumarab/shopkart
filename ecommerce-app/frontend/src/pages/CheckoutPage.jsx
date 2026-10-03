import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import { formatPrice } from "../utils/formatters";
import { useToast } from "../context/ToastContext";

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Address Form State
  const [address, setAddress] = useState({
    name: user?.name || "Rahul Sharma",
    phone: "9876543210",
    street: "Flat 402, Royal Palms Residency, 80ft Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560034",
    addressType: "Home",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, upi, card
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      error("Your cart is empty!");
      navigate("/cart");
      return;
    }

    if (!address.street.trim() || !address.pincode.trim()) {
      error("Please complete your delivery address");
      return;
    }

    try {
      setPlacingOrder(true);
      const formattedAddress = `${address.name}, ${address.phone}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode} (${address.addressType})`;

      const orderData = {
        shipping_address: formattedAddress,
      };

      const createdOrder = await ordersAPI.createOrder(orderData);
      // Refresh cart to show 0
      await fetchCart();

      success(`Order #${createdOrder.id} placed successfully!`);
      navigate("/orders", { state: { newOrderId: createdOrder.id } });
    } catch (err) {
      error(err.response?.data?.detail || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white rounded-md p-10 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="bg-[#2874f0] text-white px-6 py-2.5 rounded-sm font-semibold text-sm"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/cart" className="hover:text-blue-600">Cart</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Address + Order Review + Payment Options */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-md shadow-xs border border-gray-100 overflow-hidden">
            <div className="bg-[#2874f0] px-6 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-[#2874f0] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  DELIVERY ADDRESS
                </h2>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>

            <form className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Mobile Number (10 digits)</label>
                <input
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Flat / House No. / Building / Street</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">City / District</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={address.pincode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Address Type</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Home"
                      checked={address.addressType === "Home"}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    <span>Home (All day)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Work"
                      checked={address.addressType === "Work"}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                    <span>Work (10 AM - 6 PM)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* STEP 2: Order Items Summary */}
          <div className="bg-white rounded-md shadow-xs border border-gray-100 overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 text-gray-800 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  ORDER SUMMARY ({cart.total_items} Items)
                </h2>
              </div>
              <Link to="/cart" className="text-xs font-bold text-blue-600 hover:underline">
                Modify Cart
              </Link>
            </div>

            <div className="p-4 sm:p-6 divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80"}
                      alt={item.product?.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded p-1 border border-gray-100"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1 max-w-sm">
                        {item.product?.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: <span className="font-bold">{item.quantity}</span> × {formatPrice(item.product?.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: Payment Options (Demo Mode) */}
          <div className="bg-white rounded-md shadow-xs border border-gray-100 overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 text-gray-800 flex items-center gap-2 border-b border-gray-200">
              <span className="w-5 h-5 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider">
                PAYMENT METHOD (DEMO MODE)
              </h2>
            </div>

            <div className="p-6 space-y-3">
              <label
                className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-0.5 text-blue-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">
                      Cash on Delivery (Recommended for Demo)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Pay with cash or UPI scanner upon delivery at your doorstep.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === "upi"
                    ? "border-blue-500 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="mt-0.5 text-blue-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-blue-700">UPI</span>
                    <span className="text-xs font-bold text-gray-900">
                      Google Pay / PhonePe / Paytm (Simulated)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Demo Mode: Payment will be instantly approved without real charge.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-0.5 text-blue-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-gray-900">
                      Credit / Debit Card (Simulated)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Demo Mode: All Visa, Mastercard, and RuPay card mock processing.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary & Place Order */}
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
              <span>Total Payable</span>
              <span>{formatPrice(cart.final_total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full py-3.5 bg-[#fb641b] hover:bg-orange-600 text-white font-bold rounded-sm shadow-md transition uppercase text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {placingOrder ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safe & Secure Demo Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

