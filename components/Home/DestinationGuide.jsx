"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";

export default function DestinationGuide() {
  const { data, isLoading, error } = useGetAllPlacesQuery();

  // Extract the array of places from the API response
  const destinations = data?.data || [];

  console.log("DESTINATIONS: ", destinations);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-gray-600">
        Loading destinations...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching places:", error);
    // You can still show fallback or empty state if needed
  }

  if (destinations.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        No destinations available at the moment.
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <p className="text-yellow-500 font-medium uppercase tracking-wider text-sm flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              Destination Guide
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Explore the Emirates & Beyond
            </h2>
          </div>

          <button className="mt-6 md:mt-0 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2">
            Scroll to explore
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-auto -mx-6 px-6 scrollbar-hide">
          <div className="flex gap-6 pb-4 min-w-max">
            {destinations.map((dest) => (
              <div
                key={dest._id} // Use unique _id instead of emirate
                className="relative w-80 shrink-0 rounded-3xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105"
              >
                {/* Hero Image */}
                <div className="aspect-[4/5] relative">
                  <Image
                    src={dest.heroImage || "/placeholder-destination.jpg"} // Fallback image if missing
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                    priority={false}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                </div>

                {/* Location Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {dest.country || "Explore"}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">{dest.name}</h3>
                  <div className="w-12 h-1 bg-yellow-400 mb-4" />
                  <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                    {dest.tagline ||
                      dest.about ||
                      "Discover amazing experiences in this beautiful destination."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
