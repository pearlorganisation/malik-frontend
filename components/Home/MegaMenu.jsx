"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetPopularActivitiesQuery } from "@/features/activity/activityApi"; // <-- Add this import

// Dummy popular cities (kept as-is)
const popularCities = [
  {
    name: "Dubai",
    slug: "dubai",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=600&h=400&fit=crop",
  },
  {
    name: "Abu Dhabi",
    slug: "abu-dhabi",
    image:
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=600&h=400&fit=crop",
  },
  {
    name: "Sharjah",
    slug: "sharjah",
    image:
      "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=600&h=400&fit=crop",
  },
  {
    name: "Paris",
    slug: "paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
  },
  {
    name: "London",
    slug: "london",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
  },
  {
    name: "New York",
    slug: "new-york",
    image:
      "https://images.unsplash.com/photo-1549921296-3c7c7d5f4c47?w=600&h=400&fit=crop",
  },
];

export default function MegaMenu({ isOpen = false, onClose = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const { data: catResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({ limit: 30 });
  const categories = catResponse?.data || [];

  // Fetch popular activities (tours)
  const { data: actResponse, isLoading: isLoadingActivities } =
    useGetPopularActivitiesQuery({ limit: 10 });
  const popularActivities = actResponse?.activities || [];

  // Filter results
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = popularActivities.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkClick = () => {
    setSearchQuery("");
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchQuery("");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen overlay container */}
      <div className="fixed inset-x-0 top-24 z-80 px-4 pt-4 lg:top-32 lg:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Search feedback */}
              {searchQuery && (
                <p className="text-xs text-slate-500 mb-4">
                  Results for "
                  <span className="font-medium text-slate-700">
                    {searchQuery}
                  </span>
                  "
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Categories & Activities */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">
                      {filteredCategories.length}
                    </span>
                    Categories & Activities
                  </h3>

                  {isLoadingCategories ? (
                    <div className="grid grid-cols-1 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-slate-100 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredCategories.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No categories found
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredCategories.slice(0, 8).map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category._id}`}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200"
                        >
                          {category.image?.secure_url ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                              <Image
                                src={category.image.secure_url}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="font-medium text-slate-800 group-hover:text-amber-700 text-sm">
                            {category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchQuery === "" && filteredCategories.length > 8 && (
                    <Link
                      href="/categories"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Categories →
                    </Link>
                  )}
                </div>

                {/* Popular Destinations */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={24} className="text-amber-500" />
                    Popular Destinations
                  </h3>

                  {filteredCities.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No destinations found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredCities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/cities/${city.slug}`}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300"
                        >
                          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md shrink-0">
                            <Image
                              src={city.image}
                              alt={city.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 group-hover:text-amber-700">
                              {city.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Explore top experiences
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchQuery === "" && (
                    <Link
                      href="/destinations"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Destinations →
                    </Link>
                  )}
                </div>

                {/* Popular Tours / Activities from API */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Popular Tours
                  </h3>

                  {isLoadingActivities ? (
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 animate-pulse"
                        >
                          <div className="w-14 h-14 rounded-full bg-slate-200" />
                          <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredActivities.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No tours found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredActivities.map((activity) => (
                        <Link
                          key={activity._id}
                          href={`/tours/${activity._id}`} // Adjust slug if needed
                          onClick={handleLinkClick}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300 border border-transparent hover:border-amber-200"
                        >
                          {/* Circular Image */}
                          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md shrink-0">
                            <Image
                              src={
                                activity.images?.[0]?.url || "/placeholder.jpg"
                              }
                              alt={activity.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Rating Badge */}
                            {activity.rating && (
                              <div className="absolute -top-1 -right-1 bg-white shadow-md px-2 py-1 rounded-full text-xs font-bold text-slate-700">
                                ★ {activity.rating.toFixed(1)}
                              </div>
                            )}
                          </div>

                          {/* Tour Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 group-hover:text-amber-700 line-clamp-2">
                              {activity.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-slate-500">
                                {activity.reviewCount || 0} reviews
                              </p>
                              <p className="text-lg font-bold text-amber-600">
                                AED {activity.price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchQuery === "" && (
                    <Link
                      href="/tours"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Tours →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-70 lg:hidden"
        onClick={() => {
          setSearchQuery("");
          onClose();
        }}
      />
    </>
  );
}
