"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is the best time to visit Dubai?",
    a: "The best time to visit Dubai is from November to March when the weather is pleasant and ideal for outdoor activities.",
  },
  {
    q: "Are desert safaris safe?",
    a: "Yes, all desert safaris are conducted by licensed professionals following strict safety standards.",
  },
  {
    q: "Do you offer hotel pickup?",
    a: "Yes, most of our tours include complimentary hotel pickup and drop-off services.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">

        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-500 text-center mt-3">
          Everything you need to know before booking your Dubai tour
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <button
                onClick={() => setActive(active === index ? null : index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900"
              >
                {item.q}
                <span className="text-xl">
                  {active === index ? "−" : "+"}
                </span>
              </button>

              {active === index && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
