"use client";
import React, { useEffect, useState } from "react";

const images = [
<<<<<<< HEAD
  // Dubai skyline
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  // Burj Khalifa
  "./HomeImages/ban2.png",
  // Dubai Marina
  "./HomeImages/ban1.png",
];

function Hero() {
=======
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "./HomeImages/ban2.png",
  "./HomeImages/ban1.png",
];

export default function Hero() {
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
<<<<<<< HEAD
    }, 4000);
=======
    }, 4500);
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
<<<<<<< HEAD

=======
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
<<<<<<< HEAD
            index === current ? "opacity-100" : "opacity-0"
=======
            index === current ? "opacity-100 scale-105" : "opacity-0"
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
<<<<<<< HEAD
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
=======
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center">
          {/* Badge */}
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/10 text-white backdrop-blur">
            Premium Experiences
          </span>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              Best of Dubai
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-white/80 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
            Curated tours, luxury experiences & unforgettable adventures — crafted just for you.
          </p>

          {/* Search */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-lg flex items-center rounded-full overflow-hidden bg-white/90 backdrop-blur shadow-lg">
              <input
                type="text"
                placeholder="Search tours, places or experiences"
                className="flex-1 px-4 sm:px-6 py-3 text-xs sm:text-sm text-slate-900 outline-none bg-transparent"
              />
              <button className="px-5 sm:px-7 py-3 text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition">
                Search
              </button>
            </div>
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
          </div>
        </div>
      </div>

      {/* Slider Dots */}
<<<<<<< HEAD
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === current ? "bg-white" : "bg-white/50"
=======
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
            }`}
          />
        ))}
      </div>
    </section>
  );
}
<<<<<<< HEAD

export default Hero;
=======
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
