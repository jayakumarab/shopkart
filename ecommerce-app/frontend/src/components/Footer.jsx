import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RefreshCw, CreditCard, Award, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-gray-300 mt-auto pt-10 pb-6 text-xs">
      {/* Trust Badges Bar */}
      <div className="border-b border-gray-700/60 pb-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">100% Original Products</h4>
            <p className="text-gray-400 text-xs mt-1">Guaranteed authenticity directly from verified brands</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400 mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Free & Fast Delivery</h4>
            <p className="text-gray-400 text-xs mt-1">Free delivery on eligible orders over ₹500 across India</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-400 mb-2">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">7-Day Easy Returns</h4>
            <p className="text-gray-400 text-xs mt-1">Hassle-free replacement policy for peace of mind</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400 mb-2">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Secure Checkout</h4>
            <p className="text-gray-400 text-xs mt-1">End-to-end encrypted checkout and demo transactions</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">ABOUT</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Careers</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Flipkart Stories</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Press</Link></li>
            <li><Link to="/products" className="hover:text-white transition">Corporate Information</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">HELP</h3>
          <ul className="space-y-2">
            <li><Link to="/orders" className="hover:text-white transition">Payments</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">Shipping</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">Cancellation & Returns</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">Report Infringement</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">CONSUMER POLICY</h3>
          <ul className="space-y-2">
            <li><span className="hover:text-white cursor-pointer transition">Cancellation & Returns</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Terms Of Use</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Security</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer transition">Sitemap</span></li>
          </ul>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">MAIL US</h3>
          <p className="leading-relaxed text-gray-400">
            ShopKart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">REGISTERED OFFICE</h3>
          <p className="leading-relaxed text-gray-400">
            ShopKart Internet Private Limited,<br />
            CIN: U51109KA2012PTC066107<br />
            Telephone: <span className="text-blue-400 font-medium">044-45614700 / 044-67415800</span>
          </p>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-gray-700/60 pt-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Award className="w-4 h-4" /> Become a Seller
            </span>
            <span className="hover:text-white cursor-pointer">Advertise</span>
            <span className="hover:text-white cursor-pointer">Gift Cards</span>
            <span className="hover:text-white cursor-pointer">Help Center</span>
          </div>

          <div className="flex items-center gap-1">
            <span>© 2026 ShopKart. Built for College Project Demo.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

