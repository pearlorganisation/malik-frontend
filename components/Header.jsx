
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   User as UserIcon,
//   Menu,
//   X,
//   LogOut,
//   LayoutDashboard,
//   Search,
//   Compass,
//   Home,
//   Star,
//   Sparkles,
//   Phone,
//   Globe,
//   ChevronDown,
//   MessageCircle,
//   PhoneCall,
//   MapPin,
//   Palmtree,
//   Zap,
//   Flame,
//   PenSquare
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useLogoutMutation } from "@/features/auth/authApi";
// import { logout as logoutAction } from "@/features/auth/authSlice";
// import { toast } from "react-hot-toast";
// import MegaMenu from "./Home/MegaMenu";
// import Image from "next/image";
// import { useGetCategoriesQuery } from "@/features/category/categoryApi";

// //test
// // Data untouched as requested
// const NAV_ITEMS = [
//   { label: "Home", href: "/", icon: Home },
//   { label: "Experiences", href: "/activity", icon: Compass },
//   { label: "Reviews", href: "/reviews", icon: Star },
//   { label: "AI Planner", href: "/aitrip-planner", icon: Sparkles },
//   { label: "Contact", href: "/contact", icon: Phone },
// ];


// export default function Header() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const isAuthenticated = !!user;
//   const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
//   const [mounted, setMounted] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const profileRef = useRef(null);
//   const searchContainerRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const limit=12
//   const { data: response, isLoading } = useGetCategoriesQuery({
//       page: 1,
//       limit: limit * 2,
//     });
  
//     const categories = response?.data || [];
//      const allCategories = [
//     ...categories,
//   ];
  

//   useEffect(() => setMounted(true), []);
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setIsProfileOpen(false);
//       }
//       if (
//         searchContainerRef.current &&
//         !searchContainerRef.current.contains(e.target)
//       ) {
//         setIsMegaMenuOpen(false);
//         setIsSearchFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logoutMutation().unwrap();
//       dispatch(logoutAction());
//       router.push("/");
//       router.refresh();
//       toast.success("Logged out successfully!");
//     } catch {
//       toast.error("Failed to logout.");
//     }
//     setIsProfileOpen(false);
//   };

//   const handleSearchSubmit = (e) => {
//     e?.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setIsMegaMenuOpen(false);
//       setSearchQuery("");
//       searchInputRef.current?.blur();
//     }
//   };

