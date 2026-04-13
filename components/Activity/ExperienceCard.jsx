import React from "react";
import {
  Star,
  Clock,
  MapPin,
  Check,
  Heart,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  PhoneCall,
  PhoneCallIcon,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const getStartingPrice = (variants = []) => {
  const prices = [];
  variants.forEach((v) =>
    v.pricing?.forEach((p) => p.price > 0 && prices.push(p.price))
  );
  return prices.length ? Math.min(...prices) : null;
};

export const ExperienceCard = ({ activity, viewMode = "grid" }) => {
  const router = useRouter();

  const price = getStartingPrice(activity.variants);
  const title = activity.title || activity.name || "Untitled Activity";
  const rating = activity.rating || 4.8;
  const reviewCount = activity.reviewCount || 1200;
  const durationHours = activity.duration?.hours || 6;
  const location = activity.location || "Dubai";
  const hasFreeCancellation = activity.cancellationPolicy?.isFreeCancellation;
  const tags = activity.tags?.slice(0, 2) || ["Adventure", "Sightseeing"];

  const image =
    activity.images?.[0]?.url?.trim() ||
    activity.images?.[0]?.secure_url?.trim() ||
    (typeof activity.images?.[0] === "string" && activity.images?.[0].trim()) ||
    "https://picsum.photos/400/300";

  const handleRedirect = () => router.push(`/activity/${activity._id}`);

  const ribbons = ["POPULAR", "BEST SELLER", "THRILL", "MUST SEE"];
  const ribbon = ribbons[title.length % ribbons.length];
  const ribbonColor =
    ribbon === "BEST SELLER"
      ? "bg-red-500 text-white"
      : "bg-yellow-400 text-black";



      const handleWhatsAppClick = (e) => {
  e.stopPropagation();

  const phoneNumber = "971501902213";

  // Optional: dynamic message
  const message = `Hi, I'm interested in ${title}`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
};

  return (
    <div
      onClick={handleRedirect}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
    >
      {/* IMAGE */}
      {/* Mobile: h-32, Desktop: h-40 */}
      <div className="relative h-32 sm:h-40 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Ribbon */}
        <div className="absolute top-0 left-0 w-[66px] h-[66px] sm:w-[110px] sm:h-[110px] overflow-hidden pointer-events-none">
          <div
            className={`absolute top-[14px] -left-[26px] w-[80px] sm:top-5 sm:-left-[35px] sm:w-[140px] text-center text-[7px] sm:text-[9px] font-bold py-[3px] sm:py-0.5 -rotate-45 shadow-md tracking-wide ${ribbonColor}`}
          >
            {ribbon}
          </div>
        </div>

        {/* Heart */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white/20 backdrop-blur-sm text-white p-1 sm:p-1.5 rounded-full hover:bg-white hover:text-red-500 transition z-10"
        >
          <Heart size={12} className="sm:hidden" />
          <Heart size={14} className="hidden sm:block" />
        </button>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 sm:px-2 pb-1.5 sm:pb-2">
          <div className="flex items-center gap-0.5 sm:gap-1 text-white text-[10px] sm:text-[11px] font-bold">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
            {rating}
            <span className="font-normal opacity-80 hidden xs:inline sm:inline">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          {hasFreeCancellation && (
            <div className="bg-white/90 text-green-700 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-0.5 sm:gap-1 font-semibold">
              <Check size={8} className="sm:hidden" />
              <Check size={10} className="hidden sm:block" />
              <span className="hidden sm:inline">Free Cancel</span>
              <span className="sm:hidden">Free</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-2 pt-2 pb-2 sm:px-3 sm:pt-3 sm:pb-3 flex flex-col grow">

        {/* Title — 2 lines on mobile, 2 lines on desktop */}
        <h3 className="text-[11px] sm:text-[13.5px] font-extrabold text-slate-900 leading-snug line-clamp-2 mb-1.5 sm:mb-2">
          {title}
        </h3>

        {/* Duration & Location */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5">
            <Clock size={9} strokeWidth={2.5} className="sm:hidden" />
            <Clock size={11} strokeWidth={2.5} className="hidden sm:block" />
            {durationHours}H
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-0.5 truncate">
            <MapPin size={9} className="text-yellow-400 sm:hidden shrink-0" strokeWidth={2.5} />
            <MapPin size={11} className="text-yellow-400 hidden sm:block shrink-0" strokeWidth={2.5} />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Tags — hidden on mobile to save space, visible sm+ */}
        <div className="hidden sm:flex gap-1 flex-wrap mb-3">
          {tags.map((tag, i) => (
            <span key={i} className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Price + VIEW */}
        {/* <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 border-t border-gray-100">
          <div>
            <div className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">
              FROM
            </div>
            <div className="text-[15px] sm:text-[20px] font-black text-[#0047AB] leading-none">
              {price ? `$${price}` : "$45"}
            </div>
          </div>
          <div className="flex items-center gap-2">
     <button
  onClick={handleWhatsAppClick}
  className="bg-green-500 text-white text-[10px]  px-2 py-2 rounded-md flex items-center gap-1 hover:bg-green-600 transition"
>
   <Phone size={8} strokeWidth={5.5} />
  WhatsApp
</button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRedirect();
              }}
              className="bg-[#0f172a] text-white text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-black transition"
            >
              VIEW
             
            </button>
          </div>
        </div> */}

        {/* Footer: Price + VIEW */}
<div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 border-t border-gray-100 gap-1">

  {/* Price Section */}
  <div className="flex-shrink-0">
    <div className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">
      FROM
    </div>
    <div className="text-[13px] sm:text-[18px] md:text-[20px] font-black text-[#0047AB] leading-none">
      {price ? `$${price}` : "$45"}
    </div>
  </div>

  {/* Actions Section */}
  <div className="flex items-center gap-1 sm:gap-2">
    {/* WhatsApp Button */}
    <button
      onClick={handleWhatsAppClick}
      className="bg-green-500 text-white p-2 sm:px-2 sm:py-2 rounded-md flex items-center justify-center hover:bg-green-600 transition"
      title="WhatsApp"
    >
      <Phone size={10} strokeWidth={4} className="sm:w-3 sm:h-3" />
      {/* Mobile pe text hidden rakha hai, sirf tablet/desktop pe dikhega */}
      <span className="hidden md:inline ml-1 text-[10px] font-bold">WhatsApp</span>
    </button>

    {/* View Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRedirect();
      }}
      className="bg-[#0f172a] text-white text-[10px] sm:text-[11px] font-bold px-2 py-2 sm:px-3 rounded-md sm:rounded-lg flex items-center gap-1 hover:bg-black transition whitespace-nowrap"
    >
      VIEW
    </button>
  </div>
</div>
      </div>
    </div>
  );
};