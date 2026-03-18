"use client";
import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Headphones } from 'lucide-react';
import CallbackForm from "@/components/Home/ContactForm"

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header / Hero Section */}
      <div className="bg-[#f8fafc] py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0047AB] text-[10px] font-bold uppercase tracking-widest mb-4 border border-blue-100">
              <Headphones className="w-3 h-3" /> 24/7 Premium Support
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Let's Plan Your <br />
              <span className="text-[#0047AB]">Dubai Adventure</span>
            </h1>
            <p className=" text-slate-500 font-medium leading-relaxed max-w-xl">
              Have questions about our tours or need a custom itinerary? Our local experts are standing by to help you create unforgettable memories.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-4xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0047AB] mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Call Us</h3>
                <a href="tel:+971501902213" className="text-lg font-black text-slate-900 hover:text-[#0047AB] transition-colors">+971 50 190 2213</a>
                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase">Standard rates apply</p>
              </div>

              <div className="bg-white rounded-4xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-6">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">WhatsApp</h3>
                <a href="https://wa.me/971501902213" target="_blank" className="text-lg font-black text-slate-900 hover:text-green-500 transition-colors">Chat Instantly</a>
                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase">Avg response: 5 mins</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Office</h3>
                  <p className="text-base font-bold text-slate-900">Deira, Dubai, UAE</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">Office 213, Port Saeed, Opposite City Centre Deira, Dubai, UAE.</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div className="text-sm font-bold text-slate-700">09:00 AM - 09:00 PM <span className="text-slate-400 font-medium ml-2">(Mon - Sat)</span></div>
                </div>
              </div>
              <div className="mt-10 rounded-3xl overflow-hidden h-48 border border-slate-100 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=800" className="w-full h-full object-cover" alt="Dubai" />
              </div>
            </div>
          </div>

          {/* Right Column: Callback Form Component */}
          <div className="lg:col-span-7">
            <CallbackForm />
          </div>

        </div>
      </div>

      {/* Footer Trust Banner */}
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#0f172a] rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-3xl font-black mb-4">Official DTCM <br /><span className="text-orange-400">Licensed Partner</span></h3>
              <p className="text-slate-400 font-medium text-sm">Registered tourism operator in Dubai, ensuring high standards since 2002.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Happy Guests', val: '30k+' },
                { label: 'Desert Camp', val: 'Own' },
                { label: 'Years Expertise', val: '22+' }
              ].map((stat, idx) => (
                <div key={idx} className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-30">
                  <div className="text-2xl font-black mb-1">{stat.val}</div>
                  <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;