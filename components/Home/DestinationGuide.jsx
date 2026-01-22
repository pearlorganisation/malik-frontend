"use client";

import Image from "next/image";
import { MapPin, Compass, Sparkles, ChevronRight, Tag } from "lucide-react";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";


const popularTags = [
  "Desert Safari",
  "Family Friendly",
  "Kids Park",
  "Couple Offers",
  "Luxury Yacht",
  "Budget Tours",
  "Evening Shows",
  "Camel Ride",
  "Burj Khalifa Tickets",
  "Water Parks",
  "City Sightseeing",
  "Private Car",
  "Adventure Sports",
];

export default function DestinationGuide() {
  const { data, isLoading, error } = useGetAllPlacesQuery();

  // Extract the array of places from the API response
  const destinations = data?.data || [];

const {
  data: categoryResponse,
  isLoading: categoryLoading,
  error: categoryError,
} = useGetCategoriesQuery({
  page: 1,
  limit: 24,
});

 
const categories = categoryResponse?.data ?? [];


  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 font-medium">
        Loading destinations...
      </div>
    );
  }

  if (error) {
    console.error("Error fetching places:", error);
    return <div className="py-24 text-center text-red-400">Error loading data.</div>;
  }

  if (destinations.length === 0) {
    return (
      <div className="py-24 text-center text-slate-500">
        No destinations available at the moment.
      </div>
    );
  }

  return (
    <section className="bg-white py-12 md:py-16 font-sans border-t border-gray-100 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-2 block flex items-center gap-2">
              <Compass className="w-4 h-4" /> Destination Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Explore the Emirates & Beyond
            </h2>
          </div>
          
          {/* Desktop Scroll Hint */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            Scroll to explore <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Scroll Container */}
        <div className="flex overflow-x-auto gap-3 pb-8 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth no-scrollbar snap-x snap-mandatory mb-8">
          {destinations.map((dest) => (
            <Link
              href={`/places/${dest._id}`}
              key={dest._id}
              className="group relative h-[220px] md:h-[250px] min-w-[180px] md:min-w-[200px] w-[180px] md:w-[200px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-500 snap-center bg-gray-100 border border-gray-100 block"
            >
              {/* Hero Image */}
              <Image
                src={dest.heroImage || "https://picsum.photos/600/800"} 
                alt={dest.name}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                priority={false}
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Location Badge */}
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300 shadow-lg">
                  <MapPin className="w-2 h-2" /> {dest.country || "UAE"}
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-left">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-[9px] uppercase tracking-wider mb-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <Sparkles className="w-2 h-2" /> Featured
                  </div>
                  <h3 className="text-white text-base md:text-lg font-black leading-tight group-hover:text-white transition-colors line-clamp-2">
                    {dest.name}
                  </h3>
                  <div className="h-0.5 w-6 bg-yellow-500 mb-1 group-hover:w-12 transition-all duration-500" />
                  <p className="text-slate-300 text-[9px] font-medium line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                    {dest.tagline || dest.about || "Discover amazing experiences."}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Spacer for mobile scroll */}
          <div className="w-2 shrink-0 md:hidden" />
        </div>

        {/* Popular Interests Tags Section */}
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-50 p-1.5 rounded-full text-blue-600">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Browse by Interest</h3>
          </div>

    <div className="flex flex-wrap gap-2">
  {categoryLoading && (
    <span className="text-sm text-gray-400">
      Loading categories...
    </span>
  )}

  {categoryError && (
    <span className="text-sm text-red-400">
      Failed to load categories
    </span>
  )}

  {!categoryLoading && !categoryError && categories.length === 0 && (
    <span className="text-sm text-gray-400">
      No categories available
    </span>
  )}

  {categories.map((category) => (
    <Link
      key={category._id}
      href={`/activity?category=${category._id}`}
      className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
    >
      {category.name}
    </Link>
  ))}
</div>


        </div>
      </div>
    </section>
  );
}