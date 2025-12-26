"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export default function DestinationGuide() {
  const destinations = [
    {
      emirate: "Dubai",
      label: "DUBAI",
      title: "Things to do in Dubai",
      description:
        "The city of the future. Home to Burj Khalifa, Palm Jumeirah, and endless luxury experiences.",
      image: "/abu.jpg", // Replace with actual paths
    },
    {
      emirate: "Abu Dhabi",
      label: "ABU DHABI",
      title: "Things to do in Abu Dhabi",
      description:
        "The capital of culture. Visit the Grand Mosque, Louvre Museum, and Ferrari World.",
      image: "/abu.jpg",
    },
    {
      emirate: "Sharjah",
      label: "SHARJAH",
      title: "Things to do in Sharjah",
      description:
        "The Art Capital. Explore heritage museums, souks, and beautiful waterfronts.",
      image: "/abu.jpg",
    },
    {
      emirate: "Ras Al Khaimah",
      label: "RAS AL KHAIMAH",
      title: "Things to do in RAK",
      description:
        "Adventure awaits. Jebel Jais flight, mountain hiking, and pristine beaches.",
      image: "/abu.jpg",
    },
    {
      emirate: "Fujairah",
      label: "FUJAIRAH",
      title: "Things to do in Fujairah",
      description:
        "The only emirate on the East Coast. Famous for snorkeling, diving, and serene beaches.",
      image: "/abu.jpg",
    },
    {
      emirate: "Ajman",
      label: "AJMAN",
      title: "Things to do in Ajman",
      description: "/abu.jpg",
    },
    {
      emirate: "Umm Al Quwain",
      label: "UMM AL QUWAIN",
      title: "Things to do in Umm Al Quwain",
      description:
        "Nature and tranquility. Explore mangroves, islands, and traditional dhow building.",
      image: "/abu.jpg",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <p className="text-yellow-500 font-medium uppercase tracking-wider text-sm flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              Destination Guide
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Explore the Emirates & Beyond
            </h2>
          </div>

          <button className="mt-6 md:mt-0 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2">
            Scroll to explore
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="overflow-x-scroll  -mx-6 px-6">
          <div className="overflow-x-scroll flex gap-6 pb-4 min-w-max">
            {destinations.map((dest) => (
              <div
                key={dest.emirate}
                className="relative w-80 flex-shrink-0 rounded-3xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105"
              >
                {/* Image */}
                <div className="aspect-[4/5] relative">
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                </div>

                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {dest.label}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">{dest.title}</h3>
                  <div className="w-12 h-1 bg-yellow-400 mb-4" />
                  <p className="text-sm leading-relaxed opacity-90">
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
