"use client";
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Home/Hero.jsx";
import FAQ from "@/components/Home/Faq.jsx";
import Footer from "@/components/Footer.jsx";
import ActivitiesPage from "@/components/Activity/AcrivityListing.jsx";
import TrustSection from "@/components/Home/TrustSection";
import DestinationGuide from "@/components/Home/DestinationGuide";
import FunToursHero from "@/components/Home/InfoSection";

export default function HomePage() {
  return (
    <main className="font-sans text-gray-800">
      <Hero />
      <ActivitiesPage />
      <TrustSection />
      <DestinationGuide/>
      <FunToursHero />
      <FAQ />
    </main>
  );
}
