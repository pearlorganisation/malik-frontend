'use client';

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, MapPin, Star, Clock, 
  Ticket, Navigation, Train, Car, Info, 
  Waves, ShoppingBag, Camera, Calendar, Hotel, ArrowRight
} from 'lucide-react';
import { useGetSpotByIdQuery } from "@/features/spot/spotApi";

const SpotDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const { data: response, isLoading, error } = useGetSpotByIdQuery(id);
  const spot = response?.data;

  if (isLoading) return <div className="flex justify-center items-center h-screen text-xs font-bold text-slate-400">Loading...</div>;
  if (error || !spot) return <div className="text-center mt-20 text-red-500 text-sm font-bold">Spot not found.</div>;

  const getThingIcon = (index) => {
    const icons = [<Waves key="w" size={16} />, <ShoppingBag key="s" size={16} />, <Camera key="c" size={16} />, <Calendar key="ca" size={16} />];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <header className="relative h-[360px] w-full">
        <Image src={spot.image} alt={spot.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
        
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end max-w-6xl mx-auto w-full">
          <button 
            onClick={() => router.back()}
            className="absolute top-6 left-6 flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <div className="space-y-1.5">
            <span className="inline-block bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
              {spot.category?.name || "EXPLORE"}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{spot.title}</h1>
            <div className="flex items-center gap-5 text-white/90">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-400" />
                <span className="font-bold text-xs">{spot.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-xs">{spot.avgRating || "4.8"} <span className="text-white/50 font-medium ml-0.5 text-[10px]">({spot.totalReviews || "0"})</span></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-lg font-black mb-3">Overview</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{spot.overview}</p>
          </section>

          <section>
            <h2 className="text-lg font-black mb-5">Things to Do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spot.thingsToDo?.map((item, idx) => (
                <div key={item._id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">{getThingIcon(idx)}</div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 mb-0.5">{item.title}</h3>
                    <p className="text-slate-400 text-[11px] leading-snug font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black mb-5 relative inline-block">
              <span className="relative z-10">How to Get There</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-slate-200 -z-0"></span>
            </h2>
            <div className="space-y-3">
              {spot.howToGetThere?.map((item, idx) => (
                <div key={item._id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-red-50 text-red-500' : idx === 1 ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {idx === 0 ? <Train size={18} /> : idx === 1 ? <Car size={18} /> : <Info size={18} />}
                  </div>
                  <div>
                    <h3 className="font-black text-[9px] uppercase tracking-wider text-slate-300 mb-0.5">BY {item.mode}</h3>
                    <p className="text-slate-600 text-xs font-bold leading-tight">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 self-start">
          
          <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 p-7 border border-slate-50">
            <h2 className="text-base font-black mb-8 text-slate-800">Visitor Info</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Clock size={18} className="text-slate-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">OPENING HOURS</h4>
                  <p className="font-bold text-xs text-slate-800">{spot.visitorInfo?.openingHours}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Ticket size={18} className="text-slate-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">ENTRY FEE</h4>
                  <p className="font-bold text-xs text-slate-800">{spot.visitorInfo?.entryFee}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin size={18} className="text-slate-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">ADDRESS</h4>
                  <p className="font-bold text-xs text-slate-800 leading-tight">{spot.visitorInfo?.address}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.open(spot.visitorInfo?.directionsLink, '_blank')}
              className="w-full mt-10 bg-[#0f172a] text-white py-4 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 tracking-wide hover:bg-slate-800 transition-colors"
            >
              <Navigation size={13} className="rotate-45" /> GET DIRECTIONS
            </button>
          </div>

          {/* --- DYNAMIC WHERE TO STAY SECTION --- */}
          <div className="bg-white rounded-[32px] shadow-lg shadow-slate-100 p-7 border border-slate-50">
            <div className="flex items-center gap-2 mb-6">
              <Hotel size={16} className="text-blue-600" />
              <h2 className="text-base font-black text-slate-800">Where to Stay</h2>
            </div>
            <div className="space-y-3">
              {spot.whereToStay && spot.whereToStay.length > 0 ? (
                spot.whereToStay.map((hotel) => (
                  <div 
                    key={hotel._id} 
                    onClick={() => router.push(`/places/${hotel._id}`)}
                    className="group p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5 flex-1 pr-4">
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-700 transition-colors">{hotel.name}</h4>
                      <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                        <span className="line-clamp-1">{hotel.tagline || hotel.region}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No nearby locations listed</p>
                </div>
              )}
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
};

export default SpotDetailsPage;