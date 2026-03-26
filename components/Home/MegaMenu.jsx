"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Tag,
  Flame,
  Car,
  Waves,
  Anchor,
  Ticket,
  Camera,
  Crown,
  Landmark,
  Star,
  Grid2x2,
  Bike,
  Zap,
  Heart,
  DollarSign,
  Building2,
  TrendingUp,
  Users,
  Sparkles,
  Compass,
} from "lucide-react";

import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useGetTopRatedActivitiesQuery } from "@/features/activity/activityApi";

export default function MegaMenu({
  searchQuery = "",
  isSearchFocused = false,
  onClose,
}) {
  /* ================= DATA ================= */

  const { data: catRes } = useGetCategoriesQuery({ limit: 20 });
  const categories = catRes?.data || [];

  const { data: placesRes } = useGetAllPlacesQuery();
  const locations = placesRes?.data || [];

  const { data: actRes } = useGetTopRatedActivitiesQuery();
  const activities = actRes?.data || [];

  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(query)
  );

  const filteredLocations = locations.filter((l) =>
    l.name?.toLowerCase().includes(query)
  );

  const filteredActivities = activities
    .filter((a) => a.name?.toLowerCase().includes(query))
    .slice(0, 5);

    console.log("first",filteredActivities)
  const showContent = isSearchFocused || searchQuery !== "";
  if (!showContent) return null;

  /* ================= ICON LOGIC ================= */

  const getCategoryConfig = (name) => {
    const n = name.toLowerCase();
    if (n.includes("city") || n.includes("sightseeing"))
      return { Icon: Landmark, bg: "bg-blue-50", color: "text-blue-500" };
    if (n.includes("desert") || n.includes("safari"))
      return { Icon: Flame, bg: "bg-orange-50", color: "text-orange-500" };
    if (n.includes("buggy") || n.includes("dune"))
      return { Icon: Car, bg: "bg-red-50", color: "text-red-500" };
    if (n.includes("quad") || n.includes("bike"))
      return { Icon: Bike, bg: "bg-yellow-50", color: "text-yellow-500" };
    if (n.includes("yacht") || n.includes("cruise"))
      return { Icon: Anchor, bg: "bg-cyan-50", color: "text-cyan-500" };
    if (n.includes("water"))
      return { Icon: Waves, bg: "bg-sky-50", color: "text-sky-500" };
    if (n.includes("theme") || n.includes("park"))
      return { Icon: Grid2x2, bg: "bg-purple-50", color: "text-purple-500" };
    if (n.includes("sky") || n.includes("adventure"))
      return { Icon: Zap, bg: "bg-indigo-50", color: "text-indigo-500" };
    if (n.includes("vip") || n.includes("luxury"))
      return { Icon: Crown, bg: "bg-amber-50", color: "text-amber-500" };
    if (n.includes("ticket") || n.includes("attraction"))
      return { Icon: Ticket, bg: "bg-green-50", color: "text-green-500" };
    if (n.includes("photo"))
      return { Icon: Camera, bg: "bg-pink-50", color: "text-pink-500" };
    return { Icon: Tag, bg: "bg-slate-50", color: "text-slate-400" };
  };

  const experienceStyles = [
    { label: "Family Fun", Icon: Users, color: "text-pink-400" },
    { label: "Romantic Couple", Icon: Heart, color: "text-rose-400" },
    { label: "High Adrenaline", Icon: Zap, color: "text-yellow-500" },
    { label: "Budget Friendly", Icon: DollarSign, color: "text-green-500" },
    { label: "Cultural Heritage", Icon: Building2, color: "text-blue-500" },
    { label: "Trending Now", Icon: TrendingUp, color: "text-orange-500" },
  ];

  /* ================= UI ================= */

  return (
    <div
      className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.13)] border border-slate-100 overflow-hidden w-[900px] max-w-[96vw]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="px-5 pt-5 pb-0">
        <div className="grid grid-cols-[200px_200px_1fr] gap-4">

          {/* ================= CATEGORIES ================= */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Grid2x2 className="w-3 h-3 text-amber-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                All Collections
              </h3>
            </div>

            <div className="space-y-0">
              {filteredCategories.map((cat) => {
                const { Icon, bg, color } = getCategoryConfig(cat.name);
                return (
                  <Link
                    key={cat._id}
                    href={`/activity?category=${cat._id}`}
                    scroll={true}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <span className="text-[12.5px] font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= LOCATIONS + EXPERIENCE STYLES ================= */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Compass className="w-3 h-3 text-amber-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Key Locations
              </h3>
            </div>

            <div className="space-y-0">
              {filteredLocations.map((loc) => (
                <Link
                  key={loc._id}
                  href={`/activity?location=${loc._id}`}
                  scroll={true}
                  onClick={onClose}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-yellow-200 hover:text-yellow-600 transition-colors group"
                >
                  <Compass className="w-3 h-3 opacity-40 shrink-0 text-slate-500 group-hover:text-amber-500 group-hover:opacity-100 transition-all" />
                  <span className="text-[12.5px] font-medium text-slate-600 group-hover:text-orange-600">
                    {loc.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* <div className="mt-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Experience Styles
                </h3>
              </div>

              <div className="space-y-0">
                {experienceStyles.map(({ label, Icon, color }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors group"
                  >
                    <Icon className={`w-3 h-3 ${color} shrink-0`} />
                    <span className="text-[12.5px] font-medium text-slate-600 group-hover:text-slate-900">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* ================= TOP SELLING TOURS ================= */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="w-3 h-3 text-amber-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Top Selling Tours
              </h3>
            </div>

            <div className="space-y-1.5">
              {filteredActivities.map((act) => (
                <Link
                  key={act._id}
                  // href={`/activity/${act.slug}`}
                  href={`/activity?slug=${act.slug}`}
                  // href={`/activity/${tour.slug}`}
                  // href={`/activity`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white border border-transparent hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 group"
                >
                  {/* IMAGE */}
                  <div className="w-[52px] h-[46px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={act.image || "/placeholder.jpg"}
                      alt={act.name}
                      width={52}
                      height={46}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                        {act.categoryName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-[9.5px] font-semibold text-slate-700">
                          {act.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] font-bold text-slate-800 leading-snug truncate">
                      {act.name}
                    </p>

                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-orange-400" />
                        <span className="text-[9px] font-semibold text-orange-500 uppercase tracking-wide">
                          {act.location}
                        </span>
                      </div>

                      <div className="text-right mr-1">
                        <div className="text-[8px] text-slate-400 uppercase leading-none">
                          Starting at
                        </div>
                        <div className="text-[13px] font-bold text-slate-900 leading-tight">
                          ${act.startingPrice || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ARROW */}
                  <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-blue-600 transition-colors duration-200">
                    <svg width="5" height="9" viewBox="0 0 6 10" fill="none">
                      <path
                        d="M1 1l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 group-hover:text-white"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="flex items-center justify-between px-5 py-3 mt-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">⚡</span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
            Real-Time Availability
          </span>
        </div>
        <Link
          href="/activity"
          onClick={onClose}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase"
        >
          Explore All Experiences →
        </Link>
      </div>
    </div>
  );
}