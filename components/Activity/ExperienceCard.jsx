import React from "react";
import { Star, Clock, MapPin, Check, Heart, HelpCircle, ArrowRight } from "lucide-react";

const getStartingPrice = (variants = []) => {
  const prices = [];
  variants.forEach((v) =>
    v.pricing?.forEach((p) => p.price > 0 && prices.push(p.price))
  );
  return prices.length ? Math.min(...prices) : null;
};

export const ExperienceCard = ({ activity, onClick, viewMode = 'grid' }) => {
  const price = getStartingPrice(activity.variants);
  const durationHours = activity.duration?.hours || 6;
  const rating = activity.rating > 0 ? activity.rating.toFixed(1) : "4.8";
  const reviewCount = activity.reviewCount || 100;
  const hasFreeCancellation = activity.cancellationPolicy?.isFreeCancellation;
  const location = activity.location || (activity.pickup?.included ? "Pickup Included" : "Dubai");

  // Logic to simulate the "Badge" look from the reference
  const ribbons = ["BEST SELLER", "POPULAR", "MUST SEE", "LUXURY", "THRILL"];
  // Deterministic "random" based on title length
  const ribbonIndex = activity.title.length % ribbons.length;
  const ribbon = ribbons[ribbonIndex];

  const isBestSeller = ribbon === 'BEST SELLER';
  const isLuxury = ribbon === 'LUXURY';
  
  const ribbonColorClass = isBestSeller ? 'bg-[#EF4444] text-white' : // Red
                           isLuxury ? 'bg-slate-900 text-white' : // Black
                           'bg-[#FFC107] text-slate-900'; // Orange (default)

  const tags = activity.tags && activity.tags.length > 0 ? activity.tags.slice(0, 3) : ["Adventure", "Sightseeing"];

  const isGrid = viewMode === 'grid';

  return (
    <div className="bg-white rounded-[22px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full">
      {/* Image Container */}
      <div className={`relative overflow-hidden cursor-pointer w-full ${
        isGrid ? 'aspect-[4/3]' : 'h-80 md:h-140'
      }`} onClick={onClick}>
        <img
          src={activity.images?.[0]?.url || "https://picsum.photos/400/300"}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

        {/* Ribbon Badge */}
        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div className={`absolute top-[18px] left-[-35px] w-[140px] py-1 text-center text-[9px] font-black uppercase tracking-wider -rotate-45 shadow-sm z-10 ${ribbonColorClass}`}>
            {ribbon}
          </div>
        </div>

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white transition-all hover:bg-white hover:text-red-500 z-10">
          <Heart className="w-4 h-4" />
        </button>

        {/* Bottom Overlay Info (Rating & Free Cancel) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 text-white">
            <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
            <span className="text-[12px] font-black">{rating}</span>
            <span className="text-[10px] font-bold text-white/80">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {hasFreeCancellation && (
            <div className="bg-white/90 backdrop-blur-sm text-[#065f46] px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm border border-white/20">
              <Check className="w-3 h-3 stroke-[3]" /> Free Cancel
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className={`${isGrid ? 'text-[16px]' : 'text-xl'} font-extrabold text-[#0f172a] leading-tight mb-2.5 ${isGrid ? 'line-clamp-2 md:line-clamp-1' : ''}`} title={activity.title}>
          {activity.title}
        </h3>

        {/* Duration & Location */}
        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {durationHours}h
          </div>
          <span className="text-gray-200">•</span>
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#FFC107]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-[#0047AB] text-[9px] font-bold px-2 py-0.5 rounded-md border border-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Price & Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              FROM
            </div>
            <div className="text-2xl font-black text-[#0047AB] tracking-tighter">
              {price ? `$${price}` : "On request"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-[14px] bg-[#F8FAFC] flex items-center justify-center text-slate-400 border border-slate-100 transition-all hover:bg-[#FFC107] hover:text-slate-900 hover:border-[#FFC107] active:scale-95 group/q"
              title="Have a question?"
            >
              <HelpCircle className="w-5 h-5 group-hover/q:rotate-12 transition-transform" />
            </button>
            <button
              onClick={onClick}
              className="bg-[#0f172a] text-white rounded-[14px] px-5 py-2.5 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider shadow-lg hover:bg-slate-800 transition-all active:scale-95"
            >
              VIEW <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};