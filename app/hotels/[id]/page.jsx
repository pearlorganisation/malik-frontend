'use client';

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, Star, MapPin, Phone, Mail, 
  Clock, CheckCircle2, Wifi, Coffee, Car, 
  Wind, ShieldCheck, Waves, Utensils,
  ArrowLeft
} from 'lucide-react';
import { useGetHotelByIdQuery } from "@/features/hotel/hotelApi";

const HotelDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const { data: response, isLoading, error } = useGetHotelByIdQuery(id);
  const hotel = response?.data;
console.log(":hot",hotel);
  // Amenity icon mapper
  const getAmenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi size={16} />;
    if (n.includes('ac') || n.includes('air')) return <Wind size={16} />;
    if (n.includes('parking')) return <Car size={16} />;
    if (n.includes('restaurant') || n.includes('food')) return <Utensils size={16} />;
    if (n.includes('power')) return <ShieldCheck size={16} />;
    return <CheckCircle2 size={16} />;
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen font-bold text-slate-400 animate-pulse">LOADING HOTEL DETAILS...</div>;
  if (error || !hotel) return <div className="text-center mt-20 text-red-500 font-bold">Hotel not found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* --- HEADER / NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded">Verified</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24">
        
        {/* --- IMAGE GALLERY --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[450px] mb-8">
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
            <Image 
              src={hotel.images.find(img => img.isPrimary)?.url || hotel.images[0]?.url} 
              alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4">
            {hotel.images.filter(img => !img.isPrimary).slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden group">
                <Image src={img.url} alt={hotel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
            {hotel.images.length < 2 && (
                 <div className="bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs">More photos coming soon</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT CONTENT --- */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black">{hotel.rating?.average}</span>
                  <span className="text-[10px] text-orange-300">({hotel.rating?.count} reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-500">{hotel.location?.city}, {hotel.location?.state}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 leading-tight">{hotel.name}</h1>
              <p className="flex items-center gap-1.5 text-slate-400 mt-2 text-sm font-medium">
                <MapPin size={16} className="text-blue-500" /> {hotel.location?.address}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-xl font-black mb-4">About this hotel</h2>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            {/* --- AMENITIES --- */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-xl font-black mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {hotel.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-xs font-bold">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- POLICIES --- */}
            <div className="border-t border-slate-100 pt-8 grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-3xl">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock size={16} />
                  <span className="text-[10px] font-black uppercase">Check-in</span>
                </div>
                <p className="text-lg font-black text-slate-800">{hotel.checkInTime || "12:00 PM"}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock size={16} />
                  <span className="text-[10px] font-black uppercase">Check-out</span>
                </div>
                <p className="text-lg font-black text-slate-800">{hotel.checkOutTime || "11:00 AM"}</p>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (Price & Contact) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[40px] p-8 space-y-6 bg-white">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Price per night</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">₹{hotel.discountPrice || hotel.pricePerNight}</span>
                    {hotel.discountPrice && (
                      <span className="text-slate-400 line-through text-sm font-bold">₹{hotel.pricePerNight}</span>
                    )}
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">
                    AVAILABLE
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-200">
                  BOOK NOW
                </button>
                <button 
                   onClick={() => window.location.href = `tel:${hotel.contact?.phone}`}
                   className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-800 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={14} /> CONTACT HOTEL
                </button>
                {hotel?.referwebsiteurl && (
  <button
    onClick={() => window.open(hotel.referwebsiteurl, "_blank")}
    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-xs transition-all"
  >
    VISIT WEBSITE
  </button>
)}
              </div>

              <div className="pt-6 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        <Mail size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Email Support</p>
                        <p className="text-xs font-bold text-slate-700">{hotel.contact?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        <Phone size={14} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Phone Number</p>
                        <p className="text-xs font-bold text-slate-700">{hotel.contact?.phone}</p>
                    </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-slate-400 font-medium">
                *Taxes and fees will be calculated at checkout
              </p>
            </div>
          </div>

        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-20 border-t border-slate-100 pt-16">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Guest Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotel.reviews?.length > 0 ? hotel.reviews.map((rev) => (
                    <div key={rev._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 italic">"{rev.comment}"</p>
                        <p className="mt-4 text-[10px] font-black text-slate-900 uppercase">Guest User</p>
                    </div>
                )) : (
                    <p className="text-slate-400 font-bold text-sm">No reviews yet for this property.</p>
                )}
            </div>
        </div>

      </main>
    </div>
  );
};

export default HotelDetailPage;