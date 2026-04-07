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

  const handleRedirect = () => {
    router.push(`/activity/${activity._id}`);
  };

  /* Ribbon logic */
  const ribbons = ["POPULAR", "BEST SELLER", "THRILL", "MUST SEE"];
  const ribbon = ribbons[title.length % ribbons.length];

  const ribbonColor =
    ribbon === "BEST SELLER"
      ? "bg-red-500 text-white"
      : ribbon === "POPULAR"
      ? "bg-yellow-400 text-black"
      : ribbon === "THRILL"
      ? "bg-yellow-400 text-black"
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
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Ribbon */}
        <div className="absolute top-0 left-0 w-27.5 h-27.5 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-5 -left-8.75 w-35 text-center text-[9px] font-bold py-0.75 -rotate-45 shadow-md tracking-wide ${ribbonColor}`}
          >
            {ribbon}
          </div>
        </div>

        {/* Heart */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-white hover:text-red-500 transition z-10"
        >
          <Heart size={14} />
        </button>

        {/* Bottom bar: rating left, free cancel right */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1 text-white text-[11px] font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {rating}
            <span className="font-normal opacity-80">({reviewCount.toLocaleString()})</span>
          </div>

          {hasFreeCancellation && (
            <div className="bg-white/90 text-green-700 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
              <Check size={10} />
              Free Cancel
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-3 pt-3 pb-3 flex flex-col grow">

        {/* Title */}
        <h3 className="text-[13.5px] font-extrabold text-slate-900 leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Duration & Location */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase mb-2">
          <div className="flex items-center gap-0.75">
            <Clock size={11} strokeWidth={2.5} />
            {durationHours}H
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-0.75">
            <MapPin size={11} className="text-yellow-400" strokeWidth={2.5} />
            {location}
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Price left | ? + VIEW right */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">

          {/* Price */}
          <div>
            <div className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">
              FROM
            </div>
            <div className="text-[20px] font-black text-[#0047AB] leading-none">
              {price ? `$${price}` : "$45"}
            </div>
          </div>

          {/* Actions */}
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
              {/* <ArrowRight size={13} strokeWidth={2.5} /> */}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};