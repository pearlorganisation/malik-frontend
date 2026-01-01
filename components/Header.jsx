"use client";

<<<<<<< HEAD
import React from "react";
import Link from "next/link";
import { User, Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  console.log("Redux User in Header:", user);

  const isAuthenticated = !!user;

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction()); // Clears Redux + localStorage (from your updated slice)
      alert("Logged out successfully!");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear client-side state even if backend fails
      dispatch(logoutAction());
      alert("Logged out (client-side).");
=======
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
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [mounted, setMounted] = useState(false); // ✅ hydration fix
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);

  /* ---------------- CLIENT MOUNT ---------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- CLOSE PROFILE DROPDOWN ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- CLOSE MEGA MENU ---------------- */
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

  /* ---------------- CLOSE ALL ON ROUTE CHANGE ---------------- */
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
    } catch {
      toast.error("Failed to logout. Please try again.");
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
    }
  };

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-extrabold text-slate-900 hover:text-indigo-600 transition">
            DubaiTours
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link
            href="/activity"
            className="hover:text-indigo-600 transition-colors"
          >
            Activities
          </Link>
          <Link
            href="/about"
            className="hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                </div>
                <span className="text-slate-700 font-medium">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-600 text-red-600 font-medium hover:bg-red-600 hover:text-white transition disabled:opacity-50"
              >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-900 text-indigo-900 font-medium hover:bg-slate-900 hover:text-white transition"
              >
                <User size={16} />
                Login
              </Link>

              <Link
                href="/signup"
                className="px-5 py-2 rounded-full bg-slate-900 text-white font-medium hover:bg-indigo-800 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Icon (you can expand this later with a drawer) */}
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
=======
    <>
      {/* Mega Menu */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />

      {/* Header */}
      <header
        className={`fixed left-0 right-0 z-90 transition-all duration-500 ${
          scrolled ? "top-2 px-3" : "top-6 px-3"
        }`}
      >
        <div className="max-w-7xl mx-auto rounded-[24px] sm:rounded-[32px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 rounded-2xl flex items-center justify-center">
                <Compass className="text-amber-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black">
                  Dubai<span className="text-amber-500">Tours</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Premium Portal
                </div>
              </div>
            </Link>

            {/* Search */}
            <div
              ref={searchContainerRef}
              className="hidden lg:flex flex-1 max-w-xl mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  onFocus={() => setIsMegaMenuOpen(true)}
                  placeholder="Search tours, activities, cities..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                />
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden lg:flex gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-3 rounded-xl text-sm font-bold ${
                    pathname === item.href
                      ? "bg-slate-100"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-100"
              >
                <Search size={20} />
              </button>

              {/* ✅ AUTH (HYDRATION SAFE) */}
              {!mounted ? (
                <div className="hidden sm:flex w-[120px] h-[44px]" />
              ) : isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-slate-200"
                  >
                    <div className="w-full h-full bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-[260px] bg-white rounded-2xl shadow border">
                      <div className="p-4 border-b">
                        <p className="font-bold">{user?.name}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 hover:bg-slate-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/account"
                        className="block px-4 py-3 hover:bg-slate-50"
                      >
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex gap-3">
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-3 bg-amber-500 rounded-xl font-bold"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-100"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[200] ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white transition-transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 flex justify-between border-b">
            <span className="font-black text-xl">DUBAITOURS</span>
            <button onClick={() => setIsMenuOpen(false)}>
              <X />
            </button>
          </div>
        </div>
      </div>
    </>
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca
  );
}