//   const closeMegaMenu = () => {
//     setIsMegaMenuOpen(false);
//     setIsSearchFocused(false);
//     setSearchQuery("");
//   };

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 px-1 sm:px-2 md:px-20 py-2 bg-white ${scrolled ? " shadow-sm" : ""}`}>
//         <div className="max-w-360 mx-auto px-6">
//         {/* <div className="max-w-330 mx-auto px-4 lg:px-24"> */}
//           <div className="h-20 flex items-center justify-between gap-8">
            
//             {/* LOGO - Matched to Screenshot */}
//             <Link href="/" className="flex flex-col items-start leading-none group">
//               <div className="flex items-center gap-1">
//                 <span className="text-[28px] font-black text-[#EF4444] tracking-tight">FUN</span>
//                 <div className="w-7 h-7 bg-[#FFB800] rounded-full flex items-center justify-center">
//                    <div className="relative w-4 h-4 border-b-2 border-white rounded-full flex items-center justify-center">
//                       <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full"></div>
//                       <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>
//                    </div>
//                 </div>
//                 <span className="text-[28px] font-black text-[#0047AB] tracking-tight">TOURS</span>
//               </div>
//               <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-0.5 ml-0.5">
//                 DUBAI TOURISM
//               </span>
//             </Link>

//             {/* SEARCH CENTER - Styled like screenshot */}
//             <div ref={searchContainerRef} className="flex-1 max-w-175 hidden lg:block relative">
//               <form onSubmit={handleSearchSubmit} className="relative group">
//                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={() => {
//                     setIsMegaMenuOpen(true);
//                     setIsSearchFocused(true);
//                   }}
//                   placeholder="What are you looking for? (e.g. Desert Safari, Burj Khalifa)"
//                   className="w-full h-13.5 pl-14 pr-32 rounded-2xl bg-[#F8FAFC] text-[15px] font-medium text-slate-600 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
//                 />
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
//                   <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-400 shadow-sm">ESC</span>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">To Close</span>
//                 </div>
//               </form>

//               {isMegaMenuOpen && (
//                 <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[120%] z-120">
//                   <MegaMenu
//                     searchQuery={searchQuery}
//                     isSearchFocused={isSearchFocused}
//                     onClose={closeMegaMenu}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* RIGHT CONTROLS */}
//             <div className="flex items-center gap-6">
//               <div className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-70 transition">
//                 <div className="bg-[#F8FAFC] p-2.5 rounded-full">
//                   <Globe size={18} className="text-slate-600" />
//                 </div>
//                 <span className="text-sm font-bold text-slate-700">EN | USD</span>
//                 <ChevronDown size={14} className="text-slate-400" />
//               </div>

//               <button
//                 onClick={() => setIsMenuOpen(true)}
//                 className="flex items-center gap-3  bg-[#020617] text-white  py-2 rounded-full text-sm px-4 hover:bg-slate-800 transition shadow-lg active:scale-95"
//               >
//                 Menu
//                 <Menu size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MOBILE SEARCH OVERLAY */}
//       {isMegaMenuOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
//         <div className="fixed inset-0 z-150 bg-white p-6 pt-24">
//           <div className="flex items-center gap-3 mb-6 bg-slate-100 p-4 rounded-2xl">
//             <Search className="text-slate-400" />
//             <input
//               ref={searchInputRef}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search Dubai activities..."
//               className="flex-1 text-lg outline-none bg-transparent"
//               autoFocus
//             />
//             <button onClick={closeMegaMenu} className="p-1 hover:bg-slate-200 rounded-full">
//               <X size={24} />
//             </button>
//           </div>
//           <MegaMenu searchQuery={searchQuery} isSearchFocused onClose={closeMegaMenu} />
//         </div>
//       )}

//       {/* MOBILE DRAWER - Matched to Screenshot UI */}
//       <div
//         className={`fixed inset-0 z-200 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
//           isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setIsMenuOpen(false)}
//       >
//         <div
//           className={`absolute right-0 top-0 h-full w-87.5 bg-white transition-transform duration-500 ease-out flex flex-col ${
//             isMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Drawer Header */}
//           <div className="p-6 flex justify-between items-center">
//              <div className="flex items-center gap-1">
//                 <span className="text-xl font-black text-[#EF4444]">FUN</span>
//                 <div className="w-5 h-5 bg-[#FFB800] rounded-full flex items-center justify-center">
//                    <div className="w-2.5 h-2.5 border-b border-white rounded-full"></div>
//                 </div>
//                 <span className="text-xl font-black text-[#0047AB]">TOURS</span>
//               </div>
//             <button 
//               onClick={() => setIsMenuOpen(false)}
//               className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto px-6 pb-4">
//             {/* Main Nav Items */}
//             <nav className="space-y-1 mb-8">
//               {NAV_ITEMS.map((item) => (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   onClick={() => setIsMenuOpen(false)}
//                   className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-[15px] transition-all ${
//                     pathname === item.href
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-slate-600 hover:bg-slate-50"
//                   }`}
//                 >
//                   <item.icon size={20} className={pathname === item.href ? "text-blue-600" : "text-slate-400"} />
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>

//             {/* Quick Browse Section */}
//             {/* ✅ DYNAMIC Quick Browse Categories */}
// <div className="grid grid-cols-6 gap-4 py-2">
//   {!isLoading &&
//     allCategories.map((category) => (
//       <Link
//         key={category._id}
//         // href={`/category/${encodeURIComponent(
//         //   category.slug || category.name.toLowerCase()
//         // )}`}
//         href={`/activity?category=${category._id}`}
//         onClick={() => setIsMenuOpen(false)}
//         className="flex flex-col items-center gap-2 text-center group"
//       >
//         {/* Image Card */}
//         <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 group-hover:scale-105 group-active:scale-95 bg-slate-100">
//           <Image
//             src={
//               category.image?.url ||
//               "/images/category-placeholder.jpg"
//             }
//             alt={category.name}
//             fill
//             className="object-cover"
//             sizes="56px"
//           />
//         </div>

