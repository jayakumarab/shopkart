import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut, Package, UserCircle, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start leading-none group flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black italic tracking-wide text-white">ShopKart</span>
              <span className="text-amber-300 font-extrabold text-xl italic">+</span>
            </div>
            <span className="text-[11px] font-medium text-gray-200 italic tracking-wider flex items-center gap-0.5 group-hover:text-amber-200 transition">
              Explore <span className="text-amber-300 font-bold ml-0.5">Plus</span>
              <span className="inline-block text-[10px]">✨</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl relative items-center"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full bg-white text-gray-800 placeholder-gray-500 pl-4 pr-12 py-2 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3.5 text-[#2874f0] hover:text-blue-700 flex items-center justify-center transition"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* User Login / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded hover:bg-blue-600 transition"
                >
                  <UserCircle className="w-5 h-5 text-amber-300" />
                  <span className="max-w-[100px] truncate">{user?.name?.split(" ")[0] || "Account"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-xl py-1.5 border border-gray-100 z-50 animate-fade-in"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>My Orders</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-[#2874f0] px-6 py-1.5 rounded-sm font-semibold text-sm hover:bg-gray-100 transition shadow-sm"
              >
                Login
              </Link>
            )}

            {/* Cart Link */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-600 transition relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Cart</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 rounded hover:bg-blue-600 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full bg-white text-gray-800 placeholder-gray-500 pl-3 pr-10 py-2 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 text-[#2874f0]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-700 py-3 px-2 border-t border-blue-600 rounded-b-md space-y-1">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded"
            >
              All Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-200 hover:bg-blue-800 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-amber-300 hover:bg-blue-800 rounded"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

