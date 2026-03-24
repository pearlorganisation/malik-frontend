import React from 'react';
import { Star, ShieldCheck, CheckCircle } from 'lucide-react';

export default function TrustSection() {
  return (
    <section className="bg-[#003580] text-white py-8 md:py-6 relative overflow-hidden font-sans">
      {/* Background Pattern: Subtle dots to match the reference image */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Trusted by{' '}
            <span className="relative inline-block text-[#FFD700] px-2">
              30,000+
              {/* Custom SVG for the curved underline effect */}
              <svg 
                className="absolute left-0 bottom-0 w-full h-3 text-[#FFD700] transform translate-y-2" 
                viewBox="0 0 100 15" 
                preserveAspectRatio="none"
              >
                <path d="M0 8 Q 50 15 100 8" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>{' '}
            Travelers
          </h2>
          <p className="text-[#bfdbfe] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-4">
            #1 Rated Tour Operator in Dubai Across All Major Booking Platforms.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-12">
          
          {/* Trustpilot */}
          <ReviewCard 
             icon={<Star className="w-4 h-4 text-[#00b67a] fill-[#00b67a]" />}
             label="Trustpilot"
             rating="4.9"
             starsColor="text-[#00b67a] fill-[#00b67a]"
             subText="VERIFIED"
             subIcon={<CheckCircle className="w-3 h-3" />}
             subColor="text-[#00b67a]"
          />

          {/* GetYourGuide */}
          <ReviewCard 
             label="GetYourGuide"
             rating="4.8"
             starsColor="text-[#ff5533] fill-[#ff5533]"
             subText="24K+ REVIEWS"
             subColor="text-[#ff5533]"
             // Using first 4 filled, last one grey for 4.8 representation if desired, but image shows all filled mostly. 
             // We stick to fill for visual impact.
          />

          {/* Tripadvisor */}
          <ReviewCard 
             label="Tripadvisor"
             rating="5.0"
             customStars={
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-3 h-3 rounded-full bg-[#00aa6c]" />
                 ))}
               </div>
             }
             subText="TRAVELERS' CHOICE"
             subColor="text-[#00aa6c]"
          />

          {/* Google */}
          <ReviewCard 
             label="Google"
             rating="4.9"
             starsColor="text-[#fbbc05] fill-[#fbbc05]"
             subText="15K+ REVIEWS"
             subColor="text-[#4285f4]"
          />

          {/* Headout */}
          <ReviewCard 
             label="Headout"
             rating="4.9"
             starsColor="text-[#8b5cf6] fill-[#8b5cf6]"
             subText="EXCELLENT"
             subColor="text-[#8b5cf6]"
          />

          {/* Licensed Badge - Custom styling */}
          <div className="bg-[#1e40af] rounded-xl p-4 shadow-lg border border-blue-400/20 flex flex-col justify-between h-32 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-24 h-24 text-white" />
            </div>
            
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                <span className="text-xs font-bold text-white/90">Licensed</span>
            </div>
            
            <div className="mt-auto">
                <div className="text-3xl font-black text-white leading-none">100%</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-1">
                    Govt. Verified
                </div>
            </div>
          </div>

        </div>

        {/* Partners Footer */}
        <div className="border-t border-blue-400/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest whitespace-nowrap">
                Authorized Partner of
            </span>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                {["GetYourGuide", "Viator", "Booking.com", "Expedia", "Klook", "Headout"].map(partner => (
                    <span key={partner} className="text-sm md:text-lg font-bold text-white tracking-tight">
                        {partner}
                    </span>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}

function ReviewCard({ icon, label, rating, starsColor, customStars, subText, subIcon, subColor }) {
    return (
        <div className="bg-white text-gray-900 rounded-xl p-4 shadow-lg flex flex-col justify-between h-32 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-2">
                {icon}
                {label && <span className="text-xs font-bold text-gray-600">{label}</span>}
            </div>
            
            <div className="mt-2">
                <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-black leading-none">{rating}</span>
                    <div className="flex pb-0.5">
                        {customStars || [...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${starsColor}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className={`flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide ${subColor}`}>
                {subIcon}
                {subText}
            </div>
        </div>
    );
}
