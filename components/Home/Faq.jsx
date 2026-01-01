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
import CallbackForm from "@/components/Home/ContactForm.jsx";

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
           <CallbackForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
