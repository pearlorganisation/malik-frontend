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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import MegaMenu from "./Home/MegaMenu";

const NAV_ITEMS = [
  { label: "Explore", href: "/" },
  { label: "Activities", href: "/activity" },
  { label: "Contact Us", href: "/contact" },
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

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
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
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "top-2 px-4" : "top-6 px-6"
        }`}
      >
        <div className="max-w-7xl mx-auto rounded-[32px] bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] px-4 sm:px-8 py-3.5">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3.5 flex-shrink-0 group"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg">
                <Compass className="text-amber-400 w-6 h-6" />
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xl font-[900] tracking-tight text-slate-900 uppercase">
                  Dubai<span className="text-amber-500">Tours</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Premium Portal
                </div>
              </div>
            </Link>

            {/* Desktop Search + MegaMenu */}
            <div
              ref={searchContainerRef}
              className="relative hidden lg:flex flex-1 max-w-2xl"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full relative group"
              >
                <div
                  className={`absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors ${
                    isSearchFocused ? "text-amber-500" : "text-slate-400"
                  }`}
                >
                  <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsMegaMenuOpen(true);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Where to next in Dubai?"
                  className="w-full pl-14 pr-14 py-4.5 bg-slate-50/80 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white border-2 border-transparent focus:border-amber-500/10 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
             
              </form>

              {/* MegaMenu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 z-[100]">
                  <MegaMenu
                    searchQuery={searchQuery}
                    isSearchFocused={isSearchFocused}
                    onClose={closeMegaMenu}
                  />
                </div>
              )}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    pathname === item.href
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsMegaMenuOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="lg:hidden p-3.5 rounded-2xl bg-slate-50 text-slate-900 hover:bg-amber-500 hover:text-white transition-colors"
              >
                <Search size={20} strokeWidth={2.5} />
              </button>

              {/* Auth */}
              {!mounted ? (
                <div className="w-[120px] h-[48px]" />
              ) : isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg overflow-hidden border-2 border-white"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=0f172a&color=fff&bold=true`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-6 w-[280px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.16)] border border-slate-100 overflow-hidden">
                      <div className="p-6 bg-slate-900 text-white">
                        <p className="font-black text-lg">{user.name}</p>
                        <p className="text-sm text-slate-400 font-medium">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard
                            size={18}
                            className="text-slate-400"
                          />
                          Dashboard
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon size={18} className="text-slate-400" />
                          Account Settings
                        </Link>
                        <div className="h-px bg-slate-100 my-2 mx-5" />
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-6 py-3.5 text-slate-600 font-bold hover:text-slate-900 transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-7 py-3.5 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg"
              >
                <Menu size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Search Overlay */}
        {isMegaMenuOpen && window.innerWidth < 1024 && (
          <div className="fixed inset-0 z-[60] bg-white p-6 pt-24 animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-md mx-auto h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Dubai activities..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold"
                    autoFocus
                  />
                </div>
                <button
                  onClick={closeMegaMenu}
                  className="p-4 bg-slate-100 rounded-2xl text-slate-900 font-bold"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pb-20">
                <MegaMenu
                  searchQuery={searchQuery}
                  isSearchFocused={true}
                  onClose={closeMegaMenu}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white transition-transform duration-500 shadow-2xl ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <div className="text-xl font-black tracking-tight">
              DUBAI<span className="text-amber-500">TOURS</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
          <div className="p-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-4 rounded-2xl font-black text-slate-800 text-lg hover:bg-slate-50 transition-all ${
                  pathname === item.href ? "bg-amber-50 text-amber-700" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Auth links in drawer */}
            {!isAuthenticated ? (
              <div className="pt-8 space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-lg text-center shadow-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-5 rounded-2xl bg-amber-500 text-white font-black text-lg text-center shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-8 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-slate-800 text-lg hover:bg-slate-50"
                >
                  <LayoutDashboard size={24} className="text-slate-400" />{" "}
                  Dashboard
                </Link>
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-slate-800 text-lg hover:bg-slate-50"
                >
                  <UserIcon size={24} className="text-slate-400" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-red-500 text-lg hover:bg-red-50"
                >
                  <LogOut size={24} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Menu Links */}
    <nav className="flex flex-col gap-2 p-5">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-3 rounded-lg text-sm font-semibold ${
            pathname === item.href
              ? "bg-amber-100 text-amber-600"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => setIsMenuOpen(false)} // Close menu on click
        >
          {item.label}
        </Link>
      ))}
    </nav>

    {/* Auth Links */}
    <div className="flex flex-col gap-3 p-5">
      {!isAuthenticated ? (
        <>
          <Link
            href="/login"
            className="px-4 py-3 bg-slate-900 text-white rounded-lg text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-3 bg-amber-500 text-center rounded-lg font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/dashboard"
            className="px-4 py-3 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/account"
            className="px-4 py-3 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Account
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
</div>

    </>
  );
}
