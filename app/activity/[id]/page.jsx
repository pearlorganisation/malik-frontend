"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetActivityByIdQuery } from "@/features/activity/activityApi.js";
import { useCreateBookingMutation } from "@/features/booking/bookApi.js"; // Imported new mutation
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Clock,
  Users,
  Calendar,
  Check,
  ChevronRight,
  Home,
  Star,
  ShieldCheck,
  AlertCircle,
  Info,
  Car,
  Camera,
  Map as MapIcon,
  ChevronDown,
  Loader2, // Added Loader icon
} from "lucide-react";
import ActivityReviews from "@/components/Review/ActivityReviews";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter(); // For navigation after booking
  const id = params?.id;

  // Existing Query
  const {
    data: activity,
    isLoading,
    isError,
  } = useGetActivityByIdQuery(id, {
    skip: !id,
  });

  // New Mutation
  const [createBooking, { isLoading: isBooking, error: bookingError }] =
    useCreateBookingMutation();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isVariantExpanded, setIsVariantExpanded] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("itinerary");
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (!activity?.variants?.length) return;
    const variant = activity.variants[selectedVariantIndex];
    const initialQty = {};
    variant.pricing.forEach((p) => {
      if (p.type === "per_person") {
        initialQty[p._id] = p.label.toLowerCase().includes("adult") ? 1 : 0;
      }
    });
    setQuantities(initialQty);
    setSelectedTimeSlot(activity.timeSlots?.[0]?.startTime || "");
  }, [selectedVariantIndex, activity]);

  if (isLoading)
    return (
      <LoadingSpinner size={80} color="border-blue-600" className="py-40" />
    );
  if (isError || !activity)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Activity not found
      </div>
    );

  const selectedVariant = activity.variants[selectedVariantIndex];
  const images = activity.images || [];
  const video = activity.video?.url || null;

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const handleVariantClick = (index) => {
    if (selectedVariantIndex === index) {
      setIsVariantExpanded(!isVariantExpanded);
    } else {
      setSelectedVariantIndex(index);
      setIsVariantExpanded(true);
    }
  };

  const totalPersons = selectedVariant.pricing
    .filter((p) => p.type === "per_person")
    .reduce((sum, p) => sum + (quantities[p._id] || 0), 0);

  // Added selectedDate to validation check
  const canBook = totalPersons > 0 && selectedTimeSlot && selectedDate;

  // --- Booking Handler ---
  const handleBookNow = async () => {
    if (!canBook) return;

    try {
      // 1. Format participants based on schema
      const formattedParticipants = selectedVariant.pricing
        .filter((p) => p.type === "per_person" && (quantities[p._id] || 0) > 0)
        .map((p) => ({
          label: p.label,
          quantity: quantities[p._id],
          price: p.price,
        }));

      // 2. Construct Payload
      const bookingPayload = {
        activityId: activity._id, // Ensure we use the actual ID from data
        variantName: selectedVariant.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        participants: formattedParticipants,
        addons: [], // Add add-on logic here if you have add-on UI
      };

      // 3. Call API
      const result = await createBooking(bookingPayload).unwrap();

      // 4. Handle Success (Redirect to payment/checkout page)
      if (result.success) {
        console.log("Booking Successful:", result);
        window.location.href = result.checkoutUrl; // Redirect to Stripe Checkout
        // Assuming you have a checkout page that takes the booking ID or Client Secret
        // You might want to pass the clientSecret via query param or state management
        // router.push(`/checkout?bookingId=${result.bookingId}&clientSecret=${result.clientSecret}`);
      }
    } catch (err) {
      console.error("Booking Failed:", err);
      // Ideally show a toast notification here
      alert(err?.data?.message || "Something went wrong while booking.");
    }
  };

  // --- Helper Components ---

  const SectionTitle = ({ children, icon: Icon }) => (
    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-3">
      {Icon && (
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
      )}
      {children}
    </h2>
  );

  const InfoCard = ({ icon: Icon, title, value }) => (
    <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 border border-indigo-50 shrink-0">
        <Icon size={18} className="md:w-5 md:h-5" />
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-sm md:text-base font-semibold text-slate-800 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );

  // Calculate Total (moved to variable for re-use)
  const totalAmount = selectedVariant.pricing.reduce(
    (acc, p) => acc + p.price * (quantities[p._id] || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* --- Breadcrumb --- */}
      {/* <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center text-xs md:text-sm text-slate-500 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Home className="w-3.5 h-3.5 hover:text-indigo-600 cursor-pointer transition-colors" />
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">
            UAE
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">
            Dubai
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-medium text-indigo-600 truncate">
            {activity.title}
          </span>
        </div>
      </div> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8 md:space-y-10">
        {/* --- Header Section --- */}
        <div className="space-y-3 py-4 md:space-y-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {activity.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1">
              <Star size={10} className="fill-current" /> Bestseller
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-slate-900">{activity.rating}</span>
              <span className="text-slate-400">({activity.reviewCount})</span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <ShieldCheck size={14} /> Free cancellation
            </span>
          </div>
        </div>

        {/* --- Media Gallery (Layout: Left Big, Middle Vertical, Right Split) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 h-[350px] md:h-[500px]">
          {/* 1. Left: Main Image (50% Width) */}
          <div className="md:col-span-2 md:row-span-2 relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
            <img
              src={images[0]?.url}
              alt={images[0]?.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* 2. Middle: Vertical Image (25% Width) */}
          <div className="hidden md:block md:col-span-1 md:row-span-2 relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
            <img
              src={images[1]?.url}
              alt={images[1]?.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* 3. Right: Split Column (25% Width) */}
          <div className="hidden md:grid md:col-span-1 md:row-span-2 grid-rows-2 gap-3 md:gap-4 h-full">
            {/* Top Right: Video */}
            <div className="relative h-full rounded-2xl overflow-hidden bg-black group cursor-pointer shadow-sm">
              {video ? (
                <>
                  <video
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                    autoPlay
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                </>
              ) : (
                <img
                  src={images[2]?.url}
                  alt="Activity"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Bottom Right: More Photos */}
            <div className="relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img
                src={images[3]?.url || images[2]?.url}
                alt="More"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2 text-slate-900">
                  <Camera size={16} /> + More
                </button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* --- LEFT COLUMN UI --- */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              <InfoCard
                icon={Clock}
                title="Duration"
                value={`${activity.duration?.hours} Hours`}
              />
              <InfoCard
                icon={Users}
                title="Guide"
                value={activity.languages?.join(", ")}
              />
              {activity.pickup?.included && (
                <InfoCard icon={Car} title="Pickup" value="Included" />
              )}
            </div>

            {/* Description */}
            <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">
                Experience Overview
              </h3>
              <p className="leading-relaxed">{activity.fullDescription}</p>
            </div>

            {/* Highlights Grid */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <SectionTitle icon={Star}>Highlights</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                {(activity.highlights || []).map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 min-w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check
                        size={12}
                        className="text-emerald-600 stroke-[3]"
                      />
                    </div>
                    <span className="text-slate-700 font-medium text-sm md:text-base">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PACKAGE SELECTION (Refined Accordion) */}
            <div id="packages">
              <SectionTitle icon={Check}>Choose Your Package</SectionTitle>
              <div className="space-y-4">
                {activity.variants.map((v, i) => {
                  const isSelected = i === selectedVariantIndex;
                  const isExpanded = isSelected && isVariantExpanded;

                  return (
                    <div
                      key={v._id}
                      onClick={() => handleVariantClick(i)}
                      className={`relative group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? "border-indigo-600 bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-600"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      {/* Accordion Header */}
                      <div className="p-5 flex items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Radio Circle */}
                          <div
                            className={`mt-1 md:mt-0 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-slate-300 bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-sm" />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3
                                className={`font-bold text-lg leading-tight ${
                                  isSelected
                                    ? "text-indigo-900"
                                    : "text-slate-900"
                                }`}
                              >
                                {v.name}
                              </h3>
                              {v.discount?.percentage && (
                                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Save {v.discount.percentage}%
                                </span>
                              )}
                            </div>

                            {/* Show condensed info if collapsed */}
                            <div
                              className={`transition-all duration-300 overflow-hidden ${
                                isExpanded
                                  ? "max-h-0 opacity-0"
                                  : "max-h-20 opacity-100 mt-1"
                              }`}
                            >
                              <p className="text-sm text-slate-500 line-clamp-1">
                                {v.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 min-w-[80px]">
                          {!isExpanded && (
                            <span className="font-bold text-slate-900">
                              {Math.min(...v.pricing.map((p) => p.price))} AED
                            </span>
                          )}
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-180 text-indigo-600" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Accordion Body */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-6 pt-0 border-t border-slate-100 mx-5 mt-2">
                            <p className="text-slate-600 text-sm leading-relaxed my-4">
                              {v.description}
                            </p>

                            {/* Pricing Breakdown */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Select Travellers
                              </h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {v.pricing.map((p) => (
                                  <div
                                    key={p._id}
                                    className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
                                  >
                                    <span className="text-sm font-medium text-slate-700">
                                      {p.label}
                                    </span>
                                    <span className="font-bold text-indigo-600">
                                      {p.price}{" "}
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        AED
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Features */}
                            {v.includes && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {v.includes.map((inc, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100"
                                  >
                                    <Check size={12} /> {inc}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TABED CONTENT */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("itinerary")}
                  className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "itinerary"
                      ? "border-indigo-600 text-indigo-700 bg-indigo-50/30"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab("policies")}
                  className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === "policies"
                      ? "border-indigo-600 text-indigo-700 bg-indigo-50/30"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Important Info
                </button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "itinerary" && (
                  <div className="relative space-y-0 ml-2">
                    <div className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-slate-200" />
                    {activity.itinerary?.map((stop) => (
                      <div
                        key={stop._id}
                        className="relative pl-9 md:pl-10 pb-10 last:pb-0 group"
                      >
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 z-10 group-hover:scale-125 transition-transform shadow-sm" />
                        <h4 className="text-base md:text-lg font-bold text-slate-900 mb-1">
                          {stop.title}
                        </h4>
                        {stop.location && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                            <MapIcon size={12} /> {stop.location}
                          </div>
                        )}
                        <ul className="space-y-2">
                          {stop.activities?.map((act, k) => (
                            <li
                              key={k}
                              className="text-slate-600 text-sm flex items-start gap-2.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "policies" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                          <Check className="text-emerald-500" size={18} />{" "}
                          What's Included
                        </h4>
                        <ul className="space-y-3">
                          {(activity.includes || [])
                            .concat(selectedVariant.includes || [])
                            .map((inc, i) => (
                              <li
                                key={i}
                                className="text-sm text-slate-600 pl-3 border-l-2 border-emerald-200"
                              >
                                {inc}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                          <AlertCircle className="text-rose-500" size={18} />{" "}
                          What's Excluded
                        </h4>
                        <ul className="space-y-3">
                          {(activity.excludes || []).map((exc, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-500 pl-3 border-l-2 border-rose-200"
                            >
                              {exc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                        <Info className="text-indigo-500" size={18} /> Know
                        Before You Go
                      </h4>
                      <div className="grid gap-3">
                        {activity.importantInfo?.map((info, i) => (
                          <div
                            key={i}
                            className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
                          >
                            <span className="font-bold text-indigo-500">•</span>{" "}
                            {info}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN UI (Sticky Booking Widget) --- */}
          <div className="lg:col-span-1 relative z-20 h-fit">
            <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl shadow-xl shadow-slate-200/40 sticky top-24 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Booking
                </p>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  Your Selection
                </h3>
              </div>

              {/* Selected Package Summary */}
              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] md:text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                    SELECTED PACKAGE
                  </span>
                  {selectedVariant.discount?.percentage && (
                    <span className="text-[10px] md:text-xs font-bold text-rose-600">
                      -{selectedVariant.discount.percentage}% OFF
                    </span>
                  )}
                </div>
                <p className="font-bold text-indigo-900 leading-snug text-sm md:text-base">
                  {selectedVariant.name}
                </p>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2 block">
                    Date
                  </label>

                  <div className="relative w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
                    {/* Date Text */}
                    <span
                      className={`font-medium flex items-center gap-2 text-sm ${
                        selectedDate ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "Select Date"}
                    </span>

                    {/* Calendar Icon */}
                    <button
                      type="button"
                      onClick={() => dateInputRef.current?.showPicker()}
                      className="p-1 rounded-md hover:bg-slate-100 transition"
                    >
                      <Calendar
                        size={16}
                        className="text-slate-400 hover:text-indigo-500"
                      />
                    </button>

                    {/* HIDDEN DATE INPUT (NO UI CHANGE) */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="absolute opacity-0 pointer-events-none"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-2 block">
                    Start Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activity.timeSlots?.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedTimeSlot(slot.startTime)}
                        className={`py-2 px-2 rounded-xl text-xs md:text-sm font-semibold transition-all border ${
                          selectedTimeSlot === slot.startTime
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guests/Quantity */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase block">
                  Guests
                </label>
                {selectedVariant.pricing
                  .filter((p) => p.type === "per_person")
                  .map((p) => (
                    <div
                      key={p._id}
                      className="flex justify-between items-center py-1"
                    >
                      <div>
                        <span className="block text-sm font-semibold text-slate-700">
                          {p.label}
                        </span>
                        <span className="text-[10px] md:text-xs text-slate-400 font-medium">
                          {p.price} AED
                        </span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => updateQuantity(p._id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-md transition disabled:opacity-30"
                          disabled={!quantities[p._id]}
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-bold text-slate-900">
                          {quantities[p._id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(p._id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-md transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Footer / Total */}
              <div className="pt-6 border-t border-dashed border-slate-200 mt-2">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">
                      Total Pay
                    </span>
                    <p className="text-[10px] text-green-600 font-medium mt-0.5">
                      No hidden fees
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      {totalAmount}
                    </span>
                    <span className="text-xs md:text-sm text-slate-500 font-bold ml-1">
                      AED
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBookNow}
                    className={`w-full py-3.5 md:py-4 rounded-xl font-bold text-white  transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base ${
                      canBook && !isBooking
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-slate-300 cursor-not-allowed shadow-none"
                    }`}
                    disabled={!canBook || isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        {canBook ? "Proceed to Checkout" : "Select Options"}{" "}
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                  <button className="w-full py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs md:text-sm">
                    Book via WhatsApp
                  </button>

                  {/* Basic Error Message Display */}
                  {bookingError && (
                    <div className="text-center p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                      {/* @ts-ignore */}
                      {bookingError?.data?.message ||
                        "Booking failed. Please try again."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ActivityReviews activityId={activity._id} />
    </div>
  );
}
