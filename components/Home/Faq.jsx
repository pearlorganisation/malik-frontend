"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";

// FAQ Data
const FAQS = [
  {
    question: "What is included in the Desert Safari?",
    answer:
      "Our standard package is all-inclusive: centralized pick-up, 45 mins of dune bashing, camel riding, sandboarding, unlimited refreshments, and a full BBQ dinner with live shows.",
  },
  {
    question: "Is the dune bashing safe for children?",
    answer:
      "Yes, it is generally safe. However, we recommend it for children above 3 years old. We can also arrange a smoother ride for families with small children.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can cancel up to 24 hours in advance for a full refund. Cancellations made within 24 hours are non-refundable.",
  },
  {
    question: "Do you provide vegetarian food options?",
    answer:
      "Absolutely! Our BBQ dinner buffet includes a wide variety of vegetarian and vegan options, including salads, grilled vegetables, and traditional dishes.",
  },
];

// Individual FAQ Item Component with JS Animation
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // JavaScript logic to calculate the exact height for smooth animation
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-5 text-left focus:outline-none"
      >
        <span
          className={`text-base font-bold transition-colors duration-200 ${
            isOpen ? "text-blue-600" : "text-gray-900 group-hover:text-blue-600"
          }`}
        >
          {question}
        </span>
        <span className="ml-6 shrink-0">
          {isOpen ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-transform duration-200">
              <Minus className="h-3 w-3" strokeWidth={3} />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-gray-400 transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </div>
          )}
        </span>
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pb-6 pr-4 sm:pr-12">
          <p className="text-sm leading-relaxed text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {/* FAQ Column */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Common Questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to know before booking.
            </p>

            <div className="mt-10">
              {FAQS.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>

          {/* Form Column - Styled like the requested image */}
          <div className="lg:mt-0">
            {/* Gradient Border Card */}
            <div className="relative rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 p-[2px] shadow-2xl">
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
                  <form className="mt-8 space-y-4">
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <User className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                      </div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm font-medium transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm font-medium transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Phone className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        className="block w-full rounded-xl border-0 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm font-medium transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-gray-900 px-3 py-4 text-sm font-bold text-white shadow-lg hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Request Callback
                    </button>
                  </form>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                    </div>
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
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
