import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Home/Hero.jsx";
import About from "@/components/Home/About.jsx";
import FAQ from "@/components/Home/Faq.jsx";
import Footer from "@/components/Footer.jsx";
import ActivitiesPage from "@/components/Activity/AcrivityListing.jsx";

export default function HomePage() {
  return (
    <main className="font-sans text-gray-800">
      <Hero />
      <About />
      <ActivitiesPage />
      <FAQ />
    </main>
  );
}
