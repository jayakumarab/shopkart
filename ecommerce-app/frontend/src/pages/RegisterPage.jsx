import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Frontend validations
    if (!name.trim()) {
      setValidationError("Name is required");
      return;
    }
    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await register(name.trim(), email.trim(), password);
      success("Account created successfully! Please login with your credentials.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Try a different email.";
      setValidationError(msg);
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10 bg-white rounded-md shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-gray-100 min-h-[520px]">
      
      {/* LEFT: Banner */}
      <div className="md:col-span-2 bg-[#2874f0] p-8 text-white flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Looks like you're new here!</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Sign up with your email to start shopping thousands of incredible deals today.
          </p>
        </div>

        <div className="space-y-3 py-6 text-xs text-blue-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Instant order tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Exclusive discounts & early access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Secure password protection</span>
          </div>
        </div>

        <div className="text-[11px] text-blue-200">
          Join 10+ Million Happy Customers
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          {/* Email */}
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
                placeholder="e.g. john@example.com"
                className="w-full px-3.5 py-2 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2 pl-10 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold rounded-sm shadow-md transition text-sm flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 mt-2"
          >
            {submitting ? "Creating Account..." : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-600">
            Existing User?{" "}
            <Link to="/login" className="font-bold text-[#2874f0] hover:underline ml-1">
              Log in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

