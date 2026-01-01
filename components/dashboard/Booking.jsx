"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Loader2,
  ArrowRight,
  MapPin,
  Timer,
} from "lucide-react";
import { useGetMyBookingsQuery } from "@/features/booking/bookApi";
import { useRouter } from "next/navigation";

/* -------------------- BOOKING CARD -------------------- */
const BookingCard = ({ booking }) => {
  const router = useRouter();

  const mainImage =
    booking?.activity?.images?.find((img) => img.isMain)?.url ||
    booking?.activity?.images?.[0]?.url ||
    "/placeholder.jpg";

  const statusConfig = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    paid: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    completed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  };

  const statusStyle = statusConfig[booking.status] || statusConfig.pending;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalParticipants = booking.participants.reduce((acc, p) => acc + p.quantity, 0);

  const durationLabel =
    booking.activity.duration?.label ||
    (booking.activity.duration?.hours
      ? `${booking.activity.duration.hours} Hours`
      : "N/A");

  return (
    <div className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image with Overlay */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={mainImage}
          alt={booking.activity.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Location Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800">
          <MapPin className="w-4 h-4" />
          Dubai, UAE
        </div>

        {/* Title & Variant Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {booking.activity.title}
          </h3>
          <p className="text-white/90 text-base mt-1">{booking.variantName}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left: Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold text-gray-900">{booking.timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Right: Duration & Guests */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">{durationLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-semibold text-gray-900">
                  {totalParticipants} {totalParticipants > 1 ? "Pax" : "Pax"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total & Button */}
        <div className="flex items-center justify-between   border-gray-100">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total Paid</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {booking.totalAmount} <span className="text-xl font-semibold text-gray-700">{booking.currency}</span>
            </p>
          </div>

          <button
            onClick={() => router.push(`/activity/${booking.activity._id}`)}
            className="bg-slate-900 hover:bg-slate-800 text-white  px-8 py-3 rounded-full flex items-center gap-3 transition-all"
          >
            Details
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------- MY BOOKINGS PAGE -------------------- */
const MyBookings = () => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading, isError } = useGetMyBookingsQuery({ page, limit: 10 });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination;

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your adventures in Dubai</p>
          </div>

          <div className="relative mt-6 md:mt-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by activity..."
              className="bg-white border border-gray-200 rounded-full py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-gray-400 transition"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10 flex items-center gap-4 overflow-x-auto pb-2">
          {["all","paid","pending", "cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`px-6 py-2.5 rounded-full font-medium capitalize transition-all whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all" ? "All Bookings" : filter}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              <p className="text-gray-600 mt-4 text-lg">Loading your bookings...</p>
            </div>
          ) : isError ? (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-red-100">
              <p className="text-red-600 text-lg font-medium">Failed to load bookings. Please try again.</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Found</h3>
              <p className="text-gray-600">Start exploring and book your next adventure!</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))
          )}
        </div>

        {/* Pagination (if needed) */}
        {pagination && filteredBookings.length > 0 && (
          <div className="mt-16 flex justify-center gap-4">
            {/* ... pagination buttons ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;