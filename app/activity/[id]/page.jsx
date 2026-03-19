"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetActivityByIdQuery } from "@/features/activity/activityApi.js";
import { useCreateBookingMutation } from "@/features/booking/bookApi.js";
import ReviewModal from "@/components/Review/ReviewModal";
// import { useState } from "react";
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
  Loader2,
  X,
  Zap,
  Award,
  Globe,
  Ticket,
  Crown,
  Anchor,
  Truck,
  CheckCircle2,
  MapPin,
  Clock3,
  ThumbsUp,
  MessageSquare,
  HelpCircle,
  Train,
  Wifi,
  Navigation,
} from "lucide-react";
import ActivityReviews from "@/components/Review/ActivityReviews";

// ─── Static ticket tiers ──────────────────────────────────────────────────────
const TICKET_TIERS = [
  {
    key: "standard",
    label: "Standard Entry",
    sub: "OFFICIAL QR TICKET",
    icon: Ticket,
  },
  {
    key: "vip",
    label: "VIP Fast Track",
    sub: "SKIP-THE-LINE ACCESS",
    icon: Crown,
  },
];

// ─── Page tabs ────────────────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────
export default function ActivityDetailPage() {
  const fallbackHighlights = [
    "Experience breathtaking 360-degree views of Dubai",
    "Ride the world's fastest multimedia elevators",
    "Explore levels 124 and 125 at your leisure",
    "Access to high-powered telescopes for closer views",
    "Private SUV Transfer (1 x 6-Seater Vehicle) included",
  ];

  const fallbackIncludes = [
    "Instant E-Ticket Delivery",
    "Access to Level 124 & 125",
    "Use of High-Powered Telescopes",
    "Free WiFi at the Attraction",
    "1 x Private SUV Transfer",
  ];

  const fallbackExcludes = [
    "Fast Track / Priority Lane",
    "Level 148 Access",
    "Hotel Pickup",
  ];
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  // ── Data fetching (UNCHANGED) ─────────────────────────────────────────────
  const { data, isLoading, isError } = useGetActivityByIdQuery(id, {
    skip: !id,
  });
  const activity = data?.data;
  console.log("activity detail:", activity);
  const PAGE_TABS = useMemo(() => {
  if (!activity) return [];

  const tabs = [];

  if (activity.Experience) {
    tabs.push({ key: "experience", label: "EXPERIENCE" });
  }

  if (activity.Itinerary?.length) {
    tabs.push({ key: "itinerary", label: "ITINERARY" });
  }

  if (activity.InfoAndLogistics) {
    tabs.push({ key: "logistics", label: "INFO & LOGISTICS" });
  }

  if (activity.BBQ_BUFFET) {
    tabs.push({ key: "bbq_buffet", label: "BBQ BUFFET" });
  }

  if (activity.PrivateSUV?.available) {
    tabs.push({ key: "private_suv", label: "PRIVATE SUV" });
  }

  tabs.push({ key: "reviews", label: "REVIEWS" });

  return tabs;
}, [activity]);

  const [createBooking, { isLoading: isBooking, error: bookingError }] =
    useCreateBookingMutation();

  // ── Business logic state (UNCHANGED) ─────────────────────────────────────
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isVariantExpanded, setIsVariantExpanded] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("experience");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  // ── UI-only state ─────────────────────────────────────────────────────────
  const [transferType, setTransferType] = useState("self");
  const [selectedTier, setSelectedTier] = useState("standard");
  const isVIP = selectedTier === "vip";
  // ── Refs ──────────────────────────────────────────────────────────────────
  const dateInputRef = useRef(null);
  const contentRef = useRef(null); // ref for the left column content area

  // ── Derived (UNCHANGED) ───────────────────────────────────────────────────
  const selectedVariant = activity?.variants?.[selectedVariantIndex] || {
    pricing: [],
  };

  const totalAmount = useMemo(() => {
    return (selectedVariant?.pricing || []).reduce(
      (acc, p) => acc + p.price * (quantities[p._id] || 0),
      0,
    );
  }, [selectedVariant, quantities]);

  useEffect(() => {
    if (!activity?.variants?.length) return;
    const variant = activity.variants[selectedVariantIndex];
    const initialQty = {};
    variant.pricing.forEach((p) => {
      initialQty[p._id] = 1;
    });
    setQuantities(initialQty);
    setSelectedTimeSlot(activity.timeSlots?.[0]?.startTime || "");
  }, [selectedVariantIndex, activity]);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (isLoading)
    return (
      <LoadingSpinner size={80} color="border-blue-600" className="py-40" />
    );
  if (isError || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Activity not found
      </div>
    );
  }

  const images =
    activity?.Images?.map((img) => ({ url: img.url || img.secure_url })) || [];
  // const video = activity.video?.url || null;
  const video = activity?.Video?.secure_url || null;

  // ── Event handlers (UNCHANGED) ────────────────────────────────────────────
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

  const totalPersons = (selectedVariant?.pricing || [])
    .filter((p) => p.type === "per_person")
    .reduce((sum, p) => sum + (quantities[p._id] || 0), 0);

  const canBook = totalPersons > 0 && selectedTimeSlot && selectedDate;

  const handleBookNow = async () => {
    if (!canBook) return;
    try {
      const formattedParticipants = selectedVariant.pricing
        .filter((p) => (quantities[p._id] || 0) > 0)
        .map((p) => ({
          label: p.label,
          quantity: quantities[p._id],
          price: p.price,
        }));

      const bookingPayload = {
        activityId: activity._id,
        variantName: selectedVariant.name,
        date: new Date(selectedDate).toISOString(),
        timeSlot: selectedTimeSlot,
        participants: formattedParticipants,
        addons: [],
      };

      const result = await createBooking(bookingPayload).unwrap();
      if (result.success) {
        console.log("Booking Successful:", result);
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      console.error("Booking Failed:", err);
      alert(err?.data?.message || "Something went wrong while booking.");
    }
  };

  // ── Tab click: switch tab AND scroll left content into view ───────────────
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    // Scroll the left content area to top smoothly
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  // ── Derived display values ────────────────────────────────────────────────
  const isSUV = transferType === "suv";
  const minPrice = selectedVariant?.pricing?.length
    ? Math.min(...(selectedVariant?.pricing || []).map((p) => p.price))
    : 0;
  const suvAddonPrice =
    activity?.variants?.find((v) => v.name?.toLowerCase().includes("suv"))
      ?.pricing?.[0]?.price || 400;
  const displayPrice = isSUV
    ? totalAmount + suvAddonPrice
    : totalAmount || minPrice;

  // Content that changes based on SUV tab
  const suvHighlights = [
    ...(activity.highlights || []).slice(0, 4),
    "Private SUV Transfer (1 × 6-Seater Vehicle) included",
  ];
  // const activeHighlights = isSUV ? suvHighlights : (activity.highlights || []);
  const activeHighlights = isSUV
    ? activity.highlights?.length
      ? suvHighlights
      : fallbackHighlights
    : activity.highlights?.length
      ? activity.highlights
      : fallbackHighlights;

  // const baseIncludes = (activity.includes || []).concat(selectedVariant.includes || []);
  const baseIncludes = (
    activity.includes?.length ? activity.includes : fallbackIncludes
  ).concat(selectedVariant.includes || []);

  const suvIncludes = [...baseIncludes, "1x Private SUV Transfer"];
  const displayIncludes = isSUV ? suvIncludes : baseIncludes;

  // Static itinerary items (use activity data if available, else show structured fallback)
  const itineraryItems = activity.itinerary?.length
    ? activity.itinerary.map((stop, i) => ({
        _id: stop._id || i,
        timeLabel:
          stop.timeLabel ||
          (i === 0 ? "SLOT ARRIVAL" : `MINUTE ${i * 15}-${(i + 1) * 15}`),
        title: stop.title,
        description: stop.description || stop.activities?.join(". ") || "",
        image: stop.image || null,
      }))
    : [
        {
          _id: 1,
          timeLabel: "SLOT ARRIVAL",
          title: "Dubai Mall Entry",
          description:
            "Head to the Lower Ground floor of Dubai Mall. Look for the 'At the Top' signage near the food court.",
          image: null,
        },
        {
          _id: 2,
          timeLabel: "MINUTE 0-15",
          title: "Security & Multimedia",
          description:
            "Pass through security and enjoy a multimedia presentation of Dubai's history and the building's construction.",
          image: null,
        },
        {
          _id: 3,
          timeLabel: "MINUTE 15-60",
          title: "Observation Deck",
          description:
            "Ride the world's fastest elevator to Level 124. Spend time on the outdoor terrace and Level 125.",
          image: images?.[1]?.url || null,
        },
      ];

  // Static FAQ items (use activity data if available)
  const faqItems = activity.faqs?.length
    ? activity.faqs
    : [
        {
          _id: 1,
          question: "Is the ticket price per person?",
          answer:
            "Yes, the ticket price listed is per person for entry to the observation decks.",
        },
        {
          _id: 2,
          question: "Can I cancel or reschedule?",
          answer:
            "Rescheduling is free up to 24 hours before your slot. Cancellations are subject to terms.",
        },
        {
          _id: 3,
          question: "What is the best time to visit?",
          answer:
            "Sunset slots (4:00 PM - 6:00 PM) are the most popular for breathtaking golden hour views.",
        },
      ];

  // ─────────────────────────────────────────────────────────────────────────
  // testing
  const rating = activity?.rating ?? 4.8;
  const reviewCount = activity?.reviewCount ?? 120;
  console.log("first",activity)
  const title = activity?.name || "Burj Khalifa: At The Top (124 & 125)";

  const fallbackInclude = [
  "Instant E-Ticket Delivery",
  "Access to Level 124 & 125",
  "Use of High-Powered Telescopes",
  "Free WiFi at the Attraction",
];

const fallbackExclude = [
  "Fast Track / Priority Lane",
  "Level 148 Access",
  "Hotel Pickup",
];
const includeList =
  activity?.packages?.[0]?.whatInclude?.length > 0
    ? activity.packages[0].whatInclude
    : fallbackInclude;

const excludeList =
  activity?.packages?.[0]?.whatExclude?.length > 0
    ? activity.packages[0].whatExclude
    : fallbackExclude;
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 p-4">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="bg-gray-60/10 border-b border-t border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 py-2.5 flex items-center text-xs text-gray-500 gap-1.5 overflow-x-auto whitespace-nowrap">
          <Home className="w-2.5 h-2.5 text-gray-400 shrink-0" />
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="hover:text-blue-600 cursor-pointer text-sm transition-colors">
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
          <span className="text-black font-bold text-[13px] tracking-widest truncate">
            {activity.name}
          </span>
        </div>
      </div>

      <main className="w-full mx-auto px-4 sm:px-6 py-2  md:py-4">
        {/* ── Title + Rating ────────────────────────────────────────────────── */}
        <div className="mb-5">
          {/* TITLE TOP */}
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black leading-tight mb-2">
            {title}
          </h1>

          {/* RATING + REVIEWS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm font-bold text-gray-800">{rating}</span>

            {/* <span className="text-[11px] text-gray-400">
              ({reviewCount} reviews)
            </span> */}

            <span className="px-4 py-0.5 bg-blue-50 text-blue-900 text-[13px] font-semibold rounded-b border border-blue-100 flex items-center gap-1">
              <ShieldCheck size={11}  /> Official Ticket
            </span>
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-10">
          {/* ════ LEFT COLUMN ══════════════════════════════════════════════ */}
          {/* <div className="min-w-0"> */}
          <div className="min-w-0">
            {/* ── Image Gallery ──────────────────────────────────────────── */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-60 sm:h-90 md:h-110 rounded-2xl overflow-hidden">
              {/* Hero */}
              <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer">
                <img
                  src={images?.[0]?.url || "/placeholder.jpg"}
                  alt="Main"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Tiles 2–4 */}
              {/* {[1, 2, 3].map((idx) => (
                <div key={idx} className="relative group overflow-hidden cursor-pointer">
                  <img
                    src={images?.[idx]?.url || images?.[0]?.url || "/placeholder.jpg"}
                    alt={`Gallery ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))} */}
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden cursor-pointer"
                >
                  {idx === 2 && video ? (
                    <video
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      autoPlay
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={
                        images?.[idx]?.url ||
                        images?.[0]?.url ||
                        "/placeholder.jpg"
                      }
                      alt={`Gallery ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              ))}
              {/* Tile 5 – video or image */}
              <div className="relative group overflow-hidden cursor-pointer">
                <img
                  src={
                    images?.[4]?.url || images?.[0]?.url || "/placeholder.jpg"
                  }
                  alt="Gallery 5"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {images?.length > 5 && (
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-2">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                      <Camera size={11} /> +{images.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Page Tabs (scroll-spy anchor) ───────────────────────────── */}
            <div
              ref={contentRef}
              className="border-b border-gray-200 overflow-x-auto mt-8 scroll-mt-20"
            >
              <div className="flex whitespace-nowrap">
                {PAGE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`px-5 py-4 text-xs font-bold tracking-widest uppercase transition-colors border-b-2 ${
                      activeTab === tab.key
                        ? isVIP
                          ? "border-red-600 text-red-600"
                          : "border-blue-700 text-blue-700"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                TAB CONTENT
            ══════════════════════════════════════════════════════════════ */}
            <div className="py-7">
{/* 
              {activeTab === "experience" && (
                <div className="space-y-8">
               <div
                    className={`border-l-4 pl-4 py-0.5 ${
                      isVIP ? "border-red-600" : "border-blue-700"
                    }`}
                  >
                    <p className="text-base font-bold text-gray-900 leading-snug">
                      {activity.shortDescription ||
                        "Instant access to Dubai's most iconic landmarks."}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Official QR tickets delivered straight to your smartphone.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-yellow-400 text-sm">✦</span>{" "}
                      Highlights
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
                      {activeHighlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[11px] text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-[7px] shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>

                 <div
                    className={`rounded-2xl border overflow-hidden ${
                      isVIP
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                      <div className="p-6">
                        <h4
                          className={`font-black mb-4 text-[8px] uppercase tracking-widest ${isVIP ? "text-red-600" : "text-blue-700"}`}
                        >
                          What's Included
                        </h4>
                        <ul className="space-y-2.5">
                          {displayIncludes.map((inc, i) => (
                            <li
                              key={i}
                              className={`text-[11px] flex items-center gap-2 ${
                                isSUV && i === displayIncludes.length - 1
                                  ? "font-bold text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              <Check
                                size={14}
                                className="text-green-500 shrink-0"
                              />
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6">
                    <h4
                          className={`font-black mb-4 text-[8px] uppercase tracking-widest ${
                            isVIP ? "text-red-600" : "text-blue-700"
                          }`}
                        >
                          What's Excluded
                        </h4>
                        <ul className="space-y-2.5">
                          {(activity.excludes?.length
                            ? activity.excludes
                            : fallbackExcludes
                          ).map((exc, i) => (
                            <li
                              key={i}
                              className="text-[11px] text-gray-600 flex items-center gap-2"
                            >
                              <X size={14} className="text-red-400 shrink-0" />
                              {exc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                <div>
                    <h2 className="text-sm font-bold text-black mb-2">
                      About this Entry
                    </h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {activity.fullDescription ||
                        "Visit the world's tallest building and enjoy panoramic views of Dubai."}
                    </p>
                  </div>

                  <PackagesSection
                    activity={activity}
                    selectedVariantIndex={selectedVariantIndex}
                    isVariantExpanded={isVariantExpanded}
                    handleVariantClick={handleVariantClick}
                  />
                </div>
              )} */}

       {activeTab === "experience" && (
  <div className="space-y-8">

    {/* Short Description */}
    <div
      className={`border-l-4 pl-4 py-0.5 ${
        isVIP ? "border-red-600" : "border-blue-700"
      }`}
    >
      <p className="text-[22px] font-bold text-gray-900 leading-snug">
        {activity.Experience?.title ||
          "Instant access to Dubai's most iconic landmarks."}
      </p>

      <p className="text-md text-gray-500 mt-1">
        {activity.Experience?.note ||
          "Official QR tickets delivered straight to your smartphone."}
      </p>
    </div>

    {/* Highlights */}
    <div>
      <h2 className="text-[18px] font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-yellow-400 text-sm">✦</span> Highlights
      </h2>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
        {activity.Experience?.highlights?.map((h, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-[17px] text-gray-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1.75 shrink-0" />
            {h}
          </div>
        ))}
      </div>
    </div>

    {/* Include / Exclude (Packages data se) */}
<div
  className={`rounded-[20px] border overflow-hidden ${
    isVIP
      ? "border-red-200 bg-red-50"
      : "border-blue-200 bg-blue-50"
  }`}
>
  <div className="grid md:grid-cols-2 ">
    
    {/* Included */}
    <div className="p-8">
      <h4
        className={`font-bold mb-5 text-[12px] uppercase tracking-wider ${
          isVIP ? "text-red-600" : "text-blue-900"
        }`}
      >
        WHAT'S INCLUDED
      </h4>

      <ul className="space-y-4">
        {includeList.map((inc, i) => (
          <li
            key={i}
            className="text-[16px] flex items-center gap-3 text-gray-700"
          >
            <Check size={16} className="text-green-500 shrink-0" />
            {inc}
          </li>
        ))}
      </ul>
    </div>

    {/* Excluded */}
    <div className="p-8">
      <h4
        className={`font-bold mb-5 text-[12px] uppercase tracking-wider ${
          isVIP ? "text-red-600" : "text-blue-900"
        }`}
      >
        WHAT'S EXCLUDED
      </h4>

      <ul className="space-y-4">
        {excludeList.map((exc, i) => (
          <li
            key={i}
            className="text-[16px] text-gray-600 flex items-center gap-3"
          >
            <X size={16} className="text-red-400 shrink-0" />
            {exc}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

    {/* Description */}
    <div>
      <h2 className="text-[22px] font-bold text-black mb-2">
        About this Entry
      </h2>

      <p className="text-[15px] text-gray-600 leading-relaxed">
        {activity.Experience?.description ||
          "Visit the world's tallest building and enjoy panoramic views of Dubai."}
      </p>
    </div>

    {/* Packages */}
    <PackagesSection
      activity={activity}
      selectedVariantIndex={selectedVariantIndex}
      isVariantExpanded={isVariantExpanded}
      handleVariantClick={handleVariantClick}
    />
  </div>
)}

            {/* {activeTab === "itinerary" && (
                <div>
                  <h2 className="text-md font-bold text-gray-900 mb-6">
                    Visit Timeline
                  </h2>
                  <div className="space-y-6">
                    {itineraryItems.map((stop, idx) => (
                      <div key={stop._id} className="flex gap-4">
                        
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          {idx < itineraryItems.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                          )}
                        </div>

                       <div className="flex-1 pb-6 last:pb-0 flex gap-4">
                          <div className="flex-1">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              {stop.timeLabel}
                            </span>
                            <h4 className="text-[14px] font-bold text-900 mt-0.5 mb-1">
                              {stop.title}
                            </h4>
                            <p className="text-[12px] text-gray-500 leading-relaxed">
                              {stop.description}
                            </p>
                          </div>
                        <div className="w-18 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            {stop.image ? (
                              <img
                                src={stop.image}
                                alt={stop.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

{activeTab === "itinerary" && (
  <div>
    <h2 className="text-xl font-bold text-gray-900 my-6">
      Visit Timeline
    </h2>

    <div className="space-y-12">
      {activity?.Itinerary?.map((stop, idx) => (
        <div key={stop._id || idx} className="flex gap-6">

          {/* timeline dot */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {idx < activity.Itinerary.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 mt-1" />
            )}
          </div>

          {/* content */}
          <div className="flex-1 pb-20 last:pb-0 flex gap-4">

            <div className="flex-1">
              <span className="text-[9px] bg-gray-200 p-[1px] font-black text-gray-400 uppercase tracking-widest">
                {stop.time}
              </span>

              <h4 className="text-[18px] font-extrabold text-900 mt-0.5 mb-0.5">
                {stop.title}
              </h4>

              <p className="text-[13px] text-gray-500 font-bold">
                {stop.description}
              </p>
            </div>

            {/* image placeholder */}
            {/* <div className="w-18 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {stop.image ? (
                <img
                  src={stop?.image || "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=200"}
                  alt={stop.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div> */}
<div className="w-18 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
  <img
    src={
      stop?.image ||
      "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=200"
    }
    alt={stop?.title || "image"}
    className="w-full h-full object-cover"
  />
</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


              {/* {activeTab === "logistics" && (
                <div className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={15} className="text-blue-600" />
                        <h3 className="font-bold text-gray-900 text-[13px]">
                          Entry Point
                        </h3>
                      </div>
                      <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
                        The main entrance is via{" "}
                        <strong className="text-gray-900">
                          Dubai Mall, Lower Ground floor
                        </strong>
                        . Follow the signage for 'At The Top'.
                      </p>
                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        <Train size={11} /> Metro Accessible
                      </div>
                    </div>
                   <div className="border border-gray-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock3 size={15} className="text-blue-600" />
                        <h3 className="font-bold text-gray-900 text-sm">
                          Key Info
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {[
                          "Arrive 15 mins before slot.",
                          "Entry is only for your slot.",
                          "E-Tickets sent via WhatsApp.",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-[10px] text-gray-600"
                          >
                            <CheckCircle2
                              size={13}
                              className="text-blue-400 shrink-0"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-4">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                      {faqItems.map((faq) => (
                        <FaqItem
                          key={faq._id}
                          question={faq.question}
                          answer={faq.answer}
                        />
                      ))}
                    </div>
                  </div>

                 {activity.importantInfo?.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-3">
                        Additional Info
                      </h3>
                      <div className="space-y-2">
                        {activity.importantInfo.map((info, i) => (
                          <div
                            key={i}
                            className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100"
                          >
                            <span className="text-blue-500 font-bold shrink-0">
                              •
                            </span>{" "}
                            {info}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}
   {activeTab === "logistics" && (
  <div className="space-y-8">
    
    <div className="grid sm:grid-cols-2 gap-4">

      {/* Entry Point */}
      <div className="border border-gray-200 rounded-2xl p-8 bg-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={15} className="text-blue-600" />
          <h3 className="font-bold text-gray-900 text-[16px]">
            Pickup Zone
          </h3>
        </div>

        <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
          {activity?.InfoAndLogistics?.pickupZone?.description}
        </p>

        {activity?.InfoAndLogistics?.pickupZone?.mapLink && (
          <a
            href={activity.InfoAndLogistics.pickupZone.mapLink}
            target="_blank"
            className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
          >
            <Train size={11} className="text-blue-600"/> View on Map
          </a>
        )}
      </div>

      {/* Key Info */}
      <div className="border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock3 size={15} className="text-blue-600 font-bold" />
          <h3 className="font-bold text-gray-900 text-md">
            Key Info
          </h3>
        </div>

        <ul className="space-y-2">
          {activity?.InfoAndLogistics?.keyInfo?.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-[11px] text-gray-600"
            >
              <CheckCircle2
                size={13}
                className="text-blue-600 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* Essential Guide */}
    {activity?.InfoAndLogistics?.essentialGuide?.length > 0 && (
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">
          Essential Guide
        </h3>

        <div className="space-y-2">
          {activity.InfoAndLogistics.essentialGuide.map((info, i) => (
            <div
              key={i}
              className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100"
            >
              <span className="text-blue-500 font-bold shrink-0">
                •
              </span>
              {info}
            </div>
          ))}
        </div>
      </div>
    )}

  </div>
)}

             {activeTab === "reviews" && (
                <ReviewsSection activity={activity} />
              )}
{activeTab === "bbq_buffet" && (
  <div className="space-y-8">

    <div
      className={`border-l-4 pl-4 py-0.5 ${
        isVIP ? "border-red-600" : "border-blue-700"
      }`}
    >
      <p className="text-md font-bold text-gray-900 leading-snug">
        {activity.BBQ_BUFFET?.title}
      </p>

      <p className="text-[15px] text-gray-500 mt-1">
        {activity.BBQ_BUFFET?.description}
      </p>
    </div>

    <div className="space-y-6">
      {activity.BBQ_BUFFET?.fields?.map((field, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h4
            className={`font-black mb-3 text-[12px] uppercase tracking-widest ${
              isVIP ? "text-red-600" : "text-blue-700"
            }`}
          >
            {field.category}
          </h4>

          <ul className="grid sm:grid-cols-2 gap-2">
            {field.items?.map((item, idx) => (
              <li
                key={idx}
                className="text-[14px] text-gray-700 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

  </div>
)}

{activeTab === "private_suv" && activity.PrivateSUV?.available && (
  <div className="space-y-8">

    <div
      className={`border-l-4 pl-4 py-0.5 ${
        isVIP ? "border-red-600" : "border-blue-700"
      }`}
    >
      <p className="text-base font-bold text-gray-900 leading-snug">
        Private SUV Transfer
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Travel in comfort with a private luxury SUV.
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-6">

      <div className="flex justify-between text-[15px] text-gray-700 mb-2">
        <span className="font-semibold">Model</span>
        <span>{activity.PrivateSUV?.model}</span>
      </div>

      <div className="flex justify-between text-[12px] text-gray-700">
        <span className="font-semibold">Transfer Fee</span>
        <span className="font-bold text-gray-900">
          ${activity.PrivateSUV?.fee}
        </span>
      </div>

    </div>

  </div>
)}
            </div>
          </div>

         <div className="hidden lg:block">
            <div className="sticky top-28 self-start">
              <BookingCard
                transferType={transferType}
                setTransferType={setTransferType}
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                displayPrice={displayPrice}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                dateInputRef={dateInputRef}
                activity={activity}
                selectedVariant={selectedVariant}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                quantities={quantities}
                updateQuantity={updateQuantity}
                canBook={canBook}
                isBooking={isBooking}
                bookingError={bookingError}
                handleBookNow={handleBookNow}
                isSUV={isSUV}
                suvAddonPrice={suvAddonPrice}
                minPrice={minPrice}
                // Tab click from form scrolls content
                onTabClick={handleTabClick}
                activeTab={activeTab}
                bookingStep={bookingStep}
                setBookingStep={setBookingStep}
              />
            </div>
          </div>
        </div>

        {activeTab !== "reviews" && (
          <div className="mt-10 pb-20 lg:pb-10">
            <ActivityReviews activityId={activity._id} />
          </div>
        )}
      </main>

  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="shrink-0">
          <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">
            From
          </div>
          <div className="text-xl font-black text-blue-700">
            ${isSUV ? minPrice + suvAddonPrice : minPrice || "45"}
            <span className="text-xs text-gray-400 font-normal ml-1">AED</span>
          </div>
        </div>
        <button
          onClick={handleBookNow}
          className={`flex-1 py-3.5 rounded-full font-black text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            canBook && !isBooking
              ? "bg-blue-700 hover:bg-blue-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canBook || isBooking}
        >
          {isBooking ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Processing...
            </>
          ) : (
            <>
              {canBook ? "Book Now" : "Select Options"}{" "}
              <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <HelpCircle size={14} className="text-blue-400 shrink-0" />
        <span className="flex-1 text-[12px] font-semibold text-gray-800">
          {question}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-3.5 pt-0 border-t border-gray-100">
          <p className="text-[9px] mt-2 text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Packages section ─────────────────────────────────────────────────────────
function PackagesSection({
  activity,
  selectedVariantIndex,
  isVariantExpanded,
  handleVariantClick,
}) {
  if (!activity?.variants?.length) return null;
  return (
    <div id="packages">
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Choose Your Package
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Select the experience that suits you best
      </p>
      <div className="space-y-3">
        {activity.variants.map((v, i) => {
          const isSelected = i === selectedVariantIndex;
          const isExpanded = isSelected && isVariantExpanded;
          return (
            <div
              key={v._id}
              onClick={() => handleVariantClick(i)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-blue-700 bg-blue-50/20 shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 bg-blue-700 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${isSelected ? "text-blue-900" : "text-gray-800"}`}
                      >
                        {v.name}
                      </span>
                      {v.discount?.percentage && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Save {v.discount.percentage}%
                        </span>
                      )}
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {v.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isExpanded && (
                    <span className="text-sm font-bold text-gray-800">
                      {v.pricing?.length
                        ? Math.min(...v.pricing.map((p) => p.price))
                        : 0}{" "}
                      AED
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-blue-700" : ""
                    }`}
                  />
                </div>
              </div>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-5 pt-0 border-t border-gray-100 mx-4 mt-1">
                    <p className="text-sm text-gray-500 my-3 leading-relaxed">
                      {v.description}
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Select Travellers
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {v.pricing.map((p) => (
                          <div
                            key={p._id}
                            className="flex justify-between items-center bg-white px-3 py-2.5 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <span className="text-sm text-gray-700">
                              {p.label}
                            </span>
                            <span className="font-bold text-blue-700 text-sm">
                              {p.price}{" "}
                              <span className="text-[10px] text-gray-400 font-normal">
                                AED
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {v.includes && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {v.includes.map((inc, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-green-100"
                          >
                            <Check size={11} /> {inc}
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
  );
}

// ─── Reviews section ──────────────────────────────────────────────────────────
function ReviewsSection({ activity }) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);

const openReviewModal = () => setIsReviewOpen(true);
const closeReviewModal = () => setIsReviewOpen(false);
  // Static sample reviews – real data comes from ActivityReviews component below
  const sampleReviews = [
    {
      id: 1,
      initial: "S",
      name: "Sarah K.",
      date: "Jan 12, 2025",
      rating: 5,
      text: '"The views are simply incredible. We went during sunset and it was worth every penny. The Fun Tours ticket was very easy to use at the gate."',
    },
    {
      id: 2,
      initial: "J",
      name: "James M.",
      date: "Dec 22, 2024",
      rating: 5,
      text: '"Smooth entry and very helpful staff. The multimedia presentation while waiting for the elevator was a nice touch."',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-4xl font-black text-gray-900">
            {activity.rating || "4.8"}
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <div className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mt-1">
            Based on {activity.reviewCount || "45000"} reviews
          </div>
        </div>
        {/* <button className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors">
          Write a Review
        </button> */}
        {/* <button
  onClick={openReviewModal}
  className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
>
  Write a Review
</button>
<ReviewModal
  isOpen={isReviewOpen}
  onClose={closeReviewModal}
  activityId={activity?._id}
/> */}

<>
  {/* <button onClick={openReviewModal}>Write a Review</button> */}
      <button
  onClick={openReviewModal}
  className="px-8 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
>
  Write a Review
</button>

  {isReviewOpen && (
    <ReviewModal
      isOpen={isReviewOpen}
      onClose={closeReviewModal}
      activityId={activity?._id}
    />
  )}
</>
      </div>

      {/* Review cards */}
      <div className="space-y-6">
        {sampleReviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-100/10 border border-gray-200 rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                  {review.initial}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-black">
                    {review.name}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {review.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[15px] text-gray-600 leading-relaxed italic">
              {review.text}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-600 transition-colors">
              <ThumbsUp size={12} /> Helpful
            </div>
          </div>
        ))}
      </div>

      {/* Real reviews from API */}
      <ActivityReviews activityId={activity._id} />
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({
  transferType,
  setTransferType,
  selectedTier,
  setSelectedTier,
  displayPrice,
  selectedDate,
  setSelectedDate,
  dateInputRef,
  activity,
  selectedVariant,
  selectedTimeSlot,
  setSelectedTimeSlot,
  quantities,
  updateQuantity,
  canBook,
  isBooking,
  bookingError,
  handleBookNow,
  isSUV,
  suvAddonPrice,
  minPrice,
  onTabClick,
  activeTab,
  bookingStep,
  setBookingStep,
}) {
  const isSUVActive = transferType === "suv";
  const isVIP = selectedTier === "vip";
const fallbackTimes = [
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

const timeSlots =
  activity?.timeSlots?.length > 0
    ? activity.timeSlots.map((t) => t.startTime)
    : fallbackTimes;

    const fallbackGuests = [
  { _id: "adult", label: "Adults", price: 45 },
  { _id: "child", label: "Children", price: 25 },
];

const guestTypes =
  selectedVariant?.pricing?.filter((p) => p.type === "per_person")?.length > 0
    ? selectedVariant.pricing.filter((p) => p.type === "per_person")
    : fallbackGuests;
  return (
    // <div className="relative bg-white p-2 rounded-2xl max-h-[calc(100vh-120px)] overflow-auto shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
    <div className="relative bg-white p-2 rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100">
      {/* Top Blue Rounded Border */}
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 rounded-t-full"></div> */}
      {/* <div
  className={`absolute top-0 left-0 w-full h-1 rounded-t-full ${
    isVIP ? "bg-red-500" : "bg-blue-700"
  }`}
></div> */}
      
      <div className="absolute top-0 left-0 w-full rounded-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
          className="w-full h-2"
        >
          <path
            d="M0,40 Q250,0 500,40 L500,0 L0,0 Z"
            className={isVIP ? "fill-red-500" : "fill-blue-700"}
          />
        </svg>
      </div>

      {/* ── Transfer tabs ────────────────────────────────────────────────── */}
       {/* {bookingStep === 1 && (
      <div className="grid grid-cols-2 rounded-full">
        <button
          onClick={() => {
            setTransferType("self");
            onTabClick(activeTab);
          }}
          className={`flex items-center justify-center gap-2 py-1 text-[8px] font-bold uppercase tracking-wider transition-all border-b-2 ${
            !isSUVActive
              ? "border-blue-700 text-blue-600 bg-white"
              : "border-gray-200 text-gray-400 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Anchor size={12} /> Self Arrival
        </button>
        <button
          onClick={() => {
            setTransferType("suv");
            onTabClick(activeTab);
          }}
          className={`flex items-center justify-center gap-2 py-1 text-[8px] font-bold uppercase tracking-wider transition-all border-b-2 ${
            isSUVActive
              ? "border-blue-700 text-blue-700 bg-white"
              : "border-gray-200 text-gray-400 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Truck size={12} className={isSUVActive ? "text-blue-600" : ""} />
          +Private SUV
        </button>
      </div>
)} */}


{bookingStep === 1 && (
  <>
    {/* ── Transfer Tabs ── */}
    <div className="p-3">
      <div className="grid grid-cols-2 bg-gray-100 rounded-full p-1">
        <button
          onClick={() => {
            setTransferType("self");
            onTabClick(activeTab);
          }}
          className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-bold transition-all ${
            !isSUVActive
              ? "bg-white text-blue-700 shadow"
              : "text-gray-400"
          }`}
        >
          <Anchor size={14} /> SELF ARRIVAL
        </button>

        <button
          onClick={() => {
            setTransferType("suv");
            onTabClick(activeTab);
          }}
          className={`flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-bold transition-all ${
            isSUVActive
              ? "bg-white text-blue-700 shadow"
              : "text-gray-400"
          }`}
        >
          <Truck size={14} /> +PRIVATE SUV
        </button>
      </div>
    </div>
    {isSUVActive && (
  <div className="px-5">
    <div className="flex items-center gap-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl px-4 py-3">
      
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center shrink-0">
        <Truck size={16} className="text-gray-900" />
      </div>

      {/* Text */}
      <div>
        <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
          INCLUDED
        </div>
        <div className="text-[13px] font-semibold text-gray-800">
          Allocated: 1x SUV
        </div>
      </div>

    </div>
  </div>
)}

    <div className="px-5 pb-5 space-y-5">
      {/* ── Price ── */}
      <div className="flex items-end gap-2">
        <span className={`text-[32px] font-extrabold ${isVIP ? "text-red-500" : "text-blue-700"}`}>
          ${displayPrice > 0 ? displayPrice : minPrice || "45"}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          TOTAL
        </span>
      </div>

      {/* ── Date ── */}
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          EXPERIENCE DATE
        </label>

        <div
          onClick={() => dateInputRef.current?.showPicker()}
          className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 cursor-pointer"
        >
          <span className="text-[13px] font-semibold text-gray-800">
            {selectedDate
              ? new Date(selectedDate)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "DD-MM-YYYY"}
          </span>

          <Calendar size={16} className="text-gray-500" />

          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="absolute opacity-0 pointer-events-none"
          />
        </div>
      </div>

      {/* ── Ticket Tier ── */}
      <div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          <span>▦</span> TICKET TIER
        </label>

        <div className="space-y-3">
          {TICKET_TIERS.map((tier) => {
            const isActive = selectedTier === tier.key;
            const TierIcon = tier.icon;

            return (
              <div
                key={tier.key}
                onClick={() => {
                  setSelectedTier(tier.key);
                  onTabClick(activeTab);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isActive
                    ? "border-blue-700 bg-white shadow-md"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-blue-700" : "bg-gray-200"
                  }`}
                >
                  <TierIcon
                    size={18}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                </div>

                <div>
                  <div className="text-[14px] font-bold text-gray-900">
                    {tier.label}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                    {tier.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={() => setBookingStep(2)}
        className="w-full py-4 rounded-full bg-blue-700 text-white text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
      >
        NEXT: GUESTS & TIME <ChevronRight size={16} />
      </button>

      {/* ── Footer ── */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-200">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
          <Zap size={12} /> Instant Delivery
        </span>

        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 size={12} className="text-blue-600" /> Official Partner
        </span>
      </div>
    </div>
  </>
)}

      {/* {bookingStep === 1 && (
        <>
         {isSUVActive && (
            <div className="mx-4 mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                <Truck size={15} className="text-white" />
              </div>
              <div>
                <div className="text-[8px] font-black text-amber-600 uppercase tracking-wider">
                  Included
                </div>
                <div className="text-[8px] font-bold text-gray-800">
                  Allocated: 1x SUV
                </div>
              </div>
            </div>
          )}
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-baseline gap-1.5">
             <span
                className={`text-2xl font-black ${isVIP ? "text-red-600" : "text-blue-700"}`}
              >
                ${displayPrice > 0 ? displayPrice : minPrice || "45"}
              </span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                Total
              </span>
            </div>

           <div>
              <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Experience Date
              </label>
              <div
                className="relative flex items-center justify-between px-3.5 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <span
                  className={`text-[8px] font-semibold ${selectedDate ? "text-gray-800" : "text-gray-400"}`}
                >
                  {selectedDate
                    ? new Date(selectedDate)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")
                    : "DD-MM-YYYY"}
                </span>
                <Calendar size={15} className="text-gray-400" />
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
              <label className="flex items-center gap-1.5 text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">
                <span>▦</span> Ticket Tier
              </label>
              <div className="space-y-2">
                {TICKET_TIERS.map((tier) => {
                  const isActive = selectedTier === tier.key;
                  const TierIcon = tier.icon;
                  return (
                    <div
                      key={tier.key}
                      
                      onClick={() => {
                        setSelectedTier(tier.key);
                        onTabClick(activeTab);
                      }}
                      className={`flex items-center gap-3 px-3.5 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isActive
                          ? tier.key === "vip"
                            ? "border-red-500 bg-red-50 shadow-sm"
                            : "border-blue-700 bg-blue-50/30 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? (tier.key === "vip" ? "bg-red-500" : "bg-blue-700") : "bg-gray-100"}`}
                      >
                        <TierIcon
                          size={16}
                          className={isActive ? "text-white" : "text-gray-400"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-[8px] font-bold ${isActive ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {tier.label}
                        </div>
                        <div className="text-[8px] text-gray-400 uppercase font-semibold tracking-wider">
                          {tier.sub}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

        {activity?.timeSlots?.length > 0 && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Start Time
                </label>
                <div className="grid grid-cols-3 gap-2">
  {timeSlots.map((time, i) => (
    <button
      key={i}
      onClick={() => setSelectedTimeSlot(time)}
      className={`py-2 rounded-xl text-[10px] font-bold border transition-all
      ${
        selectedTimeSlot === time
          ? "bg-blue-900 text-white border-blue-900 shadow"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
      }`}
    >
      {time}
    </button>
  ))}
</div>
              </div>
            )}

           {(selectedVariant?.pricing || []).filter(
              (p) => p.type === "per_person",
            ).length > 0 && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Guests
                </label>
                <div className="space-y-2.5">
                  {(selectedVariant?.pricing || [])
                    .filter((p) => p.type === "per_person")
                    .map((p) => (
                      <div
                        key={p._id}
                        className="flex justify-between items-center py-0.5"
                      >
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {p.label}
                          </div>
                          <div className="text-xs text-gray-400">
                            {p.price} AED
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-200">
                          <button
                            onClick={() => updateQuantity(p._id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition disabled:opacity-30 text-base font-bold"
                            disabled={!quantities[p._id]}
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-black text-gray-900">
                            {quantities[p._id] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(p._id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition text-base font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
   <div className="space-y-2 pt-1">
              <button
               onClick={() => {
                  if (bookingStep === 1) {
                    setBookingStep(2);
                  } else {
                    handleBookNow();
                  }
                }}
                className={`w-full py-3 rounded-full font-black text-white uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isVIP
                    ? canBook && !isBooking
                      ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                      : "bg-red-500 cursor-pointer"
                    : canBook && !i9Booking
                      ? "bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-200"
                      : "bg-blue-900 cursor-pointer"
                }`}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="animate-spin" size={17} /> Processing...
                  </>
                ) : (
                  <>
             {bookingStep === 1
                      ? "Next: Guests & Time"
                      : `Book Now for $${displayPrice || 101}`}
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              {bookingError && (
                <div className="text-center p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  {bookingError?.data?.message ||
                    "Booking failed. Please try again."}
                </div>
              )}
            </div>
           <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100">
              <span className="text-[8px] text-gray-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Zap size={11} className="text-gray-400" /> Instant Delivery
              </span>
              <span className="text-[8px] text-gray-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <CheckCircle2 size={11} className="text-red-600" /> Official
                Partner
              </span>
            </div>
          </div>{" "}
         
        </>
      )} */}


      {/* {bookingStep === 2 && (
        <div className="px-5 py-4 space-y-5">
        
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              Step 2: Details
            </div>

            <button
              onClick={() => setBookingStep(1)}
              className="text-[10px] font-bold text-blue-600 flex items-center gap-1 uppercase"
            >
              ← Back
            </button>
          </div>

        
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Preferred Entry Time
            </label>

            <div className="grid grid-cols-3 gap-2">
  {timeSlots.map((time, i) => (
    <button
      key={i}
      onClick={() => setSelectedTimeSlot(time)}
      className={`py-2 rounded-xl text-[10px] font-bold border transition-all
      ${
        selectedTimeSlot === time
          ? "bg-gray-900 text-white border-blue-900 shadow"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
      }`}
    >
      {time}
    </button>
  ))}
</div>
          </div>

        

          {guestTypes.map((p) => (
  <div key={p._id} className="flex items-center justify-between ">

    <div>
      <div className="text-[10px] font-bold text-black">
        {p.label}
      </div>

      <div className="text-[8px] text-gray-400 font-semibold uppercase">
        AGE {p.label === "Adults" ? "12+" : "3-11"}
      </div>
    </div>

    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-2">

      <button
        onClick={() => updateQuantity(p._id, -1)}
        disabled={!quantities[p._id]}
        className="text-black text-[9px]  rounded-2xl py-1 px-2 border-[0.1] border-gray-100 bg-gray-200 font-bold"
      >
        −
      </button>

      <span className="w-2 text-center text-sm font-black text-gray-900">
        {quantities[p._id] || 0}
      </span>

      <button
        onClick={() => updateQuantity(p._id, 1)}
        className="text-black text-[9px]  rounded-2xl py-1 px-2 border-[0.1] border-gray-100 bg-gray-200 font-bold"
      >
        +
      </button>

    </div>
  </div>
))}

          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl py-3 px-4 flex items-center justify-between">
            <div>
              <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Price Breakdown
              </div>

              <div className="text-[9px] pt-2 font-semibold text-gray-800">
                Standard Entry (x1)
              </div>
            </div>

            <div className="text-right">
              <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Total
              </div>

              <div className="text-[9px] pt-2 font-black text-gray-900">
                ${displayPrice || 100}
              </div>
            </div>
          </div>

          
          <button
            onClick={handleBookNow}
            className="w-full py-3 rounded-full bg-blue-900 text-white font-black text-[8px] uppercase tracking-widest hover:bg-blue-800 transition"
          >
            BOOK NOW FOR ${displayPrice || 101}
          </button>

          
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100">
            <span className="text-[8px] text-gray-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
              <Zap size={11} /> Instant Delivery
            </span>

            <span className="text-[8px] text-gray-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
              <CheckCircle2 size={11} className="text-red-600" /> Official Partner
            </span>
          </div>
        </div>
      )} */}

      {bookingStep === 2 && (
  <div className="px-5 py-5 space-y-6">

    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        STEP 2: DETAILS
      </div>

      <button
        onClick={() => setBookingStep(1)}
        className={`text-[11px] font-bold uppercase flex items-center gap-1 ${
          isVIP ? "text-red-600" : "text-blue-700"
        }`}
      >
        ← BACK
      </button>
    </div>

    {/* TIME */}
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        PREFERRED ENTRY TIME
      </label>

      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time, i) => (
          <button
            key={i}
            onClick={() => setSelectedTimeSlot(time)}
            className={`py-3 rounded-xl text-[12px] font-bold border transition-all
              ${
                selectedTimeSlot === time
                  ? isVIP
                    ? "bg-red-900 text-white border-red-900"
                    : "bg-blue-900 text-white border-blue-900"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>

    {/* GUEST CARD */}
    <div className="bg-gray-100 rounded-[22px] p-5 space-y-5">
      {guestTypes.map((p) => (
        <div key={p._id} className="flex items-center justify-between">

          {/* LEFT */}
          <div>
            <div className="text-[14px] font-bold text-gray-900">
              {p.label}
            </div>

            <div className="text-[10px] text-gray-400 font-semibold uppercase">
              AGE {p.label === "Adults" ? "12+" : "3-11"}
            </div>
          </div>

          {/* RIGHT COUNTER */}
          <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 shadow-sm">
            
            <button
              onClick={() => updateQuantity(p._id, -1)}
              disabled={!quantities[p._id]}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold disabled:opacity-30"
            >
              −
            </button>

            <span className="w-5 text-center text-[13px] font-bold text-gray-900">
              {quantities[p._id] || 0}
            </span>

            <button
              onClick={() => updateQuantity(p._id, 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* PRICE BOX */}
    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-center justify-between">
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          PRICE BREAKDOWN
        </div>

        <div className="text-[13px] font-semibold text-gray-800 mt-1">
          Standard Entry (x1)
        </div>
      </div>

      <div className="text-right">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          TOTAL
        </div>

        <div className="text-[14px] font-bold text-gray-900 mt-1">
          ${displayPrice || 45}
        </div>
      </div>
    </div>

    {/* CTA */}
    <button
      onClick={handleBookNow}
      className={`w-full py-4 rounded-full text-white text-[13px] font-bold uppercase tracking-wider shadow-lg ${
        isVIP
          ? "bg-red-600 hover:bg-red-700"
          : "bg-blue-700 hover:bg-blue-800"
      }`}
    >
      BOOK NOW FOR ${displayPrice || 45}
    </button>

    {/* FOOTER */}
    <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-200">
      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
        <Zap size={12} /> Instant Delivery
      </span>

      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
        <CheckCircle2
          size={12}
          className={isVIP ? "text-red-500" : "text-blue-600"}
        />
        Official Partner
      </span>
    </div>
  </div>
)}
    </div>
  );
}
