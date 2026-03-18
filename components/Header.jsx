
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Search,
  Compass,
  Home,
  Star,
  Sparkles,
  Phone,
  Globe,
  ChevronDown,
  MessageCircle,
  PhoneCall,
  MapPin,
  Palmtree,
  Zap,
  Flame,
  PenSquare
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import MegaMenu from "./Home/MegaMenu";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";


// Data untouched as requested
const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Experiences", href: "/activity", icon: Compass },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "AI Planner", href: "#", icon: Sparkles },
  { label: "Contact", href: "/contact", icon: Phone },
];


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const limit=12
  const { data: response, isLoading } = useGetCategoriesQuery({
      page: 1,
      limit: limit * 2,
    });
  
    const categories = response?.data || [];
     const allCategories = [
    ...categories,
  ];
  

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsMegaMenuOpen(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout.");
    }
    setIsProfileOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMegaMenuOpen(false);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-2 py-2 bg-white ${scrolled ? " shadow-sm" : ""}`}>
        {/* <div className="max-w-[1440px] mx-auto px-6"> */}
        <div className="max-w-[1320px] mx-auto px-4 lg:px-24">
          <div className="h-[80px] flex items-center justify-between gap-8">
            
            {/* LOGO - Matched to Screenshot */}
            <Link href="/" className="flex flex-col items-start leading-none group">
              <div className="flex items-center gap-1">
                <span className="text-[28px] font-[900] text-[#EF4444] tracking-tight">FUN</span>
                <div className="w-7 h-7 bg-[#FFB800] rounded-full flex items-center justify-center">
                   <div className="relative w-4 h-4 border-b-2 border-white rounded-full flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full"></div>
                      <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>
                   </div>
                </div>
                <span className="text-[28px] font-[900] text-[#0047AB] tracking-tight">TOURS</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-0.5 ml-0.5">
                DUBAI TOURISM
              </span>
            </Link>

            {/* SEARCH CENTER - Styled like screenshot */}
            <div ref={searchContainerRef} className="flex-1 max-w-[700px] hidden lg:block relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsMegaMenuOpen(true);
                    setIsSearchFocused(true);
                  }}
                  placeholder="What are you looking for? (e.g. Desert Safari, Burj Khalifa)"
                  className="w-full h-[54px] pl-14 pr-32 rounded-2xl bg-[#F8FAFC] text-[15px] font-medium text-slate-600 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-400 shadow-sm">ESC</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">To Close</span>
                </div>
              </form>

              {isMegaMenuOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[120%] z-[120]">
                  <MegaMenu
                    searchQuery={searchQuery}
                    isSearchFocused={isSearchFocused}
                    onClose={closeMegaMenu}
                  />
                </div>
              )}
            </div>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-70 transition">
                <div className="bg-[#F8FAFC] p-2.5 rounded-full">
                  <Globe size={18} className="text-slate-600" />
                </div>
                <span className="text-sm font-bold text-slate-700">EN | USD</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-3  bg-[#020617] text-white  py-2 rounded-full text-sm px-4 hover:bg-slate-800 transition shadow-lg active:scale-95"
              >
                Menu
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      {isMegaMenuOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div className="fixed inset-0 z-[150] bg-white p-6 pt-24">
          <div className="flex items-center gap-3 mb-6 bg-slate-100 p-4 rounded-2xl">
            <Search className="text-slate-400" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Dubai activities..."
              className="flex-1 text-lg outline-none bg-transparent"
              autoFocus
            />
            <button onClick={closeMegaMenu} className="p-1 hover:bg-slate-200 rounded-full">
              <X size={24} />
            </button>
          </div>
          <MegaMenu searchQuery={searchQuery} isSearchFocused onClose={closeMegaMenu} />
        </div>
      )}

      {/* MOBILE DRAWER - Matched to Screenshot UI */}
      <div
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-[350px] bg-white transition-transform duration-500 ease-out flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 flex justify-between items-center">
             <div className="flex items-center gap-1">
                <span className="text-xl font-[900] text-[#EF4444]">FUN</span>
                <div className="w-5 h-5 bg-[#FFB800] rounded-full flex items-center justify-center">
                   <div className="w-2.5 h-2.5 border-b border-white rounded-full"></div>
                </div>
                <span className="text-xl font-[900] text-[#0047AB]">TOURS</span>
              </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {/* Main Nav Items */}
            <nav className="space-y-1 mb-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] transition-all ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={20} className={pathname === item.href ? "text-blue-600" : "text-slate-400"} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Quick Browse Section */}
            {/* ✅ DYNAMIC Quick Browse Categories */}
<div className="grid grid-cols-6 gap-4 py-2">
  {!isLoading &&
    allCategories.map((category) => (
      <Link
        key={category._id}
        // href={`/category/${encodeURIComponent(
        //   category.slug || category.name.toLowerCase()
        // )}`}
        href={`/activity?category=${category._id}`}
        onClick={() => setIsMenuOpen(false)}
        className="flex flex-col items-center gap-2 text-center group"
      >
        {/* Image Card */}
        <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 group-hover:scale-105 group-active:scale-95 bg-slate-100">
          <Image
            src={
              category.image?.url ||
              "/images/category-placeholder.jpg"
            }
            alt={category.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        {/* Label */}
        <span className="text-[11px] font-medium text-slate-600 leading-tight">
          {category.name}
        </span>
      </Link>
    ))}
</div>




            {/* Bottom Actions */}
            <div className="space-y-3 mt-auto">
              <div className="flex gap-3">
                <button className="flex-1 bg-[#22C55E] text-white flex items-center justify-center gap-2 h-[52px] rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition">
                  <MessageCircle size={18} />
                  WHATSAPP
                </button>
                <button className="flex-1 bg-[#020617] text-white flex items-center justify-center gap-2 h-[52px] rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition">
                  <PhoneCall size={18} />
                  CALL
                </button>
              </div>
              <button className="w-full bg-[#0047AB] text-white flex items-center justify-center gap-2 h-[56px] rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-200 active:scale-[0.98] transition">
                <PenSquare size={18} />
                PLAN MY TRIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}