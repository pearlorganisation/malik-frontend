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
  Bell,
  Search,
  Compass,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import MegaMenu from "./Home/MegaMenu";

/* ---------------- NAV ITEMS ---------------- */
const NAV_ITEMS = [
  { label: "Explore", href: "/" },
  { label: "Activities", href: "/activity" },
  { label: "The City", href: "/about" },
  { label: "Support", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- CLOSE PROFILE DROPDOWN ON CLICK OUTSIDE ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- CLOSE MEGA MENU ON CLICK OUTSIDE ---------------- */
  useEffect(() => {
    if (!isMegaMenuOpen) return;

    const handler = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMegaMenuOpen]);

  /* ---------------- CLOSE ALL MENUS ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      {/* MegaMenu - Controlled by search focus */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />

      {/* Main Header */}
      <header
        className={`fixed left-0 right-0 z-[90] transition-all duration-500 ${
          scrolled ? "top-2 px-3" : "top-6 px-3"
        }`}
      >
        <div
          className="
            max-w-7xl mx-auto
            rounded-[24px] sm:rounded-[32px]
            bg-white
            border border-slate-100
            shadow-[0_20px_50px_rgba(0,0,0,0.12)]
            px-3 sm:px-6 lg:px-8
            py-3 sm:py-4
            transition-all duration-500
          "
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Compass className="text-amber-400" />
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-lg sm:text-xl lg:text-2xl font-black">
                  Dubai<span className="text-amber-500">Tours</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">
                  Premium Portal
                </div>
              </div>
            </Link>

            {/* Center: Search Bar (Desktop) */}
            <div
              ref={searchContainerRef}
              className="hidden lg:flex flex-1 max-w-xl mx-8"
            >
              <div className="relative w-full">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search tours, activities, cities..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-base font-medium bg-slate-50"
                  onFocus={() => setIsMegaMenuOpen(true)}
                />
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition ${
                    pathname === item.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Search Trigger */}
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                <Search size={20} />
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all ${
                      isProfileOpen
                        ? "border-amber-400 scale-105"
                        : "border-slate-200 hover:border-amber-400"
                    }`}
                  >
                    <div className="w-full h-full bg-slate-800 text-white rounded-full flex items-center justify-center font-black text-lg">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-[260px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100">
                      <div className="p-4 border-b">
                        <p className="font-bold text-lg">{user?.name}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserIcon size={18} />
                          Account Settings
                        </Link>
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-left">
                          <Bell size={18} />
                          Notifications
                        </button>
                      </div>
                      <div className="border-t p-3">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center justify-center gap-3 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                        >
                          <LogOut size={18} />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex gap-3">
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-3 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } rounded-l-3xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 flex items-center justify-between border-b">
            <span className="font-black text-xl text-slate-900">
              DUBAITOURS
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-5 py-4 rounded-2xl text-lg font-semibold transition ${
                  pathname === item.href
                    ? "bg-amber-100 text-amber-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated && (
            <div className="border-t px-6 py-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-500">Premium Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
