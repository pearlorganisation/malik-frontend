"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/features/category/categoryApi"; // Adjust path if needed

export default function CategoryBalls({
  limit = 12,
  showAllLink = true,
  setSelectedCategory,
}) {
  const { data: response, isLoading } = useGetCategoriesQuery({
    page: 1,
    limit: limit * 2,
  }); // Fetch more to pick best

  const categories = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6 py-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        No categories available yet.
      </p>
    );
  }

  // Optional: Shuffle or limit visually
  const displayedCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="px-4">
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 ">
        {displayedCategories.map((category) => (
          <div
            key={category._id}
            onClick={() => setSelectedCategory(category.name)}
            className="group flex flex-col items-center gap-4 transform transition-all duration-300 "
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-xl ring-4 ring-white group-hover:ring-blue-200 transition-all duration-500">
              {category.image?.url ? (
                <Image
                  src={category.image.url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Overlay glow effect */}
              <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>

            <h3 className="text-center font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
              {category.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Optional "View All" link */}
      {showAllLink && categories.length > limit && (
        <div className="text-center mt-12">
          <Link
            href="/categories" // or /shop
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
          >
            View All Categories
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
