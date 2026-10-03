import React from "react";

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-md border border-gray-100 p-3.5 flex flex-col justify-between animate-pulse">
    <div>
      <div className="w-full h-44 bg-gray-200 rounded-sm mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
      <div className="h-7 bg-gray-200 rounded"></div>
      <div className="h-7 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-md border border-gray-200 p-6 max-w-7xl mx-auto animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="h-96 bg-gray-200 rounded-md"></div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded w-1/2"></div>
      <div className="flex gap-4 pt-4">
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

export default ProductGridSkeleton;

