"use client"
import React, { Suspense, useState, useEffect } from "react";
import {
  Star, Heart, Clock, MapPin, Search, LayoutGrid, Building2, Palmtree,
  Anchor, ArrowRight, Car, Waves, Ticket, MessageCircle, Check, Flame, Map, Menu, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetAllPlacesQuery } from "@/features/place/placeApi";
import { useGetActivitiesQuery } from "@/features/activity/activityApi";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null); // 'null' means all
  const [activeLocation, setActiveLocation] = useState(null); // 'null' means all
  const [visibleCount, setVisibleCount] = useState(12);
  const [visibleCategories, setVisibleCategories] = useState(6);
const [visibleLocations, setVisibleLocations] = useState(6);

  // Queries
  const { data: categoryResponse } = useGetCategoriesQuery({ page: 1, limit: 50 });
  const { data: placesResponse } = useGetAllPlacesQuery();
  
  const categories = categoryResponse?.data || [];
  const locations = placesResponse?.data || [];
  useEffect(() => {
  setVisibleCount(12);
}, [activeCategory, activeLocation]);
useEffect(() => {
  setVisibleCategories(6);
}, [categories]);

useEffect(() => {
  setVisibleLocations(6);
}, [locations]);
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [activeCategory, activeLocation]);

useEffect(() => {
  const categoryFromUrl = searchParams.get("category");
  const locationFromUrl = searchParams.get("location");

  if (categoryFromUrl) {
    setActiveCategory(categoryFromUrl);
    setActiveLocation(null);
  } else if (locationFromUrl) {
    setActiveLocation(locationFromUrl);
    setActiveCategory(null);
  }
}, [searchParams]);

  // const { data, isLoading, error } = useGetActivitiesQuery({
  //   page: 1,
  //   limit: 20,
  //   categories: activeCategory, 
  //   location: activeLocation,
  // });
//   const { data, isLoading, error } = useGetActivitiesQuery({
//   page: 1,
//   limit: 20,
//   categoryId: activeCategory,
//   location: activeLocation,
// });
const { data,isLoading } = useGetActivitiesQuery({
  page: 1,
  limit: 20,
  ...(activeCategory && { categoryId: activeCategory }),
  ...(activeLocation && { location: activeLocation }),
});

