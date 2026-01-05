"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Compass } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import {
  useGetPopularActivitiesQuery,
  useGetPopularLocationsQuery,
} from "@/features/activity/activityApi";

export default function MegaMenu({ isOpen = false, onClose = () => {} }) {
  const menuRef = useRef(null);

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

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Use capture phase to catch clicks before they reach links
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mega Menu */}
      <div
        ref={menuRef}
        className="fixed inset-x-0 top-14 z-50 px-4 pt-4 lg:top-26 lg:px-0"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from bubbling up
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Categories */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-slate-800">
                      Categories
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
                  ) : (
                    <div className="space-y-1">
                      {categories.slice(0, 10).map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category.name}`}
                          className="block px-3 py-2 rounded-lg hover:bg-amber-100 transition-all text-sm font-medium text-slate-700 hover:text-amber-700"
                        >
                          {category.name}
                        </Link>
                      ))}
                      {categories.length > 10 && (
                        <Link
                          href="/categories"
                          className="block text-center mt-3 text-sm text-amber-600 font-medium hover:underline"
                        >
                          View all →
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Popular Destinations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-slate-800">
                      Destinations
                    </h3>
                  </div>

                  {isLoadingLocations ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-14 bg-slate-100 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {popularLocations.map((loc) => (
                        <Link
                          key={loc.location}
                          href={`/destinations/${encodeURIComponent(
                            loc.location.toLowerCase()
                          )}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-100 transition-all group"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={loc.image?.url || "/placeholder.jpg"}
                              alt={loc.location}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
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
                    </h3>
                  </div>

                  {isLoadingActivities ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-14 bg-slate-100 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {popularActivities.map((activity) => (
                        <Link
                          key={activity._id}
                          href={`/activity/${activity._id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-100 transition-all group"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                activity.images?.[0]?.url || "/placeholder.jpg"
                              }
                              alt={activity.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 group-hover:text-amber-700 line-clamp-2 text-sm">
                              {activity.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              ⭐ {activity.rating} ({activity.reviewCount}{" "}
                              reviews)
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

      {/* Mobile Backdrop - extra safety for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
    </>
  );
}
