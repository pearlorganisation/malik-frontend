"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

// Dummy popular cities
const popularCities = [
  {
    name: "Dubai",
    slug: "dubai",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=600&h=400&fit=crop",
  },
  {
    name: "Abu Dhabi",
    slug: "abu-dhabi",
    image:
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=600&h=400&fit=crop",
  },
  {
    name: "Sharjah",
    slug: "sharjah",
    image:
      "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=600&h=400&fit=crop",
  },
  {
    name: "Paris",
    slug: "paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
  },
  {
    name: "London",
    slug: "london",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
  },
  {
    name: "New York",
    slug: "new-york",
    image:
      "https://images.unsplash.com/photo-1549921296-3c7c7d5f4c47?w=600&h=400&fit=crop",
  },
];

// Dummy popular tours
const popularTours = [
  {
    id: 1,
    title: "Desert Safari with BBQ Dinner",
    price: "AED 250",
    rating: 4.8,
    reviews: 1250,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Burj Khalifa At The Top",
    price: "AED 169",
    rating: 4.9,
    reviews: 3420,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea6868da738?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Dubai Marina Yacht Tour",
    price: "AED 399",
    rating: 4.7,
    reviews: 890,
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Abu Dhabi City Tour",
    price: "AED 300",
    rating: 4.6,
    reviews: 670,
    image:
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Dhow Cruise with Dinner",
    price: "AED 150",
    rating: 4.5,
    reviews: 2100,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Hot Air Balloon Ride",
    price: "AED 999",
    rating: 5.0,
    reviews: 450,
    image:
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=400&fit=crop",
  },
];

export default function MegaMenu({ isOpen = false, onClose = () => {} }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const { data: response, isLoading } = useGetCategoriesQuery({ limit: 30 });
  const categories = response?.data || [];

  // Filter results
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTours = popularTours.filter((tour) =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkClick = () => {
    setSearchQuery("");
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchQuery("");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-screen overlay container */}
      <div className="fixed inset-x-0 top-24 z-80 px-4 pt-4 lg:top-32 lg:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Search feedback */}
              {searchQuery && (
                <p className="text-xs text-slate-500 mb-4">
                  Results for "
                  <span className="font-medium text-slate-700">
                    {searchQuery}
                  </span>
                  "
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Categories & Activities */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">
                      {filteredCategories.length}
                    </span>
                    Categories & Activities
                  </h3>

                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-slate-100 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredCategories.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No categories found
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredCategories.slice(0, 8).map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category._id}`}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-all border border-transparent hover:border-amber-200"
                        >
                          {category.image?.secure_url ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                              <Image
                                src={category.image.secure_url}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="font-medium text-slate-800 group-hover:text-amber-700 text-sm">
                            {category.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchQuery === "" && filteredCategories.length > 8 && (
                    <Link
                      href="/categories"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Categories →
                    </Link>
                  )}
                </div>

                {/* Popular Destinations - Circular image left, name right */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={24} className="text-amber-500" />
                    Popular Destinations
                  </h3>

                  {filteredCities.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No destinations found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredCities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/cities/${city.slug}`}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300"
                        >
                          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md shrink-0">
                            <Image
                              src={city.image}
                              alt={city.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 group-hover:text-amber-700">
                              {city.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Explore top experiences
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchQuery === "" && (
                    <Link
                      href="/destinations"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Destinations →
                    </Link>
                  )}
                </div>

                {/* Popular Tours - Same style: Circular image left, info right */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Popular Tours
                  </h3>

                  {filteredTours.length === 0 && searchQuery ? (
                    <p className="text-sm text-slate-500 py-4">
                      No tours found
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredTours.map((tour) => (
                        <Link
                          key={tour.id}
                          href={`/tours/${tour.id}`}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50 transition-all duration-300 border border-transparent hover:border-amber-200"
                        >
                          {/* Circular Image */}
                          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md shrink-0">
                            <Image
                              src={tour.image}
                              alt={tour.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Rating Badge */}
                            <div className="absolute -top-1 -right-1 bg-white shadow-md px-2 py-1 rounded-full text-xs font-bold text-slate-700">
                              ★ {tour.rating}
                            </div>
                          </div>

                          {/* Tour Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 group-hover:text-amber-700 line-clamp-2">
                              {tour.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-slate-500">
                                {tour.reviews.toLocaleString()} reviews
                              </p>
                              <p className="text-lg font-bold text-amber-600">
                                {tour.price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchQuery === "" && (
                    <Link
                      href="/tours"
                      onClick={handleLinkClick}
                      className="block mt-4 text-sm text-amber-600 font-medium hover:underline"
                    >
                      View All Tours →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-70 lg:hidden"
        onClick={() => {
          setSearchQuery("");
          onClose();
        }}
      />
    </>
  );
}
