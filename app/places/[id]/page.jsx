"use client";

import { useState, useEffect, useRef } from "react";
import {
  Thermometer,
  Calendar,
  Navigation,
  ShieldCheck,
  Camera,
  Coffee,
  CarFront,
  ShoppingBag,
  Umbrella,
  TreePine,
  Gift,
  Bed,
  LayoutGrid,
  Building2,
  Sun,
  Car,
  Ship,
  Waves,
  Plane,
  Utensils,
  Crown,
  Ticket,
  MapPin,
  Tag,
  Star,
  ArrowRight,
  Heart,
  Clock,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// API Hooks
import { useGetPlaceByIdQuery } from "@/features/place/placeApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";

// Helper for dynamic category icons
const getCategoryIcon = (name) => {
  if (!name) return LayoutGrid;
  const n = name.toLowerCase();
  if (n.includes('desert') || n.includes('safari')) return Sun;
  if (n.includes('city')) return Building2;
  if (n.includes('yacht') || n.includes('boat')) return Ship;
  if (n.includes('buggy') || n.includes('quad') || n.includes('ride')) return CarFront;
  if (n.includes('water')) return Waves;
  if (n.includes('ticket')) return Ticket;
  if (n.includes('sky')) return Plane;
  if (n.includes('park')) return TreePine;
  if (n.includes('photo')) return Camera;
  if (n.includes('food')) return Utensils;
  if (n.includes('vip')) return Crown;
  return LayoutGrid;
};

export default function PlaceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // State for tabs and filters
  const [activeTab, setActiveTab] = useState("shoppingAndMalls");
  const [activeTourCategory, setActiveTourCategory] = useState(""); // Default to empty string for "All"
  const [itemsToLoad, setItemsToLoad] = useState(10); // Start with 10 as per requirement

  // Scroll Refs and States
  const spotsScrollRef = useRef(null);
  const activitiesScrollRef = useRef(null);
  
  const [canScrollSpotsLeft, setCanScrollSpotsLeft] = useState(false);
  const [canScrollSpotsRight, setCanScrollSpotsRight] = useState(true);
  
  const [canScrollActLeft, setCanScrollActLeft] = useState(false);
  const [canScrollActRight, setCanScrollActRight] = useState(true);

  // 1. Fetch Place Details
  const { data: placeData, isLoading: isPlaceLoading, isError } = useGetPlaceByIdQuery(id);
  const place = placeData?.data;

  // 2. Fetch All Categories
  const { data: categoryRes } = useGetCategoriesQuery({ limit: 50 });
  const categories = categoryRes?.data || [];
  
  // 3. Fetch Activities with Dynamic Category and Limit
  const { data: activitiesRes, isFetching: isActivitiesLoading } = useGetActivitiesQuery({
    location: id,
    ...(activeTourCategory && { categoryId: activeTourCategory }),
    limit: itemsToLoad
  });
  console.log("activityes",activitiesRes)
  const activities = activitiesRes?.data?.data || [];
  const pagination = activitiesRes?.data?.pagination;

  // Handle Category Select Logic
  const handleCategorySelect = (catId) => {
    setActiveTourCategory(catId || "");
    setItemsToLoad(10); // Reset limit to 10 when category changes
  };

  // Tabs Configuration
  const TABS = [
    { id: "shoppingAndMalls", label: "Shopping & Malls", icon: ShoppingBag },
    { id: "beaches", label: "Beaches", icon: Umbrella },
    { id: "parksAndNature", label: "Parks & Nature", icon: TreePine },
    { id: "freeActivities", label: "Free Activities", icon: Gift },
    { id: "whereToStay", label: "Where to Stay", icon: Bed },
  ];

  // Current spots logic
  const currentSpots = place?.travelGuide?.[activeTab]?.length > 0 
    ? place.travelGuide[activeTab] 
    : (activeTab === 'shoppingAndMalls' ? [
        { title: "Yas Mall", overview: "The largest mall in Abu Dhabi.", badge: "ENTERTAINMENT", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2126&auto=format&fit=crop" },
        { title: "The Galleria", overview: "Luxury shopping and dining.", badge: "LUXURY", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" }
      ] : []);

  // Scroll Handler Logic
  const handleScrollUpdate = (ref, setLeft, setRight) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setLeft(scrollLeft > 0);
    setRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  const scrollContainer = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = ref.current.clientWidth * 0.8; 
    ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    handleScrollUpdate(spotsScrollRef, setCanScrollSpotsLeft, setCanScrollSpotsRight);
  }, [currentSpots]);

  useEffect(() => {
    handleScrollUpdate(activitiesScrollRef, setCanScrollActLeft, setCanScrollActRight);
  }, [activities]);

  if (isPlaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-600 font-bold">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Loading destination details...
        </div>
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">
        Failed to load place details.
      </div>
    );
  }

  const tips = place.travelTips?.length > 0 ? place.travelTips : [
    { icon: Camera, category: "PHOTOGRAPHY", tip: "Respect local privacy" },
    { icon: Coffee, category: "CULTURE", tip: "Arabic coffee (Gahwa) is a sign of welcome" },
    { icon: CarFront, category: "TRANSPORT", tip: "Taxis are affordable" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Dark Header */}
      <header className="bg-[#0f172a] text-white pt-20 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-bold tracking-wider text-gray-200 mb-4 border border-white/10">
            <span className="text-yellow-500 text-xs">⟟</span> TRAVEL GUIDE
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
            {place.name}
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            {place.tagline || "Discover amazing places and experiences."}
          </p>
        </div>
      </header>

      {/* Quick Facts Bar */}
      <div className="border-b border-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Thermometer size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Climate</p>
              <p className="text-xs font-semibold text-gray-900">{place.quickFacts?.climate || "Desert"}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-7 bg-gray-100"></div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Best Time</p>
              <p className="text-xs font-semibold text-gray-900">{place.quickFacts?.bestTime || "Oct - Apr"}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-7 bg-gray-100"></div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Navigation size={16} className="rotate-45" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                From {place.quickFacts?.nearBy?.name || "Dubai"}
              </p>
              <p className="text-xs font-semibold text-gray-900">
                {place.quickFacts?.nearBy?.distance || "1.5 Hrs"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        
        {/* About Section */}
        <section className="grid lg:grid-cols-[1fr_400px] gap-12 items-start mb-24">
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">
              About {place.name}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
              {place.about || `${place.name} offers breathtaking views, incredible culture, and amazing experiences for all kinds of travelers.`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((tip, idx) => {
                const Icon = tip.icon || Camera;
                return (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400"><Icon size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tip.category}</p>
                      <p className="text-xs font-semibold text-gray-800 mt-1">{tip.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl h-[280px] w-full relative overflow-hidden shadow-lg flex items-center justify-center">
            <div className="absolute top-[40%] left-[25%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <div className="flex flex-col items-center">
                <MapPin size={32} className="text-white mb-2" strokeWidth={1.5} />
                <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-white/10">
                  Key Landmarks
                </span>
            </div>
          </div>
        </section>

        {/* Must Visit Spots Section */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase">Travel Guide</span>
              <h2 className="text-3xl font-extrabold text-[#0f172a] mt-1">Must Visit Spots</h2>
            </div>
            
            {currentSpots.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => scrollContainer(spotsScrollRef, 'left')}
                  disabled={!canScrollSpotsLeft}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    canScrollSpotsLeft ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm' : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollContainer(spotsScrollRef, 'right')}
                  disabled={!canScrollSpotsRight}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    canScrollSpotsRight ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm' : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    isActive
                      ? "bg-[#0f172a] text-white border-[#0f172a]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-gray-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div 
            ref={spotsScrollRef}
            onScroll={() => handleScrollUpdate(spotsScrollRef, setCanScrollSpotsLeft, setCanScrollSpotsRight)}
            className="flex overflow-x-auto hide-scrollbar gap-5 pb-6 snap-x snap-mandatory"
          >
            {currentSpots.map((spot, i) => (
              <div 
                key={i} 
                onClick={() => router.push(`/spot/${spot._id}`)}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-[16px] border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer flex flex-col relative"
              >
                <div className="relative h-[220px] overflow-hidden bg-gray-100">
                  <img src={spot.image || "/placeholder.jpg"} alt={spot.title} className="w-full h-full object-cover"/>
                  <div className="absolute top-5 -left-9 bg-[#facc15] text-[#0f172a] font-extrabold text-[10px] uppercase py-1.5 px-10 transform -rotate-45 shadow-sm text-center z-10 w-40">
                    {spot.badge || "MUST SEE"}
                  </div>
                  <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white hover:text-red-500 transition text-white z-10">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold z-10">
                    <Star className="w-3.5 h-3.5 text-[#facc15] fill-[#facc15]" />
                    4.8 <span className="text-gray-300 font-normal ml-0.5">(1,200)</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-green-700 px-2 py-1 rounded-[4px] text-[10px] font-bold flex items-center gap-1 shadow-sm z-10">
                    <Check className="w-3 h-3" /> Free Cancel
                  </div>
                </div>
          {/* SCROLLABLE SPOTS CONTAINER */}
          {/* SCROLLABLE SPOTS CONTAINER */}
<div 
  ref={spotsScrollRef}
  onScroll={() => handleScrollUpdate(spotsScrollRef, setCanScrollSpotsLeft, setCanScrollSpotsRight)}
  className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 snap-x snap-mandatory"
>
  {currentSpots.map((spot, i) => (
    <div 
      key={i} 
      onClick={() => router.push(`/spot/${spot._id}`)}
      className="w-[300px] sm:w-[380px] shrink-0 snap-start bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-[200px] overflow-hidden">
        <img 
          src={spot.image || "/placeholder.jpg"} 
          alt={spot.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* TOP LEFT BADGE - White Pill Style */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black font-black text-[10px] tracking-widest uppercase py-1.5 px-4 rounded-md shadow-sm">
          {spot.badge || "VISIT"}
        </div>
      </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight mb-2 line-clamp-2">{spot.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase tracking-wide mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 2H</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full mx-0.5"></span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#facc15]" /> {place?.name || "DUBAI"}</span>
                  </div>
                  <p className="text-xs text-blue-600 bg-blue-50 px-2.5 py-2 rounded-lg font-medium mb-2 line-clamp-2 leading-relaxed">
                    {spot.overview}
                  </p>
                  <div className="flex-1"></div>
                  <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Free</span>
                        <div className="text-xl font-extrabold text-[#0052cc] leading-none">$0</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-6 h-6 text-gray-300" />
                      <button className="bg-[#0f172a] hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md">
                        VIEW <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {currentSpots.length === 0 && (
              <p className="w-full text-gray-500 py-8">No locations added to this category yet.</p>
            )}
          </div>
      {/* CONTENT AREA */}
      <div className="p-4 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {spot.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-medium">
          {spot.overview}
        </p>
      </div>
    </div>
  ))}
  
  {currentSpots.length === 0 && (
    <p className="w-full text-gray-400 py-12 text-center font-medium">No locations added to this category yet.</p>
  )}
</div>
        </section>

        {/* Top Rated Tours / Experiences Section (SYNCED WITH DROPDOWN LOGIC) */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Book Experiences</span>
              <h2 className="text-3xl font-extrabold text-[#0f172a] mt-1">Top Rated Tours</h2>
            </div>
            
            <div className="text-xs font-bold text-slate-400 border-l-0 md:border-l md:pl-6 border-slate-200">
               Found <span className="text-slate-900 font-black">
                {pagination?.total || activities.length}
              </span> verified results
            </div>
          </div>

          {/* DYNAMIC CATEGORY FILTERS */}
          <div className="flex overflow-x-auto no-scrollbar gap-2.5 mb-8 pb-2">
            <button
              onClick={() => handleCategorySelect("")}
              className={`flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeTourCategory === ""
                  ? "bg-[#0047AB] text-white shadow-lg shadow-blue-900/20 border-[#0047AB]"
                  : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid size={14} />
              All Experiences
            </button>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              const isActive = activeTourCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat._id)}
                  className={`flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-lg shadow-blue-900/20 border-[#0047AB]"
                      : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={14} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* SCROLLABLE ACTIVITIES CONTAINER */}
          {activities.length > 0 ? (
            <>
              <div 
                ref={activitiesScrollRef}
                onScroll={() => handleScrollUpdate(activitiesScrollRef, setCanScrollActLeft, setCanScrollActRight)}
                className="flex overflow-x-auto hide-scrollbar gap-5 pb-6 snap-x snap-mandatory"
              >
                {activities.map((tour) => {
                  const image = tour?.Images?.[0]?.secure_url || "/placeholder.jpg";
                  const price = tour?.PrivateSUV?.fee || 45;
                  
                  return (
                    <div key={tour._id} className="w-[280px] sm:w-[320px] shrink-0 snap-start h-full">
                      <Link href={`/activity/${tour._id}`}>
                        <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full relative">
                          <div className="relative h-[200px] overflow-hidden bg-gray-100">
                            <img src={image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-5 -left-9 bg-[#facc15] text-[#0f172a] font-extrabold text-[10px] uppercase py-1.5 px-10 transform -rotate-45 shadow-sm text-center z-10 w-40">
                               POPULAR
                            </div>
                            <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white hover:text-red-500 transition text-white z-10">
                              <Heart className="w-4 h-4" />
                            </button>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold z-10">
                              <Star className="w-3.5 h-3.5 text-[#facc15] fill-[#facc15]" />
                              4.8 <span className="text-gray-300 font-normal ml-0.5">(1,200)</span>
                            </div>
                            <div className="absolute bottom-3 right-3 bg-white/95 text-green-700 px-2 py-1 rounded-[4px] text-[10px] font-bold flex items-center gap-1 shadow-sm z-10">
                              <Check className="w-3 h-3" /> Free Cancel
                            </div>
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-sm font-extrabold text-gray-900 leading-tight mb-2 line-clamp-2">{tour.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-3">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6H</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full mx-0.5"></span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#facc15]" /> {place?.name || "DUBAI"}</span>
                            </div>
                            <div className="flex-1"></div>
                            <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                              <div>
                                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">From</span>
                                <div className="text-xl font-extrabold text-[#0052cc] leading-none">${price}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-gray-300" />
                                <button className="bg-[#0f172a] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md">
                                  VIEW <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button (+10 items logic) */}
              {pagination?.total > activities.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setItemsToLoad((prev) => prev + 10)}
                    disabled={isActivitiesLoading}
                    className="group px-10 py-3.5 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-2.5 mx-auto uppercase text-[11px] tracking-widest disabled:opacity-70"
                  >
                    {isActivitiesLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {isActivitiesLoading ? "Loading..." : "Load More Experiences"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#f9fafb] rounded-[2rem] py-16 px-6 text-center border border-dashed border-gray-200">
               <Tag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-black text-slate-900 mb-2">No matching adventures found</h3>
               <p className="text-gray-500 text-sm mb-6 font-medium">Try selecting "All Experiences" or clearing filters.</p>
               <button 
                 onClick={() => handleCategorySelect("")}
                 className="text-[#0047AB] font-bold text-sm hover:underline"
               >
                 View all tours
               </button>
            </div>
          )}
        </section>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar, .no-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar, .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}