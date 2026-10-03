import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      success("Logged in successfully! Welcome back.");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      setErrorMessage(msg);
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@example.com");
    setPassword("password123");
    setErrorMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10 bg-white rounded-md shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-gray-100 min-h-[500px]">
      
      {/* LEFT: Branding Banner (Classic Flipkart blue panel) */}
      <div className="md:col-span-2 bg-[#2874f0] p-8 text-white flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Login</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Get access to your Orders, Wishlist and Personalized Recommendations.
          </p>
        </div>

        <div className="space-y-4 py-6">
          <div className="flex items-center gap-2 text-xs text-blue-100">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>100% Safe & Secure Login</span>
          </div>
          <div className="p-3 bg-white/10 rounded-md border border-white/20 text-xs">
            <p className="font-bold text-amber-300 mb-1">Demo Credentials:</p>
            <p className="text-blue-100">Email: demo@example.com</p>
            <p className="text-blue-100">Password: password123</p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-2 text-xs font-bold text-gray-900 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded transition w-full shadow-xs"
            >
              Autofill Demo Login
            </button>
          </div>
        </div>

        <div className="text-[11px] text-blue-200">
          ShopKart E-Commerce System
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("For this demo, please use your registered password or password123 for demo@example.com")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal">
            By continuing, you agree to ShopKart's{" "}
            <span className="text-blue-600 cursor-pointer">Terms of Use</span> and{" "}
            <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold rounded-sm shadow-md transition text-sm flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Login"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Link to Register */}
        <div className="pt-6 mt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            New to ShopKart?{" "}
            <Link
              to="/register"
              className="font-bold text-[#2874f0] hover:underline ml-1"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

