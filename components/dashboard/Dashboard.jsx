"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Compass } from "lucide-react";

const DashboardUI = () => {
  const user = useSelector((state) => state.auth.user);

  // Greeting by time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl bg-[#c5a059]/10 flex items-center justify-center mb-6">
        <Compass className="w-10 h-10 text-[#c5a059]" />
      </div>

      {/* Greeting */}
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
        {greeting}, {user?.name || "Traveler"} 👋
      </h1>

      {/* Subtitle */}
      <p className="text-slate-500 mt-4 text-lg max-w-xl">
        Your travel dashboard is ready. Once you start booking experiences,
        everything will appear here in one place.
      </p>

      {/* Hint / CTA */}
      <div className="mt-8 text-sm text-slate-400">
        ✨ Book your first experience to get started
      </div>
    </div>
  );
};

export default DashboardUI;
