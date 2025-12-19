
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { id: 'overview', label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'bookings', label: 'My Bookings', path: '/dashboard/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'profile', label: 'My Profile', path: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <aside className="w-72 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-[#c5a059] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-[#c5a059]/20">FT</div>
          <div>
            <span className="text-xl font-bold tracking-tight block leading-none">FunTours</span>
            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.3em] mt-1 block">Dubai</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#c5a059]/20 to-transparent text-[#c5a059]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#c5a059]' : 'text-slate-500 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#c5a059] rounded-r-full shadow-[0_0_15px_rgba(197,160,89,0.4)]"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-800/50">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-xl border-2 border-[#c5a059]" alt="User" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]"></div>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">Khalid Rashid</p>
            <p className="text-[9px] text-slate-500 uppercase font-extrabold tracking-widest">VIP Traveler</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
