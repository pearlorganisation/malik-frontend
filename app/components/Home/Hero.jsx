"use client";
import React, { useEffect, useState } from "react";

const images = [
  // Dubai skyline
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  // Burj Khalifa
  "./HomeImages/ban2.png",
  // Dubai Marina
  "./HomeImages/ban1.png",
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-3xl text-center">

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Discover Dubai Tours
          </h1>

          <p className="text-white/80 mt-3 text-sm sm:text-base">
            Find the best experiences, attractions, and tours in Dubai.
          </p>

          {/* Search Form */}
          <div className="mt-8 bg-white rounded-full shadow-xl flex items-center overflow-hidden">
            <input
              type="text"
              placeholder="Search tours, places, activities..."
              className="flex-1 px-6 py-4 text-sm sm:text-base outline-none"
            />
            <button className="bg-emerald-600 text-white px-8 py-4 text-sm sm:text-base font-semibold hover:bg-emerald-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
