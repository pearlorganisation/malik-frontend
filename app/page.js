import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Home/Hero.jsx";
import About from "@/components/Home/About.jsx";
import FAQ from "@/components/Home/Faq.jsx";
import Footer from "@/components/Footer.jsx";
import ActivitiesPage from "@/components/Activity/AcrivityListing.jsx";
<<<<<<< HEAD
=======
import TrustSection from "@/components/Home/TrustSection";
import DestinationGuide from "@/components/Home/DestinationGuide";
>>>>>>> 49cbb7e726e1b3e686c1bff2264c22c9d1214eca

export default function HomePage() {
  return (
    <main className="font-sans text-gray-800">
      <Hero />
      <About />
      <ActivitiesPage />
      <TrustSection />
      <DestinationGuide/>
      <FAQ />
    </main>
  );
}
