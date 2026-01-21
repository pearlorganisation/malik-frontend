"use client";

import React from "react";
import { LayoutGrid, Filter, List } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi"; // Using mock for demo

export default function CategoryBalls({
  limit = 12,
  showAllLink = true,
  setSelectedCategory,
  selectedCategory = "All Experiences", // Default
  viewMode = 'grid',
  setViewMode
}) {
  const { data: response, isLoading } = useGetCategoriesQuery({
    page: 1,
    limit: limit * 2,
  });

  const categories = response?.data || [];

  const allCategories = [
    { _id: 'all', name: 'All Experiences' },
    ...categories
  ];

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto px-6 py-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-24 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 p-2 mb-12 flex items-center justify-between overflow-hidden mx-6">
      {/* Left: Categories Scroller */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pr-4">
        {allCategories.map((category) => {
           const isActive = selectedCategory === category.name || (selectedCategory === "" && category.name === "All Experiences");
           
           return (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                ${
                  isActive
                    ? "bg-[#0047AB] text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Right: View & Filter Controls */}
      <div className="flex items-center gap-1 shrink-0 px-2 md:px-4 border-l border-slate-100">
        <button
          onClick={() => setViewMode && setViewMode('grid')}
          className={`p-2.5 rounded-xl transition-all ${
            viewMode === 'grid' 
              ? "bg-blue-50 text-[#0047AB]" 
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode && setViewMode('list')}
          className={`p-2.5 rounded-xl transition-all ${
            viewMode === 'list' 
              ? "bg-blue-50 text-[#0047AB]" 
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <List className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-slate-100 mx-2 hidden md:block"></div>
        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all hidden md:flex items-center gap-2">
            <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}