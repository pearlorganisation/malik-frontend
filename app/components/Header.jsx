"use client";

import React from "react";
import Link from "next/link";
import { User, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-extrabold text-slate-900 hover:text-indigo-600 transition">
            DubaiTours
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <Link href="/activity" className="hover:text-indigo-600 transition-colors">
            Activities
          </Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Login / Signup */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-900 text-indigo-900 font-medium hover:bg-slate-900 hover:text-white transition"
          >
            <User size={16} />
            Login
          </Link>

          <Link
            href="/signup"
            className="hidden md:inline-flex px-5 py-2 rounded-full bg-slate-900 text-white font-medium hover:bg-indigo-800 transition"
          >
            Sign Up
          </Link>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