//         {/* Label */}
//         <span className="text-[11px] font-medium text-slate-600 leading-tight">
//           {category.name}
//         </span>
//       </Link>
//     ))}
// </div>




//             {/* Bottom Actions */}
//             <div className="space-y-3 mt-auto">
//               <div className="flex gap-3">
//                 <button className="flex-1 bg-[#22C55E] text-white flex items-center justify-center gap-2 h-13 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition">
//                   <a 
//                   href="https://wa.me/971501902213" 
//                   target="_blank"
//                   rel="noreferrer"
//                   className="flex-1 md:flex-none px-7 py-3.5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2.5 group active:scale-95"
//                 ><MessageCircle size={18} />
//                   WHATSAPP
//                   </a> 
//                 </button>
//                 <button  className="flex-1 bg-[#020617] text-white flex items-center justify-center gap-2 h-13 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition">
//                   <a 
//                    href="/contact" 
//                   className="flex-1 md:flex-none px-7 py-3.5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2.5 group active:scale-95"
//                 >
//                   <PhoneCall size={18} />
//                   CALL
//                   </a>
//                 </button>
//               </div>
//               <button className="w-full bg-[#0047AB] text-white flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-200 active:scale-[0.98] transition">
//                 <a 
//                    href="/aitrip-planner" 
//                   className="flex-1 md:flex-none px-7 py-3.5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2.5 group active:scale-95"
//                 >
//                 <PenSquare size={18} />
//                 PLAN MY TRIP
//                 </a>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
















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
  PenSquare,
  Check
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import MegaMenu from "./Home/MegaMenu";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Experiences", href: "/activity", icon: Compass },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "AI Planner", href: "/aitrip-planner", icon: Sparkles },
  { label: "Contact", href: "/contact", icon: Phone },
];

const LANGUAGES = [
  { code: "US", name: "English" },
  { code: "AE", name: "العربية" },
  { code: "FR", name: "Français" },
  { code: "RU", name: "Русский" },
  { code: "CN", name: "中文" },
];

