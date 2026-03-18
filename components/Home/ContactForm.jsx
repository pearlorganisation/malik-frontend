"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useCreateContactMutation } from "@/features/contact/contactApi.js";
import toast from "react-hot-toast";

const CallbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [createContact, { isLoading, isSuccess, error }] =
    useCreateContactMutation();

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

      // reset form after success
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
       toast.error("Failed to submit request");
    }
  };

  return (
    <div className="lg:mt-0">
      <div className="relative rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 p-0.5 shadow-2xl">
        <div className="relative h-full flex flex-col justify-between rounded-[14px] bg-white px-6 py-8 sm:p-10">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Quick Callback
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Leave your details, we'll call you right back.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
                <Clock className="h-3.5 w-3.5" />
                ~5 mins
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Name */}
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="block w-full rounded-xl bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="block w-full rounded-xl bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Phone */}
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className="block w-full rounded-xl bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Message */}
              <div className="relative group">
                <div className="pointer-events-none absolute left-0 top-4 pl-4">
                  <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="block w-full resize-none rounded-xl bg-gray-50 py-4 pl-12 pr-4 text-sm font-medium ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full rounded-xl bg-gray-900 py-4 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {isLoading ? "Submitting..." : "Request Callback"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                Fast Track Active
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
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
