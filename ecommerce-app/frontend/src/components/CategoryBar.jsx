import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI } from "../services/api";
import { Smartphone, Laptop, Shirt, Home, Sparkles, BookOpen, Apple } from "lucide-react";

// Default category icons mapping
const iconMap = {
  Mobiles: Smartphone,
  Electronics: Laptop,
  Fashion: Shirt,
  "Home Appliances": Home,
  Beauty: Sparkles,
  Books: BookOpen,
  Grocery: Apple,
};

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between sm:justify-around overflow-x-auto no-scrollbar gap-4 sm:gap-6 py-1">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.name] || Smartphone;
            return (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}&category_name=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center group min-w-[70px] flex-shrink-0 transition-transform hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mb-1 flex items-center justify-center bg-gray-50 border border-gray-100 group-hover:border-blue-400 group-hover:bg-blue-50 transition shadow-xs">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;

