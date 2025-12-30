"use client";
import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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
                <p className="text-slate-600 mt-1 text-lg">
                  +971 50 190 2213
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 group">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Email</h3>
                <p className="text-slate-600 mt-1 text-lg">
                  info@funtoursdubai.com
                </p>
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
        <div className="bg-gray-50 rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Have questions or ready to book? Drop us a message — your UAE adventure begins here!
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="Tour Inquiry"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your plans..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
