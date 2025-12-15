"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Star, MapPin, Check, ChevronRight } from "lucide-react";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";

const getStartingPrice = (variants = []) => {
  const prices = [];
  variants.forEach((v) =>
    v.pricing?.forEach((p) => p.price > 0 && prices.push(p.price))
  );
  return prices.length ? Math.min(...prices) : null;
};

export default function ActivitiesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetActivitiesQuery({
    page: 1,
    limit: 12,
    isActive: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-gray-600">Loading premium experiences…</p>
      </div>
    );
  }

  if (isError || !data?.activities?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-red-600">Unable to load activities</p>
      </div>
    );
  }

  return (
    <section className="bg-white min-h-screen">
      {/* Clean Header */}
      <div className="py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Curated Dubai Experiences
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Hand-picked premium activities for unforgettable moments
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="overflow-x-auto px-6 pb-12 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {data.activities.map((activity, index) => {
            const price = getStartingPrice(activity.variants);
            const durationHours = activity.duration?.hours || 6;
            const rating = activity.rating > 0 ? activity.rating.toFixed(1) : "4.8";
            const reviewCount = activity.reviewCount || 1234 + index * 200;
            const hasFreeCancellation = activity.cancellationPolicy?.isFreeCancellation;
            const location = activity.pickup?.included ? "Pickup Included" : "Dubai Area";

            // Simulated dynamic ribbons & tags
            const ribbons = ["BEST VALUE", "BEST SELLER", "EXCLUSIVE", "TOP PICK", "NEW"];
            const ribbon = ribbons[index % ribbons.length];
            const ribbonColors = {
              "BEST VALUE": "bg-blue-600",
              "BEST SELLER": "bg-red-600",
              "EXCLUSIVE": "bg-purple-600",
              "TOP PICK": "bg-orange-600",
              "NEW": "bg-emerald-600",
            };

            const tags = [
              ["Adventure", "Family Friendly", "Dinner"],
              ["Luxury", "VIP", "Evening"],
              ["Couple", "Romantic", "Private"],
              ["Adrenaline", "Self-Drive", "Buggy"],
              ["Culture", "History", "Mosque"],
            ][index % 5] || ["Adventure", "Family Friendly"];

            return (
              <div
                key={activity._id}
                className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/activity/${activity._id}`)}
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <img
                    src={activity.images?.[0]?.url || "https://via.placeholder.com/400x300?text=Dubai+Experience"}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Ribbon Badge */}
                  <div className="absolute top-0 left-0">
                    <span className={`${ribbonColors[ribbon]} text-white text-xs font-bold px-5 py-1.5 transform -rotate-45 -translate-x-3 -translate-y-3 shadow-lg`}>
                      {ribbon}
                    </span>
                  </div>

                  {/* Rating & Free Cancellation */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <Star size={15} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {rating}
                      </span>
                      <span className="text-xs text-gray-500">({reviewCount.toLocaleString()})</span>
                    </div>

                    {hasFreeCancellation && (
                      <div className="bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                        <Check size={14} />
                        Free Cancel
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {activity.title}
                  </h3>

                  {/* Duration & Location */}
                  <div className="flex items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{durationHours}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span className="truncate max-w-32">{location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price & Better Aligned View Details Button */}
                  <div className="flex items-end justify-between">
                    <div className="space-y-0">
                      <span className="text-xs text-gray-600 block">FROM</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {price ? `AED ${price}` : "On request"}
                      </span>
                    </div>

                    <button className="bg-slate-900 text-white font-medium text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 hover:gap-2 hover:bg-slate-800 transition-all">
                      View Details
                      <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}