const activities = data?.data?.data || [];

  // Filter by search term on client side for this demo
  const filteredActivities = activities.filter(t => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    // return t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q);
    return (
  t?.name?.toLowerCase().includes(q) ||
  t?.place?.name?.toLowerCase().includes(q)
);
  });

  console.log("filteredActivities",filteredActivities)

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
          
          {/* {categories.map((cat) => { */}
          {categories.slice(0, visibleCategories).map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            // const isActive = activeCategory === cat.name;
            const isActive = activeCategory === cat._id;
            return (
              <button 
                key={cat._id} 
                // onClick={() => setActiveCategory(cat.name)} 
                onClick={() => {
                  setActiveCategory(cat._id);
                  setActiveLocation(null);
                  router.push(`/activity?category=${cat._id}`);
                }
                }
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
  {categories.length > 6 && (
  <button
    onClick={() =>
      visibleCategories >= categories.length
        ? setVisibleCategories(6)
        : setVisibleCategories(prev => prev + 6)
    }
    className="w-full mt-3 py-2 text-xs font-bold text-blue-600 hover:underline"
  >
    {visibleCategories >= categories.length ? "Show Less" : "Load More Categories"}
  </button>
)}
      </div>

      {/* Locations */}
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <MapPin className="w-3 h-3" /> Locations
        </h4>
        <div className="space-y-1">
          <button 
            onClick={() =>{setActiveLocation(null)
              setActiveCategory(null);
  router.push(`/activity`);
            }
            } 
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${!activeLocation ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All Locations
          </button>
          {/* {locations.map((loc) => (
            <button 
              key={loc._id} 
              onClick={() => setActiveLocation(loc._id)} 
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLocation === loc._id ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {loc.name}
            </button>
          ))} */}
          {/* {locations.map((loc) => ( */}
          {locations.slice(0, visibleLocations).map((loc) => (
  <button 
    key={loc._id} 
    onClick={() => {
      setActiveLocation(loc._id);
      setActiveCategory(null);
       router.push(`/activity?location=${loc._id}`);
    }
    } 
    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
      activeLocation === loc._id
        ? 'bg-orange-50 text-orange-500 border border-orange-100'
        : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {loc.name}
  </button>
))}
        </div>
    {locations.length > 6 && (
  <button
    onClick={() =>
      visibleLocations >= locations.length
        ? setVisibleLocations(6)
        : setVisibleLocations(prev => prev + 6)
    }
    className="w-full mt-3 py-2 text-xs font-bold text-blue-600 hover:underline"
  >
    {visibleLocations >= locations.length ? "Show Less" : "Load More Locations"}
  </button>
)}
      </div>

      {/* WhatsApp Widget */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
        <MessageCircle className="absolute -top-5 -right-5 w-32 h-32 text-white opacity-10" />
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
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider mb-4 border border-blue-100">
              <Flame className="w-3 h-3 text-orange-500" /> Handpicked Adventures1
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
              onClick={() => {setActiveCategory(null);
                 setActiveLocation(null);
  router.push(`/activity`);
              }} 
              className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${!activeCategory ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-white'}`}
            >
              <LayoutGrid className="w-4 h-4" /> All
            </button>
            {categories.map(cat => {
               const Icon = getCategoryIcon(cat.name);
               return (
                <button 
                  key={cat._id} 
                  // onClick={() => setActiveCategory(cat.name)} 
                  onClick={() => {
                    setActiveCategory(cat._id)
                    setActiveLocation(null);
                      router.push(`/activity?category=${cat._id}`);
                  }
                  }
                  className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${activeCategory === cat._id ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-500 border-white'}`}
                >
                  <Icon className="w-4 h-4" /> {cat.name}
                </button>
               );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              // onClick={() => setActiveLocation(null)} 
              onClick={() => {
  setActiveLocation(null);
  setActiveCategory(null);
  router.push(`/activity`);
}}
              className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm flex items-center gap-2 ${!activeLocation ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-white'}`}
            >
              <Map className="w-4 h-4" /> All Locations
            </button>
            {locations.map(loc => (
              <button 
                key={loc._id} 
                onClick={() =>{setActiveLocation(loc._id)
                  setActiveCategory(null);
                   router.push(`/activity?location=${loc._id}`);
                }
                } 
                className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all shadow-sm ${activeLocation === loc._id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-white'}`}
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
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
  {filteredActivities.slice(0, visibleCount).map((tour) => {

    const image = tour?.Images?.[0]?.secure_url || "/placeholder.jpg";
    const title = tour?.name;
    const subtitle = tour?.Experience?.title;
    const location = tour?.place?.name || "Dubai";
    const price = tour?.PrivateSUV?.fee || 45;

    return (
      <Link key={tour._id} href={`/activity/${tour._id}`}>

        <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">

          {/* IMAGE */}
          <div className="relative aspect-4/3 overflow-hidden">

            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

            {/* heart */}
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white hover:text-red-500 transition">
              <Heart className="w-4 h-4" />
            </button>

            {/* category badge */}
            <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow">
              Adventure
            </span>

          </div>

          {/* CONTENT */}
          <div className="p-6 flex flex-col justify-between flex-1">

            <div>

              {/* TITLE */}
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                {title}
              </h3>

              {/* subtitle */}
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {subtitle}
              </p>

              {/* meta */}
              <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase">

                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {location}
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  4h
                </div>

              </div>

            </div>

            {/* PRICE + CTA */}
            <div className="pt-5 mt-5 border-t flex items-center justify-between">

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                  From
                </span>

                <div className="text-xl font-black text-slate-900">
                  ${price}
                </div>
              </div>

              <button className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95">
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

          </div>

        </div>

      </Link>
    );
  })}
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