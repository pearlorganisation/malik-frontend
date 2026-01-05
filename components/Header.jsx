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
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  // Remove searchContainerRef — no longer needed for click outside

  useEffect(() => {
    setMounted(true);
  }, []);

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

  /* ---------------- REMOVE THIS ENTIRE useEffect ---------------- */
  // DELETE THIS BLOCK — it was conflicting with MegaMenu
  /*
  useEffect(() => {
    if (!isMegaMenuOpen) return;
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMegaMenuOpen]);
  */

  /* ---------------- CLOSE ALL ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      {/* Mega Menu - now fully controls its own open/close */}
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

            {/* Search - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  onFocus={() => setIsMegaMenuOpen(true)}
                  onClick={() => setIsMegaMenuOpen(true)} // Also open on click
                  placeholder="Search tours, activities, cities..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 cursor-pointer"
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

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-100"
              >
                <Search size={20} />
              </button>

              {/* Auth */}
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

              {/* Mobile Menu */}
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
  className={`fixed inset-0 z-[200] transition-opacity ${
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

    {/* Mobile Search */}
    <div className="p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          onFocus={() => setIsMegaMenuOpen(true)}
          placeholder="Search tours, activities, cities..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
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
