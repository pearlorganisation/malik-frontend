"use client";
import React from "react";
import {
  Send,
  Phone,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  PhoneCall,
  Compass,
  
} from "lucide-react";

import { useGetPagesQuery } from "@/features/page/pageApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi.js";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import Link from "next/link";



// Fallback mock categories - Used only if API fails or returns no data
const MOCK_CATEGORIES = [
  { _id: "1", name: "City Tours" },
  { _id: "2", name: "Desert Safari" },
  { _id: "3", name: "Dune Buggy" },
  { _id: "4", name: "Yacht Cruise" },
  { _id: "5", name: "Water Sports" },
  { _id: "6", name: "VIP & Luxury" },
  { _id: "7", name: "Attraction Tickets" },
  { _id: "8", name: "Theme Parks" },
  { _id: "9", name: "Photography" },
];

const Footer = ({ onPlanTripClick }) => {
  const {
    data: categoryData,
    isLoading,
    isError,
  } = useGetCategoriesQuery({ limit: 12 });


  const {
  data: placesResponse,
  isLoading: placesLoading,
  isError: placesError,
} = useGetAllPlacesQuery();

// backend structure: { data: [...] }
const places = placesResponse?.data || [];

  // Prioritize API data. If API fails, fall back to mocks for display purposes in development.
  const categories = categoryData?.data || [];

  const displayCategories =
    !isLoading && !isError && categories.length > 0
      ? categories
      : MOCK_CATEGORIES;

      const { data: cmsPages, isLoading: cmsLoading } = useGetPagesQuery();
  return (
    <footer className="w-full font-sans antialiased">
      {/* 1. CTA Banner Section - Blue Background */}
      <div className="bg-[#1d4ed8] text-white relative overflow-hidden">
        {/* Dot Pattern Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* CTA Left: Icon + Text */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10 shadow-inner">
                <Send className="w-6 h-6 text-white transform -rotate-12 translate-x-0.5 translate-y-0.5" />
              </div>
              <div className="pt-0.5">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Ready to explore?
                </h2>
                <p className="text-blue-100 text-sm md:text-base mt-1 opacity-90 font-medium">
                  Get a custom itinerary or book instantly via WhatsApp.
                </p>
              </div>
            </div>

            {/* CTA Right: Buttons */}
            <div className="flex flex-wrap items-center gap-3">
               <a 
                  href="https://wa.me/971501902213" 
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-none px-7 py-3.5 bg-white text-fun-blue font-black rounded-xl hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2.5 group active:scale-95"
                >
                   <Phone className="w-4 h-4 text-blue-600"/>
                    <span className="text-[13px] text-blue-600 tracking-tight">WhatsApp</span>

              </a>

              <button
  onClick={onPlanTripClick}
  className="flex items-center gap-2 bg-amber-500 text-blue-950 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-all shadow-md active:scale-95"
>
  <span>Have a Question</span>
  <ArrowRight size={18} />
</button>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content - Dark Navy Theme */}
      <div className="bg-[#020617] text-slate-400 pt-16 pb-8 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* COLUMN 1: Brand (Span 3) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Logo: DubaiTours */}
             <Link href="/" className="flex flex-col items-start leading-none group">
                           <div className="flex items-center gap-1">
                             <span className="text-[28px] font-black text-[#EF4444] tracking-tight">FUN</span>
                             <div className="w-7 h-7 bg-[#FFB800] rounded-full flex items-center justify-center">
                                <div className="relative w-4 h-4 border-b-2 border-white rounded-full flex items-center justify-center">
                                   <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full"></div>
                                   <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>
                                </div>
                             </div>
                             <span className="text-[28px] font-black text-[#0047AB] tracking-tight">TOURS</span>
                           </div>
                           <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-0.5 ml-0.5">
                             DUBAI TOURISM
                           </span>
                         </Link>

              <p className="text-xs leading-relaxed text-slate-500 font-medium">
                Premium UAE tourism partner. Creating authentic, safe
                experiences since 2002.
              </p>

             <div className="flex gap-2">
  {[
    {
      Icon: Instagram,
      link: "https://instagram.com",
      hover: "hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500",
      border: "hover:border-pink-500",
    },
    {
      Icon: Facebook,
      link: "https://facebook.com",
      hover: "hover:bg-[#1877F2]",
      border: "hover:border-[#1877F2]",
    },
    {
      Icon: Youtube,
      link: "https://youtube.com",
      hover: "hover:bg-[#FF0000]",
      border: "hover:border-[#FF0000]",
    },
  ].map(({ Icon, link, hover, border }, idx) => (
    <a
      key={idx}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-9 h-9 rounded-lg bg-[#0F172A] border border-slate-800 flex items-center justify-center text-slate-500 transition-all ${hover} ${border} hover:text-white`}
    >
      <Icon size={16} />
    </a>
  ))}
</div>
           

              {/* License Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] border border-green-900/30 text-green-500 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck size={14} className="text-green-500" />
                DTCM Licensed
              </div>

              {/* Selectors */}
              <div className="flex gap-2 pt-1">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] border border-slate-800 rounded text-[10px] font-bold hover:border-slate-600 transition text-slate-300">
                  <span className="text-slate-500">US</span> ENGLISH
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] border border-slate-800 rounded text-[10px] font-bold hover:border-slate-600 transition text-slate-300">
                  <DollarSign size={10} className="text-slate-500" /> USD
                </button>
              </div>
            </div>

            {/* COLUMN 2: Destinations & Categories (Span 5) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Destinations */}
             {/* Top Destinations */}
<div>
  <h3 className="flex items-center gap-2 text-white font-bold text-[11px] uppercase tracking-wider mb-4">
    <MapPin size={14} className="text-[#FACC15]" />
    Top Destinations
  </h3>

  <div className="flex flex-wrap gap-2">
    {placesLoading &&
      [1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-7 w-20 bg-[#0F172A] rounded-md animate-pulse border border-slate-800"
        />
      ))}

    {!placesLoading && placesError && (
      <span className="text-xs text-red-400">
        Failed to load destinations
      </span>
    )}

    {!placesLoading &&
      !placesError &&
      places.slice(0, 9).map((place) => (
        <Link
  key={place._id}
  href={`/activity?location=${place._id}`}
  scroll={true}
  className="px-3 py-1.5 rounded-md bg-[#0F172A] border border-slate-800 text-slate-400 text-[11px] font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"
>
  {place.name}
</Link>
      ))}
  </div>
</div>


              {/* Experience Categories */}
              <div>
                <h3 className="flex items-center gap-2 text-white font-bold text-[11px] uppercase tracking-wider mb-4">
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3 text-[#3b82f6]">
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                  </div>
                  Experience Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {isLoading
                    ? // Skeleton
                      [1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-7 w-20 bg-[#0F172A] rounded-md animate-pulse border border-slate-800"
                        />
                      ))
                    : displayCategories.map((cat, i) => (
                        // <a
                        //   key={i}
                        //   href={`/activity?category=${encodeURIComponent(
                        //     cat.name
                        //   )}`}
                        //   className="px-3 py-1.5 rounded-md bg-[#0F172A] border border-slate-800 text-slate-400 text-[11px] font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"
                        // >
                        //   {cat.name}
                        // </a>
       <Link
  key={cat._id}
  href={`/activity?category=${cat._id}`}
  scroll={true}
  className="px-3 py-1.5 rounded-md bg-[#0F172A] border border-slate-800 text-slate-400 text-[11px] font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"
>
  {cat.name}
</Link>
                      ))}
                </div>
              </div>
            </div>

            {/* COLUMN 3: Contact Info (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-white font-bold text-[11px] uppercase tracking-wider">
                Contact Info
              </h3>

              {/* Phone Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex items-center gap-3 hover:border-slate-700 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      Mobile
                    </div>
                    <div className="text-white font-bold text-xs">
                      +971 50 190 2213
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3 flex items-center gap-3 hover:border-slate-700 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <PhoneCall size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      Office
                    </div>
                    <div className="text-white font-bold text-xs">
                      +971 4 295 2213
                    </div>
                  </div>
                </div>
              </div>

              {/* Email & Address */}
              <div className="space-y-3 pl-1">
                <a
                  href="mailto:info@dubaitours.com"
                  className="flex items-center gap-3 group text-xs hover:text-[#3b82f6] transition-colors"
                >
                  <Mail
                    size={14}
                    className="text-slate-500 group-hover:text-[#3b82f6]"
                  />
                  info@dubaitours.com
                </a>
                <div className="flex items-start gap-3 text-xs">
                  <MapPin
                    size={14}
                    className="text-slate-500 mt-0.5 shrink-0"
                  />
                  <span className="text-slate-400">
                    Office 213, Port Saeed, Deira, Dubai, UAE
                  </span>
                </div>
              </div>

              {/* Secure Checkout Box */}
              <div className="bg-[#0F172A] rounded-lg p-4 border border-slate-800 mt-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8"></div>

                <div className="flex justify-between items-center mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-white font-bold text-xs tracking-tight">
                      Secure Checkout
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase font-bold">
                      Trusted By
                    </div>
                    <div className="text-white font-bold text-[10px]">
                      30k+ Guests
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 relative z-10">
                  <div className="px-2 py-1 bg-white rounded text-[9px] font-black text-[#1a1f71] tracking-tighter">
                    VISA
                  </div>
                  <div className="px-2 py-1 bg-white rounded text-[9px] font-black text-[#EB001B] tracking-tighter">
                    MC
                  </div>
                  <div className="px-2 py-1 bg-white rounded text-[9px] font-black text-[#006fcf] tracking-tighter">
                    AMEX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        {/* <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-600 font-medium">
            <div>
              &copy; {new Date().getFullYear()} Dubai Tours. All rights
              reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                "About Us",
                "Privacy Policy",
                "Terms of Service",
                "Cancellation Policy",
                "Sitemap",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-slate-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div> */}
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-900/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-600 font-medium">
          <div>
            &copy; {new Date().getFullYear()} Fun Tours. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
  {/* cmsPages agar undefined hua toh map crash kar dega, isliye ?. use karein */}
  {!cmsLoading && cmsPages?.map((page) => (
    <Link
      key={page._id}
      href={`/info/${page.slug}`}
      className="hover:text-slate-400 transition-colors uppercase tracking-wider"
    >
      {page.title}
    </Link>
  ))}
  
  {/* <Link href="/sitemap" className="hover:text-slate-400 transition-colors uppercase tracking-wider">
     Sitemap
  </Link> */}
</div>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
