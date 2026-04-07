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
      toast.success("Request submitted successfully");
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      toast.error("Failed to submit request");
      toast.error("Failed to submit request");
    }
  };

  return (
    <div className="w-full"> {/* Removed max-w-md to allow it to be wider */}
      <div className="relative rounded-[2rem] bg-gradient-to-r from-blue-600 via-purple-500 via-pink-500 to-amber-400 p-[1px] shadow-xl">
        <div className="relative h-full flex flex-col justify-between rounded-[1.9rem] bg-white px-8 py-6">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Quick Callback
              </h3>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/10">
                <Clock className="h-3 w-3" />
                ~5 mins
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-8">
              Leave your details, we'll call you right back.
            </p>

            {/* Form - Adjusted spacing to be more compact */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="block w-full rounded-xl bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm font-semibold text-slate-700 border border-slate-100 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="block w-full rounded-xl bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm font-semibold text-slate-700 border border-slate-100 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className="block w-full rounded-xl bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm font-semibold text-slate-700 border border-slate-100 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Button - Darker Navy */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 rounded-xl bg-[#0a0f1c] py-3 text-sm font-bold text-white shadow-lg hover:bg-black active:scale-[0.99] transition-all disabled:opacity-60"
              >
                {isLoading ? "Submitting..." : "Request Callback"}
              </button>
            </form>
          </div>

          {/* Footer - Matching Image exactly */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                Fast Track Active
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
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