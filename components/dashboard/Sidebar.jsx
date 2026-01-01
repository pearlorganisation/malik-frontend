
"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Home } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const user = useSelector((state) => state.auth.user);


  const dispatch = useDispatch();

const [logoutMutation, { isLoading: isLoggingOut }] =
  useLogoutMutation();

 const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully!"); 
    } catch (err) {
      dispatch(logoutAction());
      router.push("/");
      router.refresh();
      toast.error("Failed to logout. Please try again.");
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'bookings', label: 'My Bookings', path: '/dashboard/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'profile', label: 'My Profile', path: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
     { id: 'home', label: 'Home', path: '/', icon: 'Home' },
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

        {user && (
        <div className="mt-auto p-8 border-t border-slate-800/50">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30">
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-xl bg-[#c5a059] text-black flex items-center justify-center font-black">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* USER INFO */}
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">
                {user?.name}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">
                {user?.role || "Traveler"}
              </p>
            </div>
          </div>
           <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="
        w-full flex items-center justify-center gap-3
        px-4 py-3 rounded-2xl
        bg-red-500/10 text-red-400
        hover:bg-red-500/20 hover:text-red-300
        transition font-semibold text-sm
      "
    >
      <LogOut size={16} />
      Logout
    </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
