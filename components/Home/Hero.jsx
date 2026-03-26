"use client";
import React, { useEffect, useState } from "react";
import { useInquiry } from "@/context/InquiryContext";
import { 
  Search, 
  MessageCircle, 
  ShieldCheck, 
  Sun, 
  CheckCircle2, 
  Sparkles, 
  FileText 
} from "lucide-react";

const images =[
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "/HomeImages/ban2.png",
  "/HomeImages/ban1.png",
];

export default function Hero() {
  const { openInquiry } = useInquiry();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  },[]);

  return (
    // Removed overflow-hidden here and reduced padding for less height ("hit kam kro")
    <section className="relative pt-20 pb-20 md:pt-24 md:pb-20 w-full font-sans z-10">
      
      {/* Background Wrapper (overflow hidden applied here so it doesn't cut off the floating bar) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Background slider */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Gradients to recreate the dark-left to light-right effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3036] via-[#2B3036]/90 to-transparent w-[85%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-white/30 via-transparent to-transparent opacity-80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:px-12 w-full flex flex-col items-start">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
          <span className="text-[#e2e8f0] text-[10px] font-extrabold tracking-widest uppercase">
            #1 DUBAI TOURISM PORTAL
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[40px] md:text-[54px] lg:text-[64px] font-extrabold leading-[1.05] tracking-tight text-white mb-5">
          Uncover the <br />
          <span className="text-[#B5D1F8]">Wonders of UAE</span>
        </h1>

        {/* Subtitle */}
        <div className="flex gap-3.5 max-w-[500px] mb-6">
          <span className="w-1 bg-[#EAB308] rounded-full shrink-0" />
          <p className="text-white/90 text-[13px] md:text-[14px] font-medium leading-relaxed">
            From the peaks of Burj Khalifa to the dunes of the Red
            Desert. Curated experiences by <strong className="font-extrabold text-white">Fun Tours Dubai.</strong>
          </p>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2.5 mb-7">
          <div className="px-3 py-1.5 rounded-[6px] bg-[#3B424A]/80 border border-gray-400/20 backdrop-blur-sm flex items-center gap-1.5">
            <CheckCircle2 size={13} strokeWidth={3} className="text-[#22c55e]" />
            <span className="text-white text-[9px] font-black uppercase tracking-wider">
              BEST PRICE GUARANTEE
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-[6px] bg-[#3B424A]/80 border border-gray-400/20 backdrop-blur-sm flex items-center gap-1.5">
            <CheckCircle2 size={13} strokeWidth={3} className="text-[#22c55e]" />
            <span className="text-white text-[9px] font-black uppercase tracking-wider">
              INSTANT CONFIRMATION
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 rounded-lg bg-[#004bb5] hover:bg-[#003c94] text-white text-[12px] font-extrabold tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40">
            <Sparkles size={15} className="text-yellow-400" /> AI Trip Planner
          </button>
          <button
            onClick={openInquiry}
            className="px-5 py-2.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-[12px] font-extrabold tracking-wide flex items-center gap-2 backdrop-blur-md transition-all"
          >
            <FileText size={15} className="text-white/80" /> Get Custom Quote
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar - Width decreased and Z-index increased */}
      <div className="absolute left-1/2 bottom-0 translate-y-1/2 translate-x-[-50%] w-[94%] max-w-[820px] z-[100]">
        {/* Frost Halo Ring */}
        <div className="p-2 bg-white/30 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
          
          {/* Inner Solid Container */}
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center px-4 md:px-6 py-2.5 rounded-[30px] bg-white shadow-sm w-full gap-4 md:gap-0">
            <Step
              num="1"
              icon={<Search size={15} strokeWidth={2.5} />}
              title="Find"
              desc="AI or Browse"
              color="text-[#004bb5]"
              bgColor="bg-blue-50"
              numColor="bg-[#004bb5]"
            />
            <Divider />
            <Step
              num="2"
              icon={<MessageCircle size={15} strokeWidth={2.5} />}
              title="Chat"
              desc="Expert Help"
              color="text-[#22c55e]"
              bgColor="bg-green-50"
              numColor="bg-[#22c55e]"
            />
            <Divider />
            <Step
              num="3"
              icon={<ShieldCheck size={15} strokeWidth={2.5} />}
              title="Book"
              desc="100% Secure"
              color="text-[#a855f7]"
              bgColor="bg-purple-50"
              numColor="bg-[#a855f7]"
            />
            <Divider />
            <Step
              num="4"
              icon={<Sun size={15} strokeWidth={2.5} />}
              title="Enjoy"
              desc="Hassle-Free"
              color="text-[#f59e0b]"
              bgColor="bg-yellow-50"
              numColor="bg-[#f59e0b]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helpers */

function Step({ num, icon, title, desc, color, bgColor, numColor }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Large Icon Circle */}
      <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 ${bgColor} ${color}`}>
        {icon}
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        {/* Title row with small number bubble */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`w-3.5 h-3.5 rounded-full text-white text-[8px] flex items-center justify-center font-black ${numColor}`}>
            {num}
          </span>
          <p className="text-[13px] font-black text-[#111827] leading-none tracking-tight">{title}</p>
        </div>
        
        {/* Subtitle */}
        <p className="text-[10px] font-bold text-[#6b7280] leading-none">{desc}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden md:block w-px h-[24px] bg-gray-200 shrink-0 mx-2" />;
}