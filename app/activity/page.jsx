"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import {
  Clock,
  Heart,
  Star,
  Calendar,
  ChevronDown,
  Search,
} from "lucide-react";

export default function ActivitiesPage() {
  const { data, isLoading, error } = useGetActivitiesQuery({ page: 1, limit: 20 });
  const activities = data?.activities || [];
  const total = data?.total || 0;

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
      <Link href="/" className="hover:text-indigo-600">
        Home
      </Link>{" "}
      / <span className="text-gray-900">Dubai Activities</span>
    </nav>

    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
      Curated Dubai Experiences
    </h1>

    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
      Hand-picked premium activities with flexible plans & trusted experiences
    </p>
  </div>
</div>


      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">{total} experiences found</p>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600">
            Recommended <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters */}
          <aside className="space-y-6">
            {[
              {
                title: "Categories",
                items: [
                  "Tours & Sightseeing",
                  "Art & Culture",
                  "Food & Drink",
                  "Outdoor Activities",
                  "Tickets & Passes",
                ],
              },
              {
                title: "Duration",
                items: [
                  "Up to 1 hour",
                  "1–4 hours",
                  "4 hours–1 day",
                  "Multi-day",
                ],
              },
            ].map((block) => (
              <div
                key={block.title}
                className="bg-white rounded-xl p-5 shadow-sm"
              >
                <h3 className="font-semibold mb-4">{block.title}</h3>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-600"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const price = getLowestPrice(activity);
              const discount = getMaxDiscount(activity);

              return (
               <Link
  key={activity._id}
  href={`/activity/${activity._id}`}
  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
>
  {/* Image */}
  <div className="relative h-52">
    <Image
      src={getMainImage(activity)}
      alt={activity.title}
      fill
      className="object-cover"
    />

    {/* Ribbon */}
    <span className="absolute top-4 left-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-r-md">
      {activity.variants?.length > 1 ? "BEST SELLER" : "BEST VALUE"}
    </span>

    {/* Rating
    <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="text-sm font-semibold">4.8</span>
      <span className="text-xs text-gray-500">(1,234)</span>
    </div> */}

    {/* Free Cancel */}
    {activity.cancellationPolicy?.isFreeCancellation && (
      <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
        ✓ Free Cancel
      </div>
    )}
  </div>

  {/* Content */}
  <div className="p-5 space-y-4">
    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
      {activity.title}
    </h3>

    

    {/* Duration & Location */}
    <div className="flex items-center gap-5 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <Clock size={16} />
        <span>{activity.duration?.hours}h</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Dubai Area</span>
      </div>
    </div>

    {/* Plans */}
    <div className="flex gap-2 justify-between">
      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
        {activity.variants.length}{" "}
        {activity.variants.length === 1 ? "Plan" : "Plans"}
      </span>
        {/* Rating */}
  <div className="flex items-center gap-1 text-sm text-gray-600">
    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
    <span className="font-semibold text-gray-900">4.8</span>
    <span className="text-xs">(1,234)</span>
  </div>
    </div>

    {/* Price & Button */}
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

              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
