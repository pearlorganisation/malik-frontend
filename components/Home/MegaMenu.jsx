"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Compass, Search, X } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import {
  useGetPopularActivitiesQuery,
  useGetPopularLocationsQuery,
} from "@/features/activity/activityApi";

export default function MegaMenu() {
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Fetch data
  const { data: catResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({ limit: 30 });
  const categories = catResponse?.data || [];

  const { data: actResponse, isLoading: isLoadingActivities } =
    useGetPopularActivitiesQuery({ limit: 10 });
  const popularActivities = actResponse?.activities || [];

  const { data: locResponse, isLoading: isLoadingLocations } =
    useGetPopularLocationsQuery({ limit: 10 });
  const popularLocations = locResponse?.locations || [];

  // Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setIsSearchFocused(true);
    }
  }, []);

  // Filtering
  const lowerQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(lowerQuery)
  );

  const filteredLocations = popularLocations.filter((loc) =>
    loc.location.toLowerCase().includes(lowerQuery)
  );

  const filteredActivities = popularActivities.filter((act) =>
    act.title.toLowerCase().includes(lowerQuery)
  );

  const showContent = isSearchFocused || searchQuery !== "";

  return (
    <>
      {/* Mobile backdrop – only shown on mobile when menu is "open" (always in this case) */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => {
          // Optional: clear search when clicking backdrop on mobile
          setSearchQuery("");
          setIsSearchFocused(false);
        }}
      />

      {/* Mega Menu Container – always rendered */}
      <div
        ref={menuRef}
        className="fixed top-15 inset-x-0  z-50 px-4 pt-4  lg:px-8 lg:pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* SEARCH BAR – always visible */}
            <div className="p-5 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    if (searchQuery === "") {
                      setIsSearchFocused(false);
                    }
                  }}
                  placeholder="Search categories, destinations, tours..."
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* RESULTS CONTENT */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showContent
                  ? "max-h-[70vh] opacity-100 py-6 px-5"
                  : "max-h-0 opacity-0 py-0 px-5"
              }`}
            >
              <div className="overflow-y-auto max-h-[65vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Categories */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        Categories
                        {searchQuery && ` (${filteredCategories.length})`}
                      </h3>
                    </div>
                    {isLoadingCategories ? (
                      <div className="space-y-2">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="h-9 bg-slate-100 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ) : filteredCategories.length === 0 && searchQuery ? (
                      <p className="text-slate-500 text-sm">
                        No categories found
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {filteredCategories
                          .slice(0, searchQuery ? undefined : 10)
                          .map((category) => (
                            <Link
                              key={category._id}
                              href={`/categories/${
                                category.slug || category.name
                              }`}
                              className="block px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-all text-sm font-medium text-slate-700"
                            >
                              {category.name}
                            </Link>
                          ))}
                        {!searchQuery && categories.length > 10 && (
                          <Link
                            href="/categories"
                            className="block text-center mt-4 text-sm font-medium text-amber-600 hover:underline"
                          >
                            View all categories →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Destinations */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        Destinations
                        {searchQuery && ` (${filteredLocations.length})`}
                      </h3>
                    </div>
                    {isLoadingLocations ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 bg-slate-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : filteredLocations.length === 0 && searchQuery ? (
                      <p className="text-slate-500 text-sm">
                        No destinations found
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {filteredLocations.map((loc) => (
                          <Link
                            key={loc.location}
                            href={`/destinations/${encodeURIComponent(
                              loc.location.toLowerCase().replace(/\s+/g, "-")
                            )}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-all group"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={loc.image?.url || "/placeholder.jpg"}
                                alt={loc.location}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 group-hover:text-amber-700 truncate">
                                {loc.location}
                              </p>
                              <p className="text-xs text-slate-600">
                                {loc.totalActivities} activities
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Popular Tours */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-slate-800">
                        Popular Tours
                        {searchQuery && ` (${filteredActivities.length})`}
                      </h3>
                    </div>
                    {isLoadingActivities ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 bg-slate-100 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : filteredActivities.length === 0 && searchQuery ? (
                      <p className="text-slate-500 text-sm">No tours found</p>
                    ) : (
                      <div className="space-y-3">
                        {filteredActivities.map((activity) => (
                          <Link
                            key={activity._id}
                            href={`/activity/${activity._id}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-all group"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  activity.images?.[0]?.url ||
                                  "/placeholder.jpg"
                                }
                                alt={activity.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 group-hover:text-amber-700 line-clamp-2 text-sm">
                                {activity.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                ⭐ {activity.rating || "N/A"} (
                                {activity.reviewCount || 0} reviews)
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
