"use client";
import React from "react";
import { X, LayoutGrid, Check } from "lucide-react";

export default function FilterModal({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  colsPerRow, 
  setColsPerRow 
}) {
  if (!isOpen) return null;

  const allCategories = [{ _id: "", name: "All Experiences" }, ...categories];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop/Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Refine Results</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          
          {/* 1. Category Selection */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">
              Experience Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allCategories.map((cat) => {
                const isActive = selectedCategory === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all
                      ${isActive 
                        ? "bg-[#0047AB] text-white shadow-lg shadow-blue-200" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                  >
                    {cat.name}
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Grid Column Selection */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">
              Display Layout (Columns)
            </label>
            <div className="flex flex-wrap gap-3">
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setColsPerRow(num)}
                  className={`flex-1 min-w-[80px] flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
                    ${colsPerRow === num 
                      ? "border-[#0047AB] bg-blue-50 text-[#0047AB]" 
                      : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`}
                >
                  <LayoutGrid className={`w-5 h-5 ${colsPerRow === num ? "text-[#0047AB]" : "text-slate-300"}`} />
                  <span className="text-xs font-black">{num} Columns</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white font-black rounded-full hover:bg-black transition-transform active:scale-95 shadow-xl uppercase text-xs tracking-widest"
          >
            Show Adventures
          </button>
        </div>
      </div>
    </div>
  );
}