"use client";

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
    }
  };

  return (
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
  );
}
