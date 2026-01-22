"use client";
import React, { useEffect, useState } from "react";
import { Search, MessageCircle, ShieldCheck, Sun } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "/HomeImages/ban2.png",
  "/HomeImages/ban1.png",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
   <section className="relative pb-20 mt-8 pt-10 ">
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-4 pt-20">
        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/25 text-white text-[11px] font-semibold backdrop-blur">
          #1 DUBAI TOURISM PORTAL
        </span>

        {/* Heading */}
        <h1 className="mt-4 text-[30px] md:text-[40px] font-bold leading-tight text-white">
          Uncover the <br />
          <span className="text-[#dbeafe]">Wonders of UAE</span>
        </h1>

        {/* Subtitle */}
        <div className="mt-3 flex gap-3 max-w-lg">
          <span className="w-[2px] bg-yellow-400 rounded-full" />
          <p className="text-white/90 text-[13px] leading-relaxed">
            From the peaks of Burj Khalifa to the dunes 
            of the Red Desert.
            Curated experiences by <strong>Fun Tours Dubai</strong>.
          </p>
        </div>

        {/* Info badges */}
        <div className="mt-3 flex gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-[11px] font-semibold">
            ✔ BEST PRICE GUARANTEE
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-700 text-white text-[11px] font-semibold">
            ✔ INSTANT CONFIRMATION
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition">
            ✨ AI Trip Planner
          </button>
          <button className="px-4 py-2 rounded-md border border-white/40 bg-white/10 text-white text-[13px] font-semibold backdrop-blur hover:bg-white/20 transition">
            📄 Get Custom Quote
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar */}
<div className="absolute left-1/2 -bottom-10 translate-x-[-50%] w-[92%] max-w-4xl z-50 ">
  <div className="relative rounded-full p-[2px] 
    bg-gradient-to-r from-white/60 via-white/80 to-white/60
    shadow-[0_20px_45px_rgba(0,0,0,0.18)] p-8">

    <div className="flex justify-between items-center 
      px-6 py-3.5 rounded-full 
      bg-white/90 backdrop-blur-xl">

      <Step
        icon={<Search size={14} />}
        title="Find"
        desc="AI or Browse"
        color="bg-blue-100 text-blue-600"
      />
      <Divider />
      <Step
        icon={<MessageCircle size={14} />}
        title="Chat"
        desc="Expert Help"
        color="bg-green-100 text-green-600"
      />
      <Divider />
      <Step
        icon={<ShieldCheck size={14} />}
        title="Book"
        desc="100% Secure"
        color="bg-purple-100 text-purple-600"
      />
      <Divider />
      <Step
        icon={<Sun size={14} />}
        title="Enjoy"
        desc="Hassle-Free"
        color="bg-yellow-100 text-yellow-600"
      />
    </div>
  </div>
</div>

    </section>
  );
}

/* Helpers */

function Step({ icon, title, desc, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-semibold text-gray-900">{title}</p>
        <p className="text-[10px] text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-gray-300" />;
}
