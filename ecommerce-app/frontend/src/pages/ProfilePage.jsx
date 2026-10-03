import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Calendar, ShieldCheck, LogOut, Package, ShoppingCart, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import { formatDate } from "../utils/formatters";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const orders = await ordersAPI.getMyOrders();
        setOrdersCount(orders.length);
      } catch (err) {
        console.error("Could not fetch order stats:", err);
      }
    };
    fetchOrderStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card Sidebar */}
        <div className="bg-white rounded-md p-6 shadow-xs border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            <Award className="w-3.5 h-3.5" />
            <span>ShopKart Plus Member</span>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 space-y-2">
            <Link
              to="/orders"
              className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded transition"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span>My Orders</span>
              </div>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {ordersCount}
              </span>
            </Link>

            <Link
              to="/cart"
              className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded transition"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span>View Cart</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout from all devices</span>
            </button>
          </div>
        </div>

        {/* Detailed Account Information */}
        <div className="md:col-span-2 bg-white rounded-md p-6 shadow-xs border border-gray-100 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase">Full Name</label>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.name}</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase">Email Address</label>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.email}</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase">Account Status</label>
                <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active & Verified
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase">Member Since</label>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {user?.created_at ? formatDate(user.created_at) : "October 2026"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Security & Privacy
            </h3>
            <div className="space-y-3 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">JWT Token Security</p>
                  <p className="text-gray-500">Your session is secured using bcrypt password hashing and 256-bit encrypted JWT tokens.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Default Delivery Address
            </h3>
            <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-100 text-xs text-gray-700 leading-relaxed">
              <p className="font-bold text-gray-900">{user?.name} (Home)</p>
              <p>Flat 402, Royal Palms Residency, 80ft Road</p>
              <p>Bengaluru, Karnataka - 560034</p>
              <p className="text-gray-500 mt-1">Phone: +91 9876543210</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;

