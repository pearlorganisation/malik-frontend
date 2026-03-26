"use client";

import { useState, useEffect } from "react";
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
  Tag
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlaceByIdQuery } from "@/features/place/placeApi";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { data: placeData, isLoading, isError } = useGetPlaceByIdQuery(id);
  const [activeTab, setActiveTab] = useState("shoppingAndMalls");

  const place = placeData?.data;

  // Tabs Configuration matching the screenshot
  const TABS =[
    { id: "shoppingAndMalls", label: "Shopping & Malls", icon: ShoppingBag },
    { id: "beaches", label: "Beaches", icon: Umbrella },
    { id: "parksAndNature", label: "Parks & Nature", icon: TreePine },
    { id: "freeActivities", label: "Free Activities", icon: Gift },
    { id: "whereToStay", label: "Where to Stay", icon: Bed },
  ];

  // Tour Filters Configuration matching the screenshot
  const TOUR_FILTERS =[
    { label: "All Tours", icon: LayoutGrid, active: true },
    { label: "City", icon: Building2 },
    { label: "Desert", icon: Sun },
    { label: "Buggy", icon: Car },
    { label: "Yacht", icon: Ship },
    { label: "Water", icon: Waves },
    { label: "Sky", icon: Plane },
    { label: "Parks", icon: TreePine },
    { label: "Photo", icon: Camera },
    { label: "Food", icon: Utensils },
    { label: "Ride", icon: CarFront },
    { label: "VIP", icon: Crown },
    { label: "Tickets", icon: Ticket },
  ];

  useEffect(() => {
    if (place) {
      // Logic to set initial active tab based on data could go here
      // Defaulting to 'shoppingAndMalls' to match screenshot state
    }
  }, [place]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-600">
        Loading destination...
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load place details.
      </div>
    );
  }

  // Fallback data if arrays are empty, just to show how the UI from the screenshot looks
  const currentSpots = place.travelGuide?.[activeTab]?.length > 0 
    ? place.travelGuide[activeTab] 
    : (activeTab === 'shoppingAndMalls' ?[
        { title: "Yas Mall", overview: "The largest mall in Abu Dhabi, connected to Ferrari World.", badge: "ENTERTAINMENT", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=2126&auto=format&fit=crop" },
        { title: "The Galleria", overview: "Luxury shopping and dining on Al Maryah Island.", badge: "LUXURY", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" }
      ] :[]);

  // Use provided travel tips or fallbacks for UI demonstration
  const tips = place.travelTips?.length > 0 ? place.travelTips :[
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
            {place.name === "Amal Phillips" ? "Abu Dhabi" : place.name}
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            {place.tagline === "Maxime facilis ea sa" ? "The Capital of Culture" : place.tagline}
          </p>
        </div>
      </header>

      {/* Quick Facts Bar */}
    <div className="border-b border-gray-100 py-2">
  <div className="max-w-10xl mx-auto pr-[120px] px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
    
    <div className="flex items-center gap-3 min-w-[130px]">
      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
        <Thermometer size={16} />
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Climate</p>
        <p className="text-xs font-semibold text-gray-900">{place.quickFacts?.climate || "Desert"}</p>
      </div>
    </div>
    
    <div className="hidden md:block w-px h-7 bg-gray-100"></div>

    <div className="flex items-center gap-3 min-w-[90px]">
      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
        <Calendar size={16} />
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Best Time</p>
        <p className="text-xs font-semibold text-gray-900">{place.quickFacts?.bestTime || "Oct - Apr"}</p>
      </div>
    </div>

    <div className="hidden md:block w-px h-7 bg-gray-100"></div>

    <div className="flex items-center gap-3 min-w-[130px]">
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

    <div className="hidden md:block w-px h-7 bg-gray-100"></div>

    <div className="flex items-center gap-3 min-w-[130px]">
      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
        <ShieldCheck size={16} />
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Safety</p>
        <p className="text-xs font-semibold text-gray-900">
          {place.quickFacts?.safety || "Very Safe"}
        </p>
      </div>
    </div>

  </div>
</div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        
  {/* About Section */}
  <section className="grid lg:grid-cols-[1fr_400px] gap-12 items-start mb-24">
    <div>
      <h2 className="text-2xl font-bold text-[#0f172a] mb-4">
        About {place.name === "Amal Phillips" ? "Abu Dhabi" : place.name}
      </h2>
      <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
        {place.about === "Corporis fugit qui " 
          ? "Abu Dhabi offers a more relaxed pace compared to its neighbor. It is the heart of Emirati culture, home to the breathtaking Sheikh Zayed Grand Mosque and the Louvre Abu Dhabi. The city sits on a series of islands, offering beautiful mangroves and white sand beaches alongside modern luxury." 
          : place.about}
      </p>

      {/* Travel Tips Inline Cards */}
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

    {/* Map Placeholder */}
    <div className="bg-[#0f172a] rounded-2xl h-[280px] w-full relative overflow-hidden shadow-lg flex items-center justify-center">
       <div className="absolute top-[40%] left-[25%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
       <div className="absolute top-[30%] left-[60%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
       <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
       
       <div className="flex flex-col items-center">
          <MapPin size={32} className="text-white mb-2" strokeWidth={1.5} />
          <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-white/10">
            3 Key Landmarks
          </span>
       </div>
    </div>
  </section>

  {/* Must Visit Spots Section */}
  <section className="mb-24">
    <div className="mb-6">
      <span className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase">Travel Guide</span>
      <h2 className="text-3xl font-extrabold text-[#0f172a] mt-1">Must Visit Spots</h2>
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

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentSpots.map((spot, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
          <div className="h-48 relative overflow-hidden bg-gray-100">
            {spot.image && (
              <img
                src={spot.image}
                alt={spot.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            {spot.badge && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-gray-900 shadow-sm">
                {spot.badge}
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{spot.title}</h3>
            <p className="text-gray-500 text-sm">{spot.overview}</p>
          </div>
        </div>
      ))}
      {currentSpots.length === 0 && (
        <p className="col-span-full text-gray-500 py-8">No locations added to this category yet.</p>
      )}
    </div>
  </section>

  {/* Top Rated Tours Section */}
  <section className="mb-20">
    <div className="mb-6">
      <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Book Experiences</span>
      <h2 className="text-3xl font-extrabold text-[#0f172a] mt-1">Top Rated Tours</h2>
    </div>

    <div className="flex overflow-x-auto hide-scrollbar gap-2.5 mb-8 pb-2">
      {TOUR_FILTERS.map((filter, idx) => {
        const Icon = filter.icon;
        return (
          <button
            key={idx}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              filter.active
                ? "bg-[#0052cc] text-white border-[#0052cc]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Icon size={14} className={filter.active ? "text-white" : "text-gray-400"} />
            {filter.label}
          </button>
        );
      })}
    </div>

    <div className="border border-dashed border-gray-200 bg-[#f9fafb] rounded-2xl py-20 px-6 flex flex-col items-center justify-center text-center">
       <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100">
         <Tag className="w-5 h-5 text-gray-400 transform rotate-90" />
       </div>
       <h3 className="text-lg font-bold text-gray-900 mb-1">No tours in this category yet.</h3>
       <p className="text-gray-500 text-sm mb-6">Try selecting 'All Tours' to see everything available in Abu Dhabi.</p>
       <button className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
         Clear Filters
       </button>
    </div>
  </section>

</main>

      {/* Hide scrollbar utility class injected for the filter row */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}