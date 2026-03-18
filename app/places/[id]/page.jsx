"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Coffee,
  CarTaxiFront,
  Ticket,
  Play,
  MapPin,
  Clock,
  DollarSign,
  Navigation,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlaceByIdQuery } from "@/features/place/placeApi";

// Reusable Info Card Component
function InfoCard({ label, value, highlight = false }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
      <p className="text-gray-600 text-xs uppercase tracking-wider">{label}</p>
      <p
        className={`font-bold text-xl mt-1 ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}

// Reusable Tip Card Component
function TipCard({ icon: Icon, title, description }) {
  return (
    <div className="text-center group">
      <div className="bg-orange-100 rounded-full w-28 h-28 mx-auto mb-5 flex items-center justify-center group-hover:bg-orange-200 transition">
        <Icon className="w-12 h-12 text-orange-600" />
      </div>
      <p className="font-semibold text-lg">{title || "N/A"}</p>
      <p className="text-gray-600 mt-2 text-sm">{description || "N/A"}</p>
    </div>
  );
}

// Reusable Spot Card Component
function SpotCard({ spot }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="h-48 relative overflow-hidden">
        <img
          src={spot.image || "/placeholder.jpg"}
          alt={spot.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">{spot.title || "N/A"}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {spot.overview || "No description available."}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{spot.location || "N/A"}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {spot.visitorInfo?.openingHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{spot.visitorInfo.openingHours}</span>
            </div>
          )}
          {spot.visitorInfo?.entryFee && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>${spot.visitorInfo.entryFee}</span>
            </div>
          )}
        </div>

        {spot.visitorInfo?.directionsLink && (
          <a
            href={spot.visitorInfo.directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
  const { id } = useParams();
  const { data: placeData, isLoading, isError } = useGetPlaceByIdQuery(id);
  const [activeTab, setActiveTab] = useState("");

  const place = placeData?.data;

  // Define tabs in desired order
  const tabs = [
    "mustVisitSpots",
    "shoppingAndMalls",
    "beaches",
    "parksAndNature",
    "freeActivities",
    "whereToStay",
  ];

  // Format tab name for display
  const formatTabName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Set initial active tab when data loads
  useEffect(() => {
    if (place && tabs.length > 0) {
      // Find first tab that has data
      const firstWithData = tabs.find(
        (tab) =>
          place.travelGuide?.[tab]?.length > 0 ||
          (tab === "whereToStay" && place.whereToStay?.length > 0)
      );
      setActiveTab(firstWithData || tabs[0]);
    }
  }, [place]);

  // Get current spots based on active tab
  const getCurrentSpots = () => {
    if (!place || !activeTab) return [];

    if (activeTab === "whereToStay") {
      return place.whereToStay || [];
    }

    return place.travelGuide?.[activeTab] || [];
  };

  const currentSpots = getCurrentSpots();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading destination...</p>
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Failed to load place details.</p>
      </div>
    );
  }

  const quickInfo = [
    { label: "Nearby", value: place.quickFacts?.nearBy?.name },
    { label: "Climate", value: place.quickFacts?.climate },
    { label: "Best Time", value: place.quickFacts?.bestTime },
    { label: "Safety", value: place.quickFacts?.safety, highlight: true },
  ];

  const travelTips =
    place.travelTips?.length > 0
      ? place.travelTips.map((tip) => ({
          icon: [Camera, Coffee, CarTaxiFront][Math.floor(Math.random() * 3)],
          title: tip.category,
          description: tip.tip,
        }))
      : [];

  return (
    <>
      {/* Header */}
      <header className="bg-linear-to-b from-[#001f3f] to-[#003366] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {place.name || "N/A"}
          </h1>
          <p className="text-xl mt-3 opacity-90">{place.tagline || "N/A"}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Info */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {quickInfo.map((info, i) => (
            <InfoCard key={i} {...info} />
          ))}
        </section>

        {/* About Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-5">
              About {place.name}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {place.about || "No description available."}
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl group cursor-pointer">
            <div className="bg-linear-to-br from-gray-900 to-black h-64 md:h-72 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition">
                  <Play className="w-8 h-8 ml-1" fill="white" />
                </div>
                <p className="text-lg font-medium">Watch Video</p>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Tips */}
        {travelTips.length > 0 && (
          <section className="mb-20">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
              Travel Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {travelTips.map((tip, i) => (
                <TipCard key={i} {...tip} />
              ))}
            </div>
          </section>
        )}

        {/* Must Visit Spots */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center">
            Must-Visit Spots
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => {
              const hasData =
                tab === "whereToStay"
                  ? place.whereToStay?.length > 0
                  : place.travelGuide?.[tab]?.length > 0;

              if (!hasData) return null;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {formatTabName(tab)}
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentSpots.length > 0 ? (
              currentSpots.map((spot, i) => (
                <SpotCard key={spot._id || i} spot={spot} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-12">
                No spots available in this category.
              </p>
            )}
          </div>
        </section>

        {/* Top Rated Tours Placeholder */}
        <section className="py-16 bg-linear-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <Ticket className="w-12 h-12 text-orange-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Tours
            </h2>
            <p className="text-lg text-gray-600">
              Tours and activities will be available soon!
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
