import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, PackageOpen, SearchX } from "lucide-react";

const EmptyState = ({
  type = "cart",
  title,
  description,
  buttonText = "Shop Now",
  buttonLink = "/products",
}) => {
  const getIcon = () => {
    switch (type) {
      case "cart":
        return <ShoppingBag className="w-16 h-16 text-blue-500 stroke-[1.5]" />;
      case "orders":
        return <PackageOpen className="w-16 h-16 text-amber-500 stroke-[1.5]" />;
      case "search":
      default:
        return <SearchX className="w-16 h-16 text-gray-400 stroke-[1.5]" />;
    }
  };

  const defaultTitles = {
    cart: "Your cart is empty!",
    orders: "You haven't placed any orders yet.",
    search: "No products found",
  };

  const defaultDescriptions = {
    cart: "Explore our wide range of products and discover great deals!",
    orders: "Once you purchase items, your order history will appear here.",
    search: "Try checking your spelling or use more general terms.",
  };

  return (
    <div className="bg-white rounded-md p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 border border-gray-100 shadow-xs">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        {getIcon()}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {title || defaultTitles[type]}
      </h3>

      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        {description || defaultDescriptions[type]}
      </p>

      <Link
        to={buttonLink}
        className="bg-[#2874f0] hover:bg-blue-600 text-white font-semibold px-8 py-2.5 rounded-sm shadow-sm transition transform hover:-translate-y-0.5 text-sm"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;

