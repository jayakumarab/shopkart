import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="bg-white rounded-md p-12 text-center max-w-lg mx-auto my-12 border border-gray-100 shadow-xs">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-xs text-gray-500 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#2874f0] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-sm text-xs shadow-sm transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

