"use client";
import React, { useState } from "react";
import { User, Mail, Phone, Clock, ShieldCheck } from "lucide-react";
import { useCreateContactMutation } from "@/features/contact/contactApi.js";
import toast from "react-hot-toast";

const CallbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(formData).unwrap();
      toast.success("Request submitted successfully");
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  return (
    <div className="w-full max-w-[450px] mx-auto lg:ml-auto">
      {/* Gradient Border Wrapper */}
      <div className="relative rounded-[20px] p-[1.5px] bg-gradient-to-br from-blue-600 via-purple-500 to-orange-400 shadow-lg">
        <div className="relative rounded-[19px] bg-white p-5 sm:p-7">
          {/* Header - Reduced margin bottom */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Quick Callback
              </h3>
              <p className="mt-0.5 text-[12px] text-gray-500 font-medium">
                Leave your details, we'll call you right back.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-inset ring-green-600/10">
              <Clock className="h-3 w-3" />
              ~5 mins
            </div>
          </div>

          {/* Form Fields - space-y-2 for tighter layout */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="block w-full rounded-xl bg-gray-50/50 py-3 pl-10 pr-4 text-sm font-medium border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="block w-full rounded-xl bg-gray-50/50 py-3 pl-10 pr-4 text-sm font-medium border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="block w-full rounded-xl bg-gray-50/50 py-3 pl-10 pr-4 text-sm font-medium border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            {/* Button - Reduced py-3 */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#0f172a] py-3.5 text-sm font-bold text-white hover:bg-black transition-colors active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? "Processing..." : "Request Callback"}
            </button>
          </form>

          {/* Footer - Reduced margin and padding */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                Fast Track Active
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallbackForm;