"use client";

import { useState } from "react";
import {
  Camera,
  Coffee,
  CarTaxiFront,
  Ticket,
  Building2,
  Mountain,
  Bug,
  Sailboat,
  Waves,
  Cloud,
  Trees,
  Image as ImageIcon,
  UtensilsCrossed,
  FerrisWheel,
  Gem,
  Crown,
  Play,
} from "lucide-react";

// Reusable Info Card Component
function InfoCard({ label, value, highlight = false }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
      <p className="text-gray-600 text-xs uppercase tracking-wider">{label}</p>
      <p
        className={`font-bold text-xl mt-1 ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
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
      <p className="font-semibold text-lg">{title}</p>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
  );
}

// Reusable Spot Card Component
function SpotCard({ name, desc, img }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="h-48 relative overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}

// Reusable Filter Button Component
function FilterButton({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition ${
        active
          ? "bg-orange-600 text-white hover:bg-orange-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Shopping Malls");

  const tabs = [
    "Shopping Malls",
    "Beaches",
    "Parks & Nature",
    "Museums & Culture",
    "Where to Stay",
  ];

const spots = {
  "Shopping Malls": [
    {
      name: "Yas Mall",
      desc: "The largest mall in Abu Dhabi with over 400 stores and entertainment.",
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/36/26/6d/yas-mall.jpg?w=900&h=500&s=1",
    },
    {
      name: "The Galleria",
      desc: "Luxury shopping and dining on Al Maryah Island.",
      img: "https://visitabudhabi.ae/-/media/project/vad/things-to-do/shopping-and-lifestyle/the-galleria-al-maryah-island/header/the-galleria-luxury-collection-header.jpg?rev=e025913dc9c44c6dbbf70a873d9c8b00",
    },
    {
      name: "Marina Mall",
      desc: "Iconic waterfront mall with stunning views.",
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/e7/89/05/marina-mall.jpg?w=900&h=500&s=1",
    },
  ],
  Beaches: [
    {
      name: "Saadiyat Beach",
      desc: "Pristine white sands and clear turquoise waters.",
      img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/47/95/18/saadiyat-public-beach.jpg?w=1200&h=-1&s=1",
    },
    {
      name: "Corniche Beach",
      desc: "Family-friendly Blue Flag beach with city views.",
      img: "https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/attractions/corniche-beach/corniche-beach-view.jpeg?imwidth=384&imdensity=2.625",
    },
  ],
  "Parks & Nature": [
    {
      name: "Umm Al Emarat Park",
      desc: "A lush green oasis in the heart of the city.",
      img: "https://www.abudhabitravelplanner.com/wp-content/uploads/2022/03/Umm-Al-Emarat-4.jpg",
    },
    {
      name: "Mangrove National Park",
      desc: "Kayak through protected mangrove forests.",
      img: "https://media.tacdn.com/media/attractions-splice-spp-674x446/11/ec/c3/f3.jpg",
    },
  ],
  "Museums & Culture": [
    {
      name: "Louvre Abu Dhabi",
      desc: "Iconic museum showcasing art from around the world.",
      img: "https://blog.architizer.com/wp-content/uploads/photo-BG-2017-louvre-abu_dhabi-ECR-B-36.jpg",
    },
    {
      name: "Sheikh Zayed Grand Mosque",
      desc: "One of the world's most magnificent mosques.",
      img: "https://chrisandwrensworld.com/wp-content/uploads/2025/01/abu-dhabi-mosque.jpeg",
    },
  ],
  "Where to Stay": [
    {
      name: "Emirates Palace",
      desc: "Legendary luxury hotel with Arabian hospitality.",
      img: "https://www.momondo.com/rimg/himg/2e/e5/e1/leonardo-2107472-Emirates_Palace_-_Dusk_(hero_shot)_O-949272.jpg?width=968&height=607&crop=true",
    },
    {
      name: "Qasr Al Watan",
      desc: "Presidential palace open to visitors.",
      img: "https://upload.wikimedia.org/wikipedia/en/7/7c/Qasr_Al_Watan_in_March_2022_02.jpg",
    },
  ],
};
  const currentSpots = spots[activeTab] || [];

  const quickInfo = [
    { label: "Climate", value: "Desert" },
    { label: "Best Time", value: "Oct - Apr" },
    { label: "From Dubai", value: "1.5 hrs" },
    { label: "Safety", value: "Very Safe", highlight: true },
  ];

  const travelTips = [
    {
      icon: Camera,
      title: "Photography",
      description: "Respect local privacy",
    },
    {
      icon: Coffee,
      title: "Culture",
      description: "Arabic coffee is a sign of welcome",
    },
    {
      icon: CarTaxiFront,
      title: "Transport",
      description: "Taxis are affordable",
    },
  ];

  const tourFilters = [
    { icon: Ticket, label: "All Tours", active: true },
    { icon: Building2, label: "City" },
    { icon: Mountain, label: "Desert" },
    { icon: Bug, label: "Buggy" },
    { icon: Sailboat, label: "Yacht" },
    { icon: Waves, label: "Water" },
    { icon: Cloud, label: "Sky" },
    { icon: Trees, label: "Parks" },
    { icon: ImageIcon, label: "Photo" },
    { icon: UtensilsCrossed, label: "Food" },
    { icon: FerrisWheel, label: "Ride" },
    { icon: Gem, label: "VIP" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-b from-[#001f3f] to-[#003366] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Discover Abu Dhabi
          </h1>
          <p className="text-xl mt-3 opacity-90">
            The Capital of Culture & Luxury
          </p>
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
              About Abu Dhabi
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Abu Dhabi, the capital of the United Arab Emirates, combines rich
              cultural heritage with modern sophistication.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Discover stunning beaches, world-class shopping, thrilling theme
              parks, and serene desert landscapes.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl group cursor-pointer">
            <div className="bg-gradient-to-br from-gray-900 to-black h-64 md:h-72 flex items-center justify-center">
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

        {/* Must Visit Spots */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center">
            Must-Visit Spots
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === tab
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentSpots.map((spot, i) => (
              <SpotCard key={i} {...spot} />
            ))}
          </div>
        </section>

        {/* Top Rated Tours */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-4 mb-8">
              <Ticket className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Top Rated Tours
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              {tourFilters.map((filter, i) => (
                <FilterButton key={i} {...filter} />
              ))}
            </div>

            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Crown className="w-10 h-10 text-orange-600" />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-3">
                No tours in this category yet.
              </p>
              <p className="text-gray-500 mb-8">
                Try selecting 'All Tours' to see available experiences.
              </p>
              <button className="px-6 py-3 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition">
                Clear Filters
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
