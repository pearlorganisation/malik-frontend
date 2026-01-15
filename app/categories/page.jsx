// app/categories/page.jsx
"use client";

import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
    search: search.trim() || undefined,
  });

  const categories = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Adventure Categories
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Discover thrilling experiences in desert, water, sky and more
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories (e.g. Desert, Yacht)..."
              className="
                w-full pl-12 pr-5 py-3 rounded-full 
                bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                shadow-sm transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {error?.data?.message ||
                "We couldn't load the categories. Please try again later."}
            </p>
          </div>
        )}

        {/* Categories */}
        {!isLoading && !isError && (
          <>
            {categories.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-7xl mb-6 opacity-50">🏜️</div>
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  No categories found
                </h3>
                {search && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Try searching for something else or clear the search
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.name}`}
                    className="
                      group relative overflow-hidden rounded-2xl 
                      shadow-lg hover:shadow-2xl transition-all duration-500
                      transform hover:-translate-y-3 bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                    "
                  >
                    {/* Image + Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={category.image?.url || "/placeholder.jpg"}
                        alt={category.name}
                        fill
                        className="
                          object-cover transition-transform duration-700 
                          group-hover:scale-110
                        "
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg group-hover:text-blue-300 transition-colors">
                        {category.name}
                      </h3>
                      {category.description &&
                        category.description.trim() !== category.name && (
                          <p className="mt-2 text-sm text-white/90 line-clamp-2 drop-shadow">
                            {category.description}
                          </p>
                        )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
