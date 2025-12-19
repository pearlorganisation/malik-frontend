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

  const [logoutMutation, { isLoading: isLoggingOut }] =
    useLogoutMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- CLOSE ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {}
    dispatch(logoutAction());
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* ---------------- HEADER ---------------- */}
      <header
        className={`fixed left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? "top-2 px-3" : "top-6 px-3"
        }`}
      >
        <div
          className="
            max-w-7xl mx-auto
            rounded-[24px] sm:rounded-[32px]
            transition-all duration-500
            bg-white
            border border-slate-100
            shadow-[0_20px_50px_rgba(0,0,0,0.12)]
            px-3 sm:px-6 lg:px-8
            py-3 sm:py-4
          "
        >
          <div className="flex justify-between items-center gap-2">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Compass className="text-amber-400" />
              </div>
              <div className="leading-tight">
                <div className="text-lg sm:text-xl lg:text-2xl font-black">
                  Dubai<span className="text-amber-500">Tours</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">
                  Premium Portal
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                    pathname === item.href
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-slate-900">
                <Search />
              </button>

              {/* AUTH */}
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
                    <div className="w-full h-full bg-slate-800 text-white rounded-full flex items-center justify-center font-black">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </button>

                  {/* PROFILE DROPDOWN */}
                  <div
                    className={`absolute right-0 mt-4 w-[260px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 transition-all duration-300 origin-top-right ${
                      isProfileOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="p-4 border-b">
                      <p className="font-bold">{user?.name}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                      >
                        <UserIcon size={18} />
                        Account Settings
                      </Link>
                      <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-50">
                        <Bell size={18} />
                        Notifications
                      </button>
                    </div>

                    <div className="border-t p-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex gap-2">
                  <Link href="/login" className="font-bold">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100"
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </header>

{/*-- MOBILE DRAWER  */}
<div
  className={`fixed inset-0 z-[200] transition ${
    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
  onClick={() => setIsMenuOpen(false)}
>
  {/* BACKDROP */}
  <div className="absolute inset-0 bg-black/30" />

  {/* DRAWER */}
  <div
    className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white
    transition-transform duration-300
    ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
    rounded-l-2xl shadow-xl flex flex-col`}
    onClick={(e) => e.stopPropagation()}
  >
    {/* HEADER */}
    <div className="px-5 py-4 flex items-center justify-between border-b">
      <span className="font-black text-lg tracking-wide text-slate-900">
        DUBAITOURS
      </span>
      <button
        onClick={() => setIsMenuOpen(false)}
        className="p-2 rounded-lg hover:bg-slate-100"
      >
        <X size={18} />
      </button>
    </div>

    {/* NAV ITEMS */}
    <div className="px-4 py-3 space-y-1 flex-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-3 rounded-xl text-sm font-semibold transition
              ${
                active
                  ? "text-slate-800 bg-slate-100"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>

    {/* FIXED BOTTOM USER SECTION */}
    {isAuthenticated && (
      <div className="border-t px-4 py-4">
        {/* USER CARD */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400">
              MEMBER SINCE 2024
            </p>
          </div>
        </div>

        {/* SIGN OUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-3 py-3 rounded-xl text-sm font-semibold
          bg-red-50 text-red-600 hover:bg-red-100 transition"
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
