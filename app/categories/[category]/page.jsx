"use client";

import { useGetActivitiesByCategoryQuery } from "@/features/activity/activityApi";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Clock, MapPin, Ticket } from "lucide-react";

export default function ActivityPage() {
  const { category } = useParams();

  const { data, error, isLoading, isFetching } =
    useGetActivitiesByCategoryQuery({ category });
  console.log("data", data);
  const activities = data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-red-600 font-medium">
          {error?.data?.message ||
            "Failed to load activities. Please try again later."}
        </p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 rounded-xl p-12 max-w-md mx-auto">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-2xl font-medium text-gray-700">
            No activities found
          </p>
          <p className="text-gray-500 mt-2">Try exploring other categories!</p>
        </div>
      </div>
    );
  }

  // Helper: Get lowest price from variants
  const getLowestPrice = (variants) => {
    if (!variants || variants.length === 0) return null;
    let minPrice = Infinity;
    let currency = "AED";

    variants.forEach((variant) => {
      variant.pricing?.forEach((p) => {
        if (p.price < minPrice) {
          minPrice = p.price;
          currency = p.currency;
        }
      });
    });

    return minPrice === Infinity ? null : { price: minPrice, currency };
  };

  // Helper: Format duration
  const formatDuration = (duration) => {
    if (!duration) return null;
    return duration.hours ? `${duration.hours} hours` : duration.label;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 capitalize text-center">
        {category.replace("-", " ")} Activities
      </h1>
      <p className="text-center text-xl text-gray-600 mb-12">
        Discover the best experiences in Dubai
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {activities.map((activity) => {
          const mainImage =
            activity.images?.find((img) => img.isMain) || activity.images?.[0];
          const lowestPrice = getLowestPrice(activity.variants);
          const durationLabel = formatDuration(activity.duration);

          return (
            <div
              key={activity._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage.url.replace("<", "").replace(">", "")}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="bg-gray-200 h-full flex items-center justify-center">
                    <Ticket className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Rating Badge */}
                {activity.rating > 0 && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">
                      {activity.rating}
                    </span>
                    {activity.reviewCount > 0 && (
                      <span className="text-xs text-gray-600">
                        ({activity.reviewCount})
                      </span>
                    )}
                  </div>
                )}

                {/* Category Tag */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {activity.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {activity.title}
                </h3>

                <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                  {activity.shortDescription || activity.fullDescription}
                </p>

                {/* Info Row */}
                <div className="space-y-3 mb-6">
                  {durationLabel && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">{durationLabel}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm capitalize">
                      {activity.location || "Dubai"}
                    </span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  {lowestPrice ? (
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <p className="text-2xl font-bold text-gray-900">
                        {lowestPrice.currency} {lowestPrice.price}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Price on request
                    </span>
                  )}

                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isFetching && !isLoading && (
        <div className="text-center mt-12">
          <p className="text-blue-600 font-medium">Updating activities...</p>
        </div>
      )}
    </div>
  );
}
