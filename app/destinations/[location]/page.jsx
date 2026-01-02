"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";
import { Clock, Users, Star, MapPin } from "lucide-react"; // Optional: add lucide-react for icons

export default function LocationActivitiesPage() {
  const { location } = useParams();
  const decodedLocation = decodeURIComponent(location);

  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetActivitiesQuery({
    page,
    limit,
    location: decodedLocation,
    isActive: true,
  });

  const activities = data?.activities || [];
  const totalPages = data?.pages || 1;
  const totalActivities = data?.total || 0;

  // Helper: Get lowest price across all variants
  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return null;
    const prices = variants.flatMap((v) =>
      v.pricing.map((p) => p.price)
    );
    return Math.min(...prices);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Experiences in {decodedLocation}</h1>
        <p className="text-lg text-slate-600 mb-10">Discover the best tours and activities</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-64 bg-slate-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse mt-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-slate-600 mb-6">We couldn't load activities for {decodedLocation}.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Top Experiences in {decodedLocation}
        </h1>
        <p className="text-lg text-slate-600">
          {totalActivities} {totalActivities === 1 ? "activity" : "activities"} available
        </p>
      </div>

      {/* No results */}
      {activities.length === 0 ? (
        <div className="text-center py-20">
          <MapPin className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-slate-700 mb-3">
            No activities found in {decodedLocation}
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Try checking nearby areas or explore popular destinations.
          </p>
          <Link
            href="/"
            className="inline-block mt-8 px-8 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition"
          >
            Explore All Destinations
          </Link>
        </div>
      ) : (
        <>
          {/* Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activities.map((activity) => {
              const startingPrice = getStartingPrice(activity.variants);
              const mainImage = activity.images?.find((img) => img.isMain)?.url || activity.images?.[0]?.url;

              return (
                <Link
                  key={activity._id}
                  href={`/tours/${activity._id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={mainImage || "/placeholder.jpg"}
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {activity.duration?.hours && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.duration.hours}h
                      </div>
                    )}
                    {activity.liveGuide && (
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Live Guide
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {activity.category && (
                        <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                          {activity.category}
                        </span>
                      )}
                      <h3 className="font-bold text-xl mt-2 line-clamp-2 group-hover:text-amber-700 transition">
                        {activity.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 line-clamp-3">
                        {activity.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="font-medium">
                          {activity.rating || "New"}
                        </span>
                        {activity.reviewCount > 0 && (
                          <span className="text-sm text-slate-500">
                            ({activity.reviewCount})
                          </span>
                        )}
                      </div>

                      {startingPrice && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-600">
                            AED {startingPrice}
                          </p>
                          <p className="text-xs text-slate-500">per person</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="px-6 py-3 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Previous
              </button>

              <span className="text-slate-700 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="px-6 py-3 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          )}

          {isFetching && page > 1 && (
            <p className="text-center text-slate-500 mt-8">Loading more activities...</p>
          )}
        </>
      )}
    </div>
  );
}