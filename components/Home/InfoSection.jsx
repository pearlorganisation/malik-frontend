import React from "react";
import {
  Users,
  Gem,
  Clock,
  TicketPercent,
  ShieldCheck,
  Award,
  Star,
  Sparkles,
} from "lucide-react";

const FunToursHero = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-10 py-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[10px] font-black uppercase tracking-wider  shadow-sm mb-4">
              <Sparkles className="w-3 h-3 text-orange-500" />
              Why Choose Fun Tours
            </span>

            <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900">
              Not just a tour.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                An Unforgettable Memory.
              </span>
            </h1>
          </div>

          <div className="md:text-right max-w-sm">
            <p className="text-sm font-semibold text-slate-600 mb-2">
              Join over{" "}
              <span className="font-black text-slate-900">20,000 travelers</span>{" "}
              who discovered the real Dubai with our expert guides.
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span className="w-8 h-0.5 bg-orange-400" />
              Since 2002
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* BLUE CARD - FIXED WITH MISSING BADGE */}
          <div className="lg:col-span-2 bg-blue-700 text-white rounded-[28px] p-6 relative overflow-hidden shadow-xl group">
            <div className="absolute bottom-[-30px] right-[-30px] w-56 h-56 opacity-10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path
                  d="M100 180 Q180 100 100 20 Q20 100 100 180"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black">Your Dubai Family</h3>
                </div>

                <p className="text-sm text-blue-100 max-w-md leading-relaxed">
                  We don’t just drive you around. We welcome you into our culture.
                  Authentic, safe, and treated with genuine Emirati hospitality
                  since 2002.
                </p>
              </div>

              {/* Added Missing Badge */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                 <div className="flex -space-x-3 pl-1">
                            {[1,2,3,4].map((i) => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 25}`} alt="Guest" className="w-8 h-8 rounded-full border-[2px] border-fun-blue" />
                            ))}
                        </div>
                </div>
                <div className="bg-white text-blue-700 rounded-full px-4 py-2 text-xs font-black">
                  20k+ HAPPY GUESTS
                </div>
              </div>
            </div>
          </div>

          {/* YELLOW CARD */}
          <div className="bg-yellow-400 rounded-[28px] p-6 text-slate-900 shadow-xl flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6">
              <Gem className="w-full h-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Gem className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-black">Premium Experience</h3>
              </div>

              <p className="text-xs font-semibold text-slate-800 mb-4">
                No cut corners. Luxury 4×4s, gourmet food, and licensed guides.
              </p>
            </div>

            <div className="space-y-2 relative z-10">
              {[ 
                { icon: ShieldCheck, text: "Insured & Safe" },
                { icon: Award, text: "Award Winning" },
                { icon: Star, text: "4.9/5 Rated" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-yellow-200/70 rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-bold"
                >
                  <item.icon className="w-4 h-4" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            
            {/* SUPPORT */}
            <div className="bg-green-500 text-white rounded-[28px] p-10 relative overflow-hidden shadow-xl group">
              <Clock className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 transition-transform duration-500 group-hover:translate-x-2 group-hover:rotate-12" />
              <h3 className="text-lg font-black">24/7 Support</h3>
              <p className="text-xs font-bold text-green-50">
                WhatsApp us anytime.
              </p>
            </div>

            {/* DEALS */}
            <div className="bg-red-500 text-white rounded-[28px] p-10 relative overflow-hidden shadow-xl group">
              <TicketPercent className="absolute -bottom-6 -right-6 w-28 h-28 opacity-15 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
              <h3 className="text-lg font-black">Group Deals</h3>
              <p className="text-xs font-bold text-red-100">
                Save up to 30%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunToursHero;