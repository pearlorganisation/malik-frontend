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
  Ship,
  Waves,
  Plane,
  Utensils,
  Crown,
  Ticket,
  MapPin,
  Star,
  ArrowRight,
  Heart,
  Clock,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Info,
  Map as MapIcon,
  Tent,
  Tag
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// API Hooks
import { useGetPlaceByIdQuery } from "@/features/place/placeApi";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";

const getCategoryIcon = (name) => {
  if (!name) return LayoutGrid;
  const n = name.toLowerCase();
  if (n.includes('desert') || n.includes('safari')) return Sun;
  if (n.includes('city')) return Building2;
  if (n.includes('yacht') || n.includes('boat')) return Ship;
  if (n.includes('buggy') || n.includes('quad')) return CarFront;
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
  
  const [activeTab, setActiveTab] = useState("shoppingAndMalls");
  const [activeTourCategory, setActiveTourCategory] = useState("");
  const [itemsToLoad, setItemsToLoad] = useState(10);

  const spotsScrollRef = useRef(null);
  const activitiesScrollRef = useRef(null);
  
  const [canScrollSpotsLeft, setCanScrollSpotsLeft] = useState(false);
  const [canScrollSpotsRight, setCanScrollSpotsRight] = useState(true);

  const { data: placeData, isLoading: isPlaceLoading, isError } = useGetPlaceByIdQuery(id);
  const place = placeData?.data;

  const { data: categoryRes } = useGetCategoriesQuery({ limit: 50 });
  const categories = categoryRes?.data || [];
  
  const { data: activitiesRes, isFetching: isActivitiesLoading } = useGetActivitiesQuery({
    location: id,
    ...(activeTourCategory && { categoryId: activeTourCategory }),
    limit: itemsToLoad
  });
  const activities = activitiesRes?.data?.data || [];
  const pagination = activitiesRes?.data?.pagination;

  const TABS = [
    { id: "shoppingAndMalls", label: "Shopping & Malls", icon: ShoppingBag },
    { id: "beaches", label: "Beaches", icon: Umbrella },
    { id: "parksAndNature", label: "Parks & Nature", icon: TreePine },
    { id: "freeActivities", label: "Free Activities", icon: Gift },
    { id: "whereToStay", label: "Where to Stay", icon: Bed },
  ];

  const getCurrentSpots = () => {
    if (!place) return [];
    if (activeTab === "whereToStay") return place.whereToStay || [];
    return place.travelGuide?.[activeTab] || [];
  };

  const currentSpots = getCurrentSpots();

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
  }, [currentSpots, activeTab]);

  if (isPlaceLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (isError || !place) return <div className="text-center py-20 text-red-500 font-bold">Failed to load destination.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f172a]">
      {/* SECTION 1: HERO (SCREENSHOT 1 MATCH) */}
      <header className="bg-[#0f172a] text-white pt-24 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e293b] border border-[#334155] mb-6">
            <div className="w-4 h-4 rounded-full bg-[#fbbf24] flex items-center justify-center">
                <MapPin size={10} className="text-[#0f172a] fill-[#0f172a]" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-white/90">Travel Guide</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-3 tracking-tight">{place.name}</h1>
          <p className="text-lg text-gray-300 font-medium">{place.tagline || "The Capital of Culture"}</p>
        </div>
      </header>

      {/* SECTION 2: QUICK FACTS BAR (SCREENSHOT 1 MATCH) */}
      <div className="border-b border-gray-100 bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center gap-12">
          {[
            { label: "CLIMATE", val: place.quickFacts?.climate || "Desert", icon: Thermometer },
            { label: "BEST TIME", val: place.quickFacts?.bestTime || "Oct - Apr", icon: Calendar },
            { label: `FROM ${place.quickFacts?.nearBy?.name || "DUBAI"}`, val: place.quickFacts?.nearBy?.distance || "1.5 Hrs", icon: Navigation },
            { label: "SAFETY", val: place.quickFacts?.safety || "Very Safe", icon: ShieldCheck }
          ].map((fact, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f9ff] flex items-center justify-center text-[#3b82f6]">
                <fact.icon size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{fact.label}</p>
                <p className="text-sm font-bold text-[#0f172a]">{fact.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        
        {/* SECTION 3: ABOUT (SCREENSHOT 2 MATCH) */}
        <section className="grid lg:grid-cols-[1fr_420px] gap-16 items-start mb-24">
          <div>
            <h2 className="text-[28px] font-bold mb-6">About {place.name}</h2>
            <p className="text-[#64748b] leading-[1.8] text-base mb-10 max-w-3xl">
              {place.about || "Experience breathtaking views and incredible culture at this world-class destination."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {place.travelTips?.length > 0 ? place.travelTips.map((tip, idx) => (
                <div key={idx} className="bg-[#f8fafc] rounded-xl p-4 flex items-center gap-4 border border-gray-50">
                  <div className="text-[#94a3b8]"><Camera size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">{tip.category}</p>
                    <p className="text-[13px] font-bold text-[#1e293b] mt-0.5">{tip.tip}</p>
                  </div>
                </div>
              )) : (
                 <div className="bg-[#f8fafc] rounded-xl p-4 flex items-center gap-4 border border-gray-50">
                    <Info size={20} className="text-gray-400" />
                    <p className="text-xs font-bold text-gray-500">More tips coming soon.</p>
                 </div>
              )}
            </div>
          </div>

          {/* MAP BOX (SCREENSHOT 2 MATCH) */}
          <div className="bg-[#0f172a] rounded-2xl h-[300px] w-full relative overflow-hidden shadow-xl flex items-center justify-center group">
            <div className="absolute top-[40%] left-[25%] w-2.5 h-2.5 bg-[#fbbf24] rounded-full shadow-[0_0_15px_#fbbf24]"></div>
            <div className="absolute top-[60%] left-[15%] w-2.5 h-2.5 bg-[#fbbf24] rounded-full shadow-[0_0_15px_#fbbf24]"></div>
            <div className="absolute top-[70%] left-[45%] w-2.5 h-2.5 bg-[#fbbf24] rounded-full shadow-[0_0_15px_#fbbf24]"></div>
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                    <MapIcon size={28} className="text-white" />
                </div>
                <span className="bg-white/10 text-white text-[11px] px-5 py-2 rounded-full font-black border border-white/20 uppercase tracking-widest backdrop-blur-sm">
                  3 Key Landmarks
                </span>
            </div>
          </div>
        </section>

        {/* SECTION 4: MUST VISIT SPOTS (SCREENSHOT 2/3 MATCH) */}
        <section className="mb-24">
          <div className="mb-8">
            <span className="text-[11px] font-black tracking-[0.2em] text-[#fbbf24] uppercase">Travel Guide</span>
            <h2 className="text-3xl font-bold mt-2">Must Visit Spots</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg shadow-gray-200"
                      : "bg-white text-[#64748b] border-gray-100 hover:border-gray-200"
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
            className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 snap-x snap-mandatory"
          >
            {currentSpots.length > 0 ? currentSpots.map((spot, i) => (
              <div 
                key={i} 
                onClick={() => router.push(`/spot/${spot._id}`)}
                className="w-[300px] shrink-0 snap-start bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 bg-gray-100">
                  <img src={spot.image || "/placeholder.jpg"} alt={spot.title} className="w-full h-full object-cover"/>
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {activeTab === 'whereToStay' ? 'Luxury' : (spot.badge || 'Entertainment')}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[17px] font-bold mb-2">{spot.title || spot.name}</h3>
                  <p className="text-[13px] text-[#64748b] leading-relaxed line-clamp-2">
                    {spot.overview || spot.description}
                  </p>
                </div>
              </div>
            )) : (
              <div className="w-full text-center py-12 bg-[#f8fafc] rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No spots added in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: TOP RATED TOURS (SCREENSHOT 4 MATCH) */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="text-[11px] font-black tracking-[0.2em] text-[#2563eb] uppercase">Book Experiences</span>
            <h2 className="text-3xl font-bold mt-2">Top Rated Tours</h2>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-3 mb-10 pb-2">
            <button
              onClick={() => {setActiveTourCategory(""); setItemsToLoad(10)}}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold border transition-all ${
                activeTourCategory === "" ? "bg-[#2563eb] text-white border-[#2563eb]" : "bg-white text-[#64748b] border-gray-100"
              }`}
            >
              <LayoutGrid size={14} /> All Tours
            </button>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <button
                  key={cat._id}
                  onClick={() => {setActiveTourCategory(cat._id); setItemsToLoad(10)}}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold border whitespace-nowrap transition-all ${
                    activeTourCategory === cat._id ? "bg-[#2563eb] text-white border-[#2563eb]" : "bg-white text-[#64748b] border-gray-100"
                  }`}
                >
                  <Icon size={14} /> {cat.name}
                </button>
              );
            })}
          </div>

          {activities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((tour) => (
                <Link href={`/activity/${tour._id}`} key={tour._id}>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img src={tour.Images?.[0]?.secure_url || "/placeholder.jpg"} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-bold leading-tight mb-4 line-clamp-2">{tour.name}</h3>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">From</p>
                          <p className="text-[18px] font-black text-[#0f172a]">${tour.PrivateSUV?.fee || 45}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] py-20 text-center border-2 border-dashed border-gray-100">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-8 h-8 text-gray-200" />
               </div>
               <h3 className="text-xl font-bold text-[#0f172a] mb-2">No tours in this category yet.</h3>
               <p className="text-gray-400 text-sm mb-8">Try selecting 'All Tours' to see everything available in {place.name}.</p>
               <button 
                 onClick={() => setActiveTourCategory("")}
                 className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
               >
                 Clear Filters
               </button>
            </div>
          )}

          {pagination?.total > activities.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setItemsToLoad(prev => prev + 10)}
                disabled={isActivitiesLoading}
                className="px-10 py-4 bg-[#0f172a] text-white font-bold rounded-2xl hover:bg-black transition-all uppercase text-[10px] tracking-widest flex items-center gap-3 mx-auto"
              >
                {isActivitiesLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus size={16} />}
                Load More Experiences
              </button>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER SPACE */}
      <footer className="h-20 border-t border-gray-50 bg-[#f8fafc]"></footer>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar, .no-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar, .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
}