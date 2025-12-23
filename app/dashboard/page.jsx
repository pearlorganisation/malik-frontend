"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import DashboardUI from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
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

  return <DashboardUI />;
}
