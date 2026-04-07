"use client";
import React from "react";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

export default function CategoryBalls({
  limit = 12,
  setSelectedCategory,
  selectedCategory = "",
  viewMode = "grid",
  setViewMode,
  colsPerRow,      // New Prop from Parent
  setColsPerRow,   // New Prop from Parent
}) {
  const { data: response, isLoading } = useGetCategoriesQuery({
    page: 1,
    limit: limit * 2,
  });

  const categories = response?.data || [];
  const allCategories = [
    { _id: "", name: "All Experiences" },
    ...categories,
  ];

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto px-6 py-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 p-2 mb-12 flex items-center justify-between overflow-hidden mx-6">
      
      {/* Left: Horizontal Category Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pr-4 flex-1">
        {allCategories.map((category) => {
          const isActive = (category._id === "" && selectedCategory === "") || selectedCategory === category._id;
          return (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                ${isActive ? "bg-[#0047AB] text-white shadow-lg shadow-blue-900/20" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 shrink-0 px-2 md:px-4 border-l border-slate-100">
        
        {/* Grid/List Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-blue-50 text-[#0047AB]" : "text-slate-400 hover:text-slate-600"}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-blue-50 text-[#0047AB]" : "text-slate-400 hover:text-slate-600"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-100 mx-1 hidden md:block"></div>

        {/* --- NEW DROPDOWNS REPLACING FILTER BUTTON --- */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Category Dropdown (Synced with buttons) */}
          <div className="relative group">
             <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-bold py-1 pl-3 pr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer uppercase tracking-wider"
            >
              {allCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Cards Per Row Dropdown */}
          {viewMode === "grid" && (
            <div className="relative">
              <select 
                value={colsPerRow}
                onChange={(e) => setColsPerRow(Number(e.target.value))}
                className="appearance-none bg-slate-900 text-white text-[11px] font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
                <option value={5}>5 Columns</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}