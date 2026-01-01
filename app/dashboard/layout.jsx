"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar only for logged-in users */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 bg-slate-100 p-6">
        {children}
      </main>
    </div>
  );
}
