"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { Clock, Star, ChevronDown } from "lucide-react";
import CategoryBalls from "@/components/Category/CategoryBalls";

/* =========================
   SUSPENSE WRAPPER
========================= */
export default function ActivitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading page…
        </div>
      }
    >
      <ActivitiesContent />
    </Suspense>
  );
}

/* =========================
   ACTUAL PAGE CONTENT
========================= */
function ActivitiesContent() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  /* ===== Categories ===== */
  const { data: categoryResponse } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
  });

  const sidebarCategories = categoryResponse?.data || [];

  /* ===== Activities ===== */
  const { data, isLoading, error } = useGetActivitiesQuery({
    page: 1,
    limit: 20,
    categories: selectedCategories.length
      ? selectedCategories.join(",")
      : undefined,
    duration: selectedDuration || undefined,
  });

  const activities = data?.activities || [];
  const total = data?.total || 0;

  /* ===== TOGGLES ===== */
  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const toggleDuration = (value) => {
    setSelectedDuration((prev) => (prev === value ? "" : value));
  };

  /* ===== HELPERS ===== */
  const getMainImage = (activity) =>
    activity.images?.find((img) => img.isMain)?.url ||
    activity.images?.[0]?.url ||
    "/placeholder.jpg";

  const getLowestPrice = (activity) => {
    let min = Infinity;
    activity.variants?.forEach((v) =>
      v.pricing?.forEach((p) => {
        if (p.price > 0 && p.price < min) min = p.price;
      })
    );
    return min === Infinity ? 0 : min;
  };

  /* ===== STATES ===== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading activities…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load activities
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <nav className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>{" "}
            / <span className="text-gray-900">Dubai Activities</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Curated Dubai Experiences
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-picked premium activities with flexible plans & trusted
            experiences
          </p>
        </div>
      </div>

      {/* Category Balls */}
      <CategoryBalls
        limit={8}
        showAllLink
        setSelectedCategory={(category) =>
          setSelectedCategories([category])
        }
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">{total} experiences found</p>
          <button className="flex items-center gap-1 text-sm text-gray-700">
            Recommended <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-3">
                {sidebarCategories.map((cat) => (
                  <li key={cat._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <span>{cat.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Duration</h3>
              {[
                { label: "Up to 1 hour", value: "0-1" },
                { label: "1–4 hours", value: "1-4" },
                { label: "4 hours–1 day", value: "4-24" },
                { label: "Multi-day", value: "24+" },
              ].map((d) => (
                <label
                  key={d.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedDuration === d.value}
                    onChange={() => toggleDuration(d.value)}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </aside>

          {/* Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Link
                key={activity._id}
                href={`/activity/${activity._id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="relative h-52">
                  <Image
                    src={getMainImage(activity)}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-bold line-clamp-2">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm">
                    <Clock size={14} />
                    {activity.duration?.hours}h
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      AED {getLowestPrice(activity)}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
