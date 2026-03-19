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
  Mountain,
  Bike,
  TreePine,
  Zap,
  Heart,
  DollarSign,
  Building2,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useGetPopularActivitiesQuery } from "@/features/activity/activityApi";

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

  const { data: actRes } = useGetPopularActivitiesQuery({ limit: 6 });
  const activities = actRes?.activities || [];

  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(query)
  );

  const filteredLocations = locations.filter((l) =>
    l.name?.toLowerCase().includes(query)
  );

  const filteredActivities = activities.filter((a) =>
    a.title?.toLowerCase().includes(query)
  );

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
      <div className="p-7 max-h-[78vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-8">

          {/* ================= CATEGORIES ================= */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Grid2x2 className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                All Collections
              </h3>
            </div>

            <div className="space-y-0.5">
              {filteredCategories.map((cat) => {
                const { Icon, bg, color } = getCategoryConfig(cat.name);

                return (
                  <Link
                    key={cat._id}
                    href={`/activity?category=${cat._id}`}
                    scroll={true}
                    onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= LOCATIONS ================= */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                Key Locations
              </h3>
            </div>

            <div className="space-y-0.5">
              {filteredLocations.map((loc) => (
                <Link
                  key={loc._id}
                  href={`/activity?location=${loc._id}`}
                  scroll={true}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 shrink-0 transition-colors" />
                  <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">
                    {loc.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* EXPERIENCE STYLES */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                  Experience Styles
                </h3>
              </div>

              <div className="space-y-0.5">
                {experienceStyles.map(({ label, Icon, color }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= TOURS ================= */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                Top Selling Tours
              </h3>
            </div>

            <div className="space-y-1.5">
              {filteredActivities.map((act) => (
                <Link
                  key={act._id}
                  href={`/activity/${act._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  {/* IMAGE */}
                  <div className="w-[70px] h-[56px] rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={act.images?.[0]?.url || "/placeholder.jpg"}
                      alt={act.title}
                      width={70}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    {/* Category tag + rating */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {act.category && (
                        <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                          {typeof act.category === "object"
                            ? act.category?.name
                            : act.category}
                        </span>
                      )}
                      {act.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-semibold text-slate-600">
                            {act.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-[12.5px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-slate-900">
                      {act.title}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-orange-400" />
                        <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide">
                          {act.location || "Dubai"}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 font-medium uppercase">
                          Starting at
                        </div>
                        <div className="text-[14px] font-bold text-slate-900">
                          ${act.price || 45}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 text-slate-300 group-hover:text-slate-500 transition-colors">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="flex items-center justify-between px-7 py-3.5 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">⚡</span>
          <span className="text-[10.5px] font-semibold text-slate-400 tracking-wide uppercase">
            Real-Time Availability
          </span>
        </div>
        <Link
          href="/activity"
          onClick={onClose}
          className="text-[10.5px] font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase"
        >
          Explore All Experiences →
        </Link>
      </div>
    </div>
  );
}