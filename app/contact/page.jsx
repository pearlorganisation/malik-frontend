"use client";
import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import CallbackForm from "@/components/Home/ContactForm"; 

export default function ContactSection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              We’d love to help
            </h2>
            <p className="text-lg text-slate-500">
              Crafting Unforgettable Adventures Together
            </p>
          </div>

          <div className="space-y-8">
            {/* Phone */}
            <div className="flex items-start gap-4 group">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Phone</h3>
                <p className="text-slate-600 mt-1 text-lg">+971 50 190 2213</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 group">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Email</h3>
                <p className="text-slate-600 mt-1 text-lg">info@funtoursdubai.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 group">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Address</h3>
                <p className="text-slate-600 mt-1 text-lg leading-relaxed max-w-xs">
                  B Auto Center - Office 213 Block - near ENOC - Port Saeed - Dubai
                </p>
              </div>
            </div>

            {/* Open Time */}
            <div className="flex items-start gap-4 group">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Open Time</h3>
                <div className="mt-2 text-slate-600 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span className="font-medium">Mon - Sat:</span>
                  <span>7:00 AM - 01:00 AM (GST +4)</span>
                  <span className="font-medium">Online:</span>
                  <span className="text-green-600 font-semibold">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
          <CallbackForm />
        
      </div>
    </section>
  );
}
