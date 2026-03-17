import React from "react";
import {
  Star,
  Clock,
  MapPin,
  Check,
  Heart,
  HelpCircle,
  ArrowRight,
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

  // const image =
  //   activity.images?.[0]?.url ||
  //   activity.images?.[0] ||
  //   "https://picsum.photos/400/300";
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
      : "bg-yellow-400 text-black";

  return (
   <div
  onClick={handleRedirect}
  className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
>

      {/* IMAGE */}
      <div className="relative h-[170px] sm:h-[180px] lg:h-[190px] overflow-hidden">
<Image
  src={image}
  alt={title}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
/>

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Ribbon */}
        <div className="absolute top-0 left-0 w-[120px] h-[120px] overflow-hidden pointer-events-none">

          <div
            className={`absolute top-[18px] left-[-38px] w-[150px] text-center text-[9px] font-bold py-1 rotate-[-45deg] shadow ${ribbonColor}`}
          >
            {ribbon}
          </div>

        </div>

        {/* Heart */}
        <button className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-white hover:text-red-500 transition">
          <Heart size={14} />
        </button>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {rating}
          <span className="opacity-80">({reviewCount})</span>
        </div>

        {/* Free cancel */}
        {hasFreeCancellation && (
          <div className="absolute bottom-2 right-2 bg-white/90 text-green-700 text-[10px] px-2 py-[2px] rounded flex items-center gap-1">
            <Check size={10} />
            Free Cancel
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 py-3 flex flex-col flex-grow">

        <h3 className="text-[14px] font-extrabold text-slate-900 leading-tight line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Duration & location */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-2">

          <div className="flex items-center gap-1">
            <Clock size={12} />
            {durationHours}h
          </div>

          <span>•</span>

          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-yellow-400" />
            {location}
          </div>

        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">

          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-[2px] rounded"
            >
              {tag}
            </span>
          ))}

        </div>

        {/* Footer */}
       <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">

  <div>
    <div className="text-[9px] text-gray-400 font-bold uppercase">
      FROM
    </div>

    <div className="text-[18px] font-black text-[#0047AB]">
      {price ? `$${price}` : "$45"}
    </div>
  </div>

  <div className="flex items-center gap-2">

    <button className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200 hover:bg-yellow-400 hover:text-black transition">
      <HelpCircle size={14} strokeWidth={2} />
    </button>

    {/* <button
        onClick={(e) => {
    e.stopPropagation();
    handleRedirect();
  }}
      className="bg-[#0f172a] text-white text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-black transition"
    >
      VIEW
      <ArrowRight size={14} />
    </button> */}

    <button
  onClick={(e) => e.stopPropagation()}
  className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-white hover:text-red-500 transition"
>
  <Heart size={14} />
</button>

  </div>

</div>
      </div>
    </div>
  );
};