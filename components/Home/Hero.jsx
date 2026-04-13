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

const images = [
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
  }, []);

  return (
    <section className="relative w-full font-sans z-10" style={{ paddingTop: "80px", paddingBottom: "80px" }}>

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B3036] via-[#2B3036]/90 to-transparent w-[85%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-white/30 via-transparent to-transparent opacity-80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-7 py-6 md:py-8 w-full flex flex-col items-start">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm mb-4 md:mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
          <span className="text-[#e2e8f0] text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase">
            #1 DUBAI TOURISM PORTAL
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[54px] lg:text-[64px] font-extrabold leading-[1.05] tracking-tight text-white mb-4 md:mb-5">
          Uncover the <br />
          <span className="text-[#B5D1F8]">Wonders of UAE</span>
        </h1>

        {/* Subtitle */}
        <div className="flex gap-3 max-w-[320px] sm:max-w-[420px] md:max-w-[500px] mb-5 md:mb-6">
          <span className="w-1 min-w-[4px] bg-[#EAB308] rounded-full shrink-0" />
          <p className="text-white/90 text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-relaxed">
            From the peaks of Burj Khalifa to the dunes of the Red Desert. Curated experiences by{" "}
            <strong className="font-extrabold text-white">Fun Tours Dubai.</strong>
          </p>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2 mb-5 md:mb-7">
          <div className="px-2.5 sm:px-3 py-1.5 rounded-[6px] bg-[#3B424A]/80 border border-gray-400/20 backdrop-blur-sm flex items-center gap-1.5">
            <CheckCircle2 size={12} strokeWidth={3} className="text-[#22c55e] shrink-0" />
            <span className="text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
              BEST PRICE GUARANTEE
            </span>
          </div>
          <div className="px-2.5 sm:px-3 py-1.5 rounded-[6px] bg-[#3B424A]/80 border border-gray-400/20 backdrop-blur-sm flex items-center gap-1.5">
            <CheckCircle2 size={12} strokeWidth={3} className="text-[#22c55e] shrink-0" />
            <span className="text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
              INSTANT CONFIRMATION
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          <button className="px-4 sm:px-5 py-2.5 rounded-lg bg-[#004bb5] hover:bg-[#003c94] text-white text-[11px] sm:text-[12px] font-extrabold tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 whitespace-nowrap">
            <Sparkles size={14} className="text-yellow-400 shrink-0" /> AI Trip Planner
          </button>
          <button
            onClick={openInquiry}
            className="px-4 sm:px-5 py-2.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-[12px] font-extrabold tracking-wide flex items-center gap-2 backdrop-blur-md transition-all whitespace-nowrap"
          >
            <FileText size={14} className="text-white/80 shrink-0" /> Get Custom Quote
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-[820px] z-[100]">
        <div className="p-1.5 sm:p-2 bg-white/30 backdrop-blur-xl rounded-[28px] sm:rounded-[40px] border border-white/50 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
          <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-[20px] sm:rounded-[30px] bg-white shadow-sm w-full gap-0">
            <Step
              num="1"
              icon={<Search size={13} strokeWidth={2.5} />}
              title="Find"
              desc="AI or Browse"
              color="text-[#004bb5]"
              bgColor="bg-blue-50"
              numColor="bg-[#004bb5]"
            />
            <Divider />
            <Step
              num="2"
              icon={<MessageCircle size={13} strokeWidth={2.5} />}
              title="Chat"
              desc="Expert Help"
              color="text-[#22c55e]"
              bgColor="bg-green-50"
              numColor="bg-[#22c55e]"
            />
            <Divider />
            <Step
              num="3"
              icon={<ShieldCheck size={13} strokeWidth={2.5} />}
              title="Book"
              desc="100% Secure"
              color="text-[#a855f7]"
              bgColor="bg-purple-50"
              numColor="bg-[#a855f7]"
            />
            <Divider />
            <Step
              num="4"
              icon={<Sun size={13} strokeWidth={2.5} />}
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

function Step({ num, icon, title, desc, color, bgColor, numColor }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 justify-center sm:justify-start min-w-0">
      {/* Icon circle — smaller on mobile */}
      <div className={`w-[28px] h-[28px] sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center shrink-0 ${bgColor} ${color}`}>
        {icon}
      </div>
      {/* Text — hidden desc on very small screens */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full text-white text-[7px] sm:text-[8px] flex items-center justify-center font-black shrink-0 ${numColor}`}>
            {num}
          </span>
          <p className="text-[11px] sm:text-[13px] font-black text-[#111827] leading-none tracking-tight truncate">{title}</p>
        </div>
        <p className="text-[8px] sm:text-[10px] font-bold text-[#6b7280] leading-none truncate hidden xs:block sm:block">{desc}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-[20px] sm:h-[24px] bg-gray-200 shrink-0 mx-1 sm:mx-2" />;
}