const CURRENCIES = [
  { code: "USD", name: "US DOLLAR" },
  { code: "AED", name: "UAE DIRHAM" },
  { code: "EUR", name: "EURO" },
  { code: "GBP", name: "BRITISH POUND" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Regional Modal State
  const [isRegionalModalOpen, setIsRegionalModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("US");
  const [selectedCurr, setSelectedCurr] = useState("USD");

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: response, isLoading } = useGetCategoriesQuery({ page: 1, limit: 24 });
  const categories = response?.data || [];
  const allCategories = [...categories];

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsMegaMenuOpen(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplySettings = () => {
    toast.success(`Regional Settings Applied Successfully! ✨\nLanguage: ${selectedLang} | Currency: ${selectedCurr}`, {
      duration: 4000,
      position: 'top-center',
      style: {
        borderRadius: '16px',
        background: '#1e293b',
        color: '#fff',
        fontWeight: 'bold'
      },
    });
    setIsRegionalModalOpen(false);
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

  if (!mounted) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-1 sm:px-2 md:px-20 py-2 bg-white ${scrolled ? " shadow-sm" : ""}`}>
        <div className="max-w-360 mx-auto px-6">
          <div className="h-20 flex items-center justify-between gap-8">
            
            {/* LOGO */}
            <Link href="/" className="flex flex-col items-start leading-none group">
              <div className="flex items-center gap-1">
                <span className="text-[28px] font-black text-[#EF4444] tracking-tight">FUN</span>
                <div className="w-7 h-7 bg-[#FFB800] rounded-full flex items-center justify-center">
                   <div className="relative w-4 h-4 border-b-2 border-white rounded-full flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full"></div>
                      <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>
                   </div>
                </div>
                <span className="text-[28px] font-black text-[#0047AB] tracking-tight">TOURS</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-0.5 ml-0.5 uppercase">
                Dubai Tourism
              </span>
            </Link>

            {/* SEARCH CENTER */}
            <div ref={searchContainerRef} className="flex-1 max-w-175 hidden lg:block relative">
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
                  className="w-full h-13.5 pl-14 pr-32 rounded-2xl bg-[#F8FAFC] text-[15px] font-medium text-slate-600 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] font-bold text-slate-400 shadow-sm">ESC</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">To Close</span>
                </div>
              </form>

              {isMegaMenuOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[120%] z-120">
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
              {/* TRIGGER MODAL */}
              <div 
                onClick={() => setIsRegionalModalOpen(true)}
                className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-70 transition active:scale-95"
              >
                <div className="bg-[#F8FAFC] p-2.5 rounded-full">
                  <Globe size={18} className="text-slate-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase">{selectedLang} | {selectedCurr}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-3 bg-[#020617] text-white py-2 rounded-full text-sm px-4 hover:bg-slate-800 transition shadow-lg active:scale-95"
              >
                Menu
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* REGIONAL SETTINGS MODAL */}
      {isRegionalModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRegionalModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-800">Regional Settings</h2>
              <button onClick={() => setIsRegionalModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Language Selection */}
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Language</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedLang === lang.code 
                        ? "border-[#0047AB] bg-blue-50/30" 
                        : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{lang.code}</span>
                        <span className="text-[15px] font-bold text-slate-700">{lang.name}</span>
                      </div>
                      {selectedLang === lang.code && <Check size={18} className="text-[#0047AB]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Selection */}
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Currency</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CURRENCIES.map((curr) => (
                    <div
                      key={curr.code}
                      onClick={() => setSelectedCurr(curr.code)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        selectedCurr === curr.code 
                        ? "border-[#0047AB] bg-blue-50/30" 
                        : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <span className={`text-base font-black mb-0.5 ${selectedCurr === curr.code ? "text-[#0047AB]" : "text-slate-800"}`}>
                        {curr.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {curr.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button 
                onClick={handleApplySettings}
                className="w-full py-5 bg-[#0047AB] hover:bg-[#00388a] text-white rounded-2xl font-black text-base shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-87.5 bg-white transition-transform duration-500 ease-out flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 flex justify-between items-center">
             <div className="flex items-center gap-1">
                <span className="text-xl font-black text-[#EF4444]">FUN</span>
                <div className="w-5 h-5 bg-[#FFB800] rounded-full flex items-center justify-center">
                   <div className="w-2.5 h-2.5 border-b border-white rounded-full"></div>
                </div>
                <span className="text-xl font-black text-[#0047AB]">TOURS</span>
              </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {/* Mobile Lang/Curr Trigger */}
            <div 
              onClick={() => {setIsMenuOpen(false); setIsRegionalModalOpen(true);}}
              className="mb-4 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-slate-400" />
                <span className="font-bold text-slate-700 uppercase">{selectedLang} | {selectedCurr}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>

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

            <div className="grid grid-cols-4 gap-4 py-2">
              {!isLoading &&
                allCategories.slice(0, 12).map((category) => (
                  <Link
                    key={category._id}
                    href={`/activity?category=${category._id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-2 text-center group"
                  >
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                      <Image
                        src={category.image?.url || "/images/category-placeholder.jpg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 leading-tight">
                      {category.name}
                    </span>
                  </Link>
                ))}
            </div>

            <div className="space-y-3 mt-8">
              <div className="flex gap-3">
                <a 
                  href="https://wa.me/971501902213" 
                  target="_blank"
                  className="flex-1 bg-[#22C55E] text-white flex items-center justify-center gap-2 h-13 rounded-2xl font-bold text-sm"
                >
                  <MessageCircle size={18} /> WHATSAPP
                </a> 
                <a 
                   href="tel:+971501902213" 
                  className="flex-1 bg-[#020617] text-white flex items-center justify-center gap-2 h-13 rounded-2xl font-bold text-sm"
                >
                  <PhoneCall size={18} /> CALL
                </a>
              </div>
              <Link 
                  href="/aitrip-planner" 
                  className="w-full bg-[#0047AB] text-white flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-200"
                >
                <PenSquare size={18} /> PLAN MY TRIP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




