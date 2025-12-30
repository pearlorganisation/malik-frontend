"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi.js";
import {
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import CategoryBalls from "@/components/Category/CategoryBalls";

export default function ActivitiesPage() {

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const { data: categoryResponse } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
  });
  const sidebarCategories = categoryResponse?.data || [];


 const { data, isLoading, error } = useGetActivitiesQuery(
  {
    page: 1,
    limit: 20,
    categories: selectedCategories.length ? selectedCategories.join(",") : undefined, 
    duration: selectedDuration || undefined,
  },
  { skip: false } // optional, ensures query is always active
);
  const activities = data?.activities || [];
  const total = data?.total || 0;

  // ===== TOGGLE FUNCTIONS =====
const toggleCategory = (name) => {
  setSelectedCategories((prev) =>
    prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
  );
};

const toggleDuration = (value) => {
  setSelectedDuration((prev) => (prev === value ? "" : value));
};


  // ===== HELPER FUNCTIONS =====
  const getMainImage = (activity) =>
    activity.images?.find((img) => img.isMain)?.url ||
    activity.images?.[0]?.url ||
    "/placeholder.jpg";

  const getLowestPrice = (activity) => {
    let min = Infinity;
    activity.variants.forEach((v) =>
      v.pricing.forEach((p) => {
        if (p.price > 0 && p.price < min) min = p.price;
      })
    );
    return min === Infinity ? 0 : min;
  };

  const getMaxDiscount = (activity) =>
    Math.max(...activity.variants.map((v) => v.discount?.percentage || 0));

  // ===== LOADING / ERROR =====
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading activities…
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load activities
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-indigo-600">Home</Link> /{" "}
            <span className="text-gray-900">Dubai Activities</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Curated Dubai Experiences
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-picked premium activities with flexible plans & trusted experiences
          </p>
        </div>
      </div>

      {/* Category Balls */}
      <CategoryBalls
        limit={8}
        showAllLink={true}
        setSelectedCategory={(category) =>
    setSelectedCategories([category]) 
  }
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">{total} experiences found</p>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600">
            Recommended <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-3">
                {sidebarCategories.map((cat) => (
                  <li key={cat._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="rounded text-indigo-600"
                    />
                    <span>{cat.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Duration</h3>
              <ul className="space-y-3">
                {[
                  { label: "Up to 1 hour", value: "0-1" },
                  { label: "1–4 hours", value: "1-4" },
                  { label: "4 hours–1 day", value: "4-24" },
                  { label: "Multi-day", value: "24+" },
                ].map((d) => (
                  <li key={d.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedDuration === d.value}
                      onChange={() => toggleDuration(d.value)}
                      className="rounded text-indigo-600"
                    />
                    <span>{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Activity Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Link
                key={activity._id}
                href={`/activity/${activity._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-52">
                  <Image
                    src={getMainImage(activity)}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />

                  <span className="absolute top-4 left-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-r-md">
                    {activity.variants?.length > 1 ? "BEST SELLER" : "BEST VALUE"}
                  </span>

                  {activity.cancellationPolicy?.isFreeCancellation && (
                    <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                      ✓ Free Cancel
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{activity.title}</h3>

                  <div className="flex items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{activity.duration?.hours}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Dubai Area</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-between">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {activity.variants.length} {activity.variants.length === 1 ? "Plan" : "Plans"}
                    </span>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-900">4.8</span>
                      <span className="text-xs">(1,234)</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <span className="text-xs text-gray-500 block">FROM</span>
                      <span className="text-2xl font-extrabold text-gray-900">
                        AED {getLowestPrice(activity)}
                      </span>
                    </div>

                    <span className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded-full hover:bg-slate-800 transition">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
