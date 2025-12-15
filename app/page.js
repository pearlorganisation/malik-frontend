import React from "react";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Home/Hero.jsx";
import About from "@/app/components/Home/About.jsx";
import FAQ from "@/app/components/Home/Faq.jsx";
import Footer from "@/app/components/Footer.jsx";
import ActivitiesPage from "@/app/components/Activity/AcrivityListing.jsx";

export default function HomePage() {
  return (
    <main className="font-sans text-gray-800">

      <Hero/>
      < About />
      <ActivitiesPage/>
      < FAQ />
    </main>
  );
}
