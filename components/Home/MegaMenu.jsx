"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Compass } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import {
  useGetPopularActivitiesQuery,
  useGetPopularLocationsQuery,
} from "@/features/activity/activityApi";

export default function MegaMenu({
  searchQuery = "",
  isSearchFocused = false,
  onClose,
}) {
  // Data fetching
  const { data: catRes } = useGetCategoriesQuery({ limit: 30 });
  const categories = catRes?.data || [];

  const { data: actRes } = useGetPopularActivitiesQuery({ limit: 10 });
  const popularActivities = actRes?.activities || [];

  const { data: locRes } = useGetPopularLocationsQuery({ limit: 10 });
  const popularLocations = locRes?.locations || [];

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

  if (!showContent) return null;

  return (
    <div
      className="bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 overflow-hidden w-175 max-w-[95vw]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-8 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Tag className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Categories
                {searchQuery && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({filteredCategories.length})
                  </span>
                )}
              </h3>
            </div>
            {filteredCategories.length === 0 ? (
              <p className="text-slate-400 text-sm italic">
                No categories matching "{searchQuery}"
              </p>
            ) : (
              <div className="space-y-1">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/categories/${cat.slug || cat._id}`}
                    onClick={onClose}
                    className="w-full text-left block px-4 py-2.5 rounded-xl hover:bg-slate-50 hover:text-amber-600 transition-all text-sm font-medium text-slate-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Destinations */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Destinations
                {searchQuery && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({filteredLocations.length})
                  </span>
                )}
              </h3>
            </div>
            {filteredLocations.length === 0 ? (
              <p className="text-slate-400 text-sm italic">
                No destinations found
              </p>
            ) : (
              <div className="space-y-3">
                {filteredLocations.map((loc) => (
                  <Link
                    key={loc._id || loc.location}
                    href={`/destinations/${encodeURIComponent(
                      loc.location.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    onClick={onClose}
                    className="w-full text-left flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                      <Image
                        src={loc.image?.url || "/placeholder.jpg"}
                        alt={loc.location}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                        {loc.location}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
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
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Compass className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Popular Tours
                {searchQuery && (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({filteredActivities.length})
                  </span>
                )}
              </h3>
            </div>
            {filteredActivities.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No tours found</p>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((act) => (
                  <Link
                    key={act._id}
                    href={`/activity/${act._id}`}
                    onClick={onClose}
                    className="w-full text-left flex items-center gap-4 p-3 rounded-2xl hover:bg-emerald-50/50 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={act.images?.[0]?.url || "/placeholder.jpg"}
                        alt={act.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-2 text-sm leading-tight transition-colors">
                        {act.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-amber-500 text-xs">★</span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {act.rating || "N/A"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({act.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-50/80 px-8 py-4 flex justify-between items-center border-t border-slate-100">
        <button
          onClick={onClose}
          className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors"
        >
          View all results →
        </button>
      </div>
    </div>
  );
}
