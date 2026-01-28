"use client"
import React, { Suspense, useState, useEffect } from "react";
import {
  Star, Heart, Clock, MapPin, Search, LayoutGrid, Building2, Palmtree,
  Anchor, ArrowRight, Car, Waves, Ticket, MessageCircle, Check, Flame, Map, Menu, X
} from "lucide-react";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";

/* --- MOCK API HOOKS --- */
// In real project, use actual imports
// const useGetCategoriesQuery = (params) => {
//   return {
//     data: {
//       data: [
//         { _id: '1', name: 'Desert Safari' },
//         { _id: '2', name: 'City Tours' },
//         { _id: '3', name: 'Yacht Rental' },
//         { _id: '4', name: 'Dune Buggy' },
//         { _id: '5', name: 'Attraction Tickets' },
//         { _id: '6', name: 'Water Parks' },
//       ]
//     }
//   };
// };

// const useGetAllPlacesQuery = () => {
//   return {
//     data: {
//       data: [
//         { _id: 'loc1', name: 'Dubai' },
//         { _id: 'loc2', name: 'Abu Dhabi' },
//         { _id: 'loc3', name: 'Sharjah' },
//         { _id: 'loc4', name: 'Ras Al Khaimah' },
//         { _id: 'loc5', name: 'Fujairah' },
//       ]
//     }
//   };
// };

const useGetActivitiesQuery = (params) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [params.categories, params.location]); // Reload on filter change

  // Mock data filtering for demo purposes
  const allActivities = [
    {
      _id: '101',
      title: 'Premium Desert Safari with BBQ Dinner',
      category: 'Desert Safari',
      location: 'Dubai, Lahbab',
      duration: { hours: 6 },
      rating: 4.9,
      reviewCount: 1240,
      price: 45,
      image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800',
      badge: 'BESTSELLER'
    },
    {
      _id: '102',
      title: 'Private Luxury Yacht Cruise',
      category: 'Yacht Rental',
      location: 'Dubai Marina',
      duration: { hours: 2 },
      rating: 4.8,
      reviewCount: 85,
      price: 250,
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800',
      badge: 'LUXURY'
    },
    {
      _id: '103',
      title: 'Burj Khalifa At The Top Tickets',
      category: 'Attraction Tickets',
      location: 'Downtown Dubai',
      duration: { hours: 2 },
      rating: 4.7,
      reviewCount: 3200,
      price: 45,
      image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800',
      badge: 'MUST VISIT'
    },
    {
      _id: '104',
      title: 'Abu Dhabi City Tour & Mosque',
      category: 'City Tours',
      location: 'Abu Dhabi',
      duration: { hours: 8 },
      rating: 4.8,
      reviewCount: 430,
      price: 85,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea904f4480f?auto=format&fit=crop&q=80&w=800',
      badge: null
    },
    {
      _id: '105',
      title: 'Morning Dune Buggy Adventure',
      category: 'Dune Buggy',
      location: 'Dubai Desert',
      duration: { hours: 3 },
      rating: 4.9,
      reviewCount: 150,
      price: 120,
      image: 'https://images.unsplash.com/photo-1539035104074-dee66086b5e3?auto=format&fit=crop&q=80&w=800',
      badge: 'ADVENTURE'
    },
    {
      _id: '106',
      title: 'Aquaventure Waterpark Day Pass',
      category: 'Water Parks',
      location: 'Palm Jumeirah',
      duration: { hours: 8 },
      rating: 4.6,
      reviewCount: 890,
      price: 95,
      image: 'https://images.unsplash.com/photo-1536691666498-8547b3127393?auto=format&fit=crop&q=80&w=800',
      badge: 'FAMILY FUN'
    }
  ];

  // Client-side filter simulation since we don't have a real backend
  let filtered = allActivities;
  if (params.categories) {
    filtered = filtered.filter(a => a.category === params.categories);
  }
  if (params.location) {
    filtered = filtered.filter(a => a.location.toLowerCase().includes(params.location.toLowerCase()));
  }

  return {
    data: {
      activities: filtered,
      total: filtered.length
    },
    isLoading,
    error: null
  };
};

/* =========================
   COMPONENTS
========================= */

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
  </div>
);

// Helper for category icons
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('desert')) return Palmtree;
  if (n.includes('city')) return Building2;
  if (n.includes('yacht') || n.includes('boat')) return Anchor;
  if (n.includes('buggy') || n.includes('quad')) return Car;
  if (n.includes('water')) return Waves;
  if (n.includes('ticket')) return Ticket;
  return LayoutGrid;
};

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ActivitiesContent />
    </Suspense>
  );
}

function ActivitiesContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // 'null' means all
  const [activeLocation, setActiveLocation] = useState(null); // 'null' means all
  const [visibleCount, setVisibleCount] = useState(12);

  // Queries
  const { data: categoryResponse } = useGetCategoriesQuery({ page: 1, limit: 50 });
  const { data: placesResponse } = useGetAllPlacesQuery();
  
  const categories = categoryResponse?.data || [];
  const locations = placesResponse?.data || [];

  const { data, isLoading, error } = useGetActivitiesQuery({
    page: 1,
    limit: 20,
    categories: activeCategory, 
    location: activeLocation,
  });

  const activities = data?.activities || [];

  // Filter by search term on client side for this demo
  const filteredActivities = activities.filter(t => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q);
  });

  const Sidebar = () => (
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <LayoutGrid className="w-3 h-3" /> Categories
        </h4>
        <div className="space-y-1">
          <button 
            onClick={() => setActiveCategory(null)} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${!activeCategory ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${!activeCategory ? 'bg-white/10' : 'bg-slate-100'}`}>
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">All Categories</span>
            </div>
            {!activeCategory && <Check className="w-4 h-4 text-orange-500" />}
          </button>
          
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const isActive = activeCategory === cat.name;
            return (
              <button 
                key={cat._id} 
                onClick={() => setActiveCategory(cat.name)} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{cat.name}</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-orange-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <MapPin className="w-3 h-3" /> Locations
        </h4>
        <div className="space-y-1">
          <button 
            onClick={() => setActiveLocation(null)} 
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${!activeLocation ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All Locations
          </button>
          {locations.map((loc) => (
            <button 
              key={loc._id} 
              onClick={() => setActiveLocation(loc.name)} 
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLocation === loc.name ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp Widget */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
        <MessageCircle className="absolute top-[-20px] right-[-20px] w-32 h-32 text-white opacity-10" />
        <h4 className="text-xl font-black mb-3">Custom Trip?</h4>
        <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">Expert planning via WhatsApp.</p>
        <a 
          href="https://wa.me/971501902213" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50/50 min-h-screen py-4 md:py-16 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider mb-4 border border-blue-100">
              <Flame className="w-3 h-3 text-orange-500" /> Handpicked Adventures
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Browse <span className="text-blue-600">Experiences</span>
            </h2>
          </div>
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all shadow-sm outline-none" 
              placeholder="Search experiences..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* MOBILE TOP SCROLLER FILTERS */}
        <div className="lg:hidden mb-10 -mx-4 px-4 space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setActiveCategory(null)} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${!activeCategory ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-white'}`}
            >
              <LayoutGrid className="w-4 h-4" /> All
            </button>
            {categories.map(cat => {
               const Icon = getCategoryIcon(cat.name);
               return (
                <button 
                  key={cat._id} 
                  onClick={() => setActiveCategory(cat.name)} 
                  className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${activeCategory === cat.name ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-white'}`}
                >
                  <Icon className="w-4 h-4" /> {cat.name}
                </button>
               );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setActiveLocation(null)} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${!activeLocation ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-white'}`}
            >
              <Map className="w-4 h-4" /> All Locations
            </button>
            {locations.map(loc => (
              <button 
                key={loc._id} 
                onClick={() => setActiveLocation(loc.name)} 
                className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm ${activeLocation === loc.name ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-white'}`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <Sidebar />
          </aside>
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            {isLoading ? (
               <LoadingSpinner />
            ) : filteredActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
                  {filteredActivities.slice(0, visibleCount).map((tour) => (
                    <div key={tour._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full">
                      
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
                        <img 
                          src={tour.image} 
                          alt={tour.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        {tour.badge && (
                          <span className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">
                            {tour.badge}
                          </span>
                        )}
                        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all active:scale-90 shadow-lg">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {tour.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-bold text-slate-900">{tour.rating}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-base font-black text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {tour.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange-500" /> 
                              {tour.location.split(',')[0]}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> 
                              {tour.duration?.hours}h
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">From</span>
                            <div className="text-xl font-black text-slate-900">${tour.price}</div>
                          </div>
                          <button className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-950/20">
                            <ArrowRight className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleCount < filteredActivities.length && (
                   <div className="mt-16 text-center">
                     <button 
                        onClick={() => setVisibleCount(v => v + 6)} 
                        className="px-12 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-xl active:scale-95"
                      >
                        Load More Tours
                      </button>
                   </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900">No matching adventures found</h3>
                <p className="text-slate-400 mt-2">Try adjusting your search or resetting filters.</p>
                <button 
                  onClick={() => {setActiveCategory(null); setActiveLocation(null); setSearchTerm('');}}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}