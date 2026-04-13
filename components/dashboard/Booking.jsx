"use client";
import React, { useState } from "react";
import { useGetMyBookingsQuery } from "@/features/booking/bookApi";
import { 
  Calendar, Clock3, Users, MapPin, Ticket, 
  ChevronRight, Loader2, X, ShieldCheck, CreditCard,
  Mail, Phone, Info, CheckCircle2, AlertCircle
} from "lucide-react";
import Image from "next/image";

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading, isError } = useGetMyBookingsQuery({ 
    page, 
    status: statusFilter 
  });

  // Backend response key "bookings" use karni hai
  const bookings = data?.bookings || [];
  const pagination = data?.pagination || {};

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Verifying your schedule...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FBFF] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Adventures</h1>
          <p className="text-slate-500 font-medium mt-2">Track your desert safaris and UAE excursions in one place.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
                statusFilter === f 
                ? "bg-[#111827] text-white border-[#111827] shadow-xl shadow-gray-200" 
                : "bg-white text-slate-500 border-slate-200 hover:border-blue-400"
              }`}
            >
              {f === "all" ? "View All" : f}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No Reservations</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">You haven't booked any activities yet. Time to explore!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onViewDetails={() => setSelectedBooking(booking)} 
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-3">
             {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                    page === i + 1 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-white border border-slate-200 text-slate-400 hover:border-blue-400"
                  }`}
                >
                  {i + 1}
                </button>
             ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
}

/* ------------------ SUB-COMPONENTS ------------------ */

const BookingCard = ({ booking, onViewDetails }) => {
  const statusConfig = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    cancelled: "bg-red-50 text-red-600 border-red-100"
  };

  // Image Logic Fix: "activity.Images" se secure_url uthana
  const activityImg = booking.activity?.Images?.[0]?.secure_url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-3 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image Box */}
        <div className="relative w-full sm:w-52 h-52 rounded-[24px] overflow-hidden shrink-0">
          <Image 
            src={activityImg} 
            alt="Tour" 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${statusConfig[booking.status] || statusConfig.pending}`}>
            {booking.status}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 py-2 pr-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {booking.bookingReference}
            </span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 leading-tight line-clamp-2 mb-1">{booking.activityName}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide border-l-2 border-slate-200 pl-2 mb-4">{booking.variantName}</p>

          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar size={15} className="text-blue-500" />
              <span className="text-xs font-bold">{new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Clock3 size={15} className="text-blue-500" />
              <span className="text-xs font-bold">{booking.timeSlot}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase">Paid Amount</span>
                <span className="text-2xl font-black text-slate-900">${booking.totalAmount}<span className="text-sm ml-1 font-bold text-slate-400">AED</span></span>
            </div>
            <button 
              onClick={onViewDetails}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-100"
            >
              Get Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingDetailModal = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
        
        {/* Modal Header */}
        <div className="bg-[#111827] p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Ticket size={28} className="text-white" />
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight">Booking Voucher</h3>
                <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em]">{booking.bookingReference}</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-blue-500" /> Passenger Information
              </h4>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-lg font-black text-slate-900">{booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500"><Mail size={14} /> {booking.guestDetails.email}</div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500"><Phone size={14} /> {booking.guestDetails.whatsappPhone}</div>
                </div>
              </div>
            </div>

            {/* Travel Info */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" /> Pickup & Fleet
              </h4>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-sm font-black text-slate-700 leading-snug uppercase">{booking.guestDetails.pickupHotel}</p>
                {booking.extras.isSuvSelected && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase">Private SUV Service Included</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown (Match JSON Keys) */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={14} className="text-blue-500" /> Financial Summary
            </h4>
            <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                <div className="p-8 space-y-4">
                    {booking.amountBreakdown?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-300">QTY: {item.quantity}</span>
                                <span className="font-black text-slate-900">${item.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <p className="text-[11px] font-black uppercase text-emerald-400">{booking.paymentStatus.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <span className="text-4xl font-black">${booking.totalAmount}<span className="text-lg font-bold text-slate-500 ml-1">AED</span></span>
                </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
             <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
             <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic">
               Please present this digital voucher at the camp entrance or to your safari captain. ID verification may be required during the boarding process.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};