import React from "react";

function Footer() {
  return (
    <footer className="bg-[#0B0F1A] text-gray-400">
      
      <div className="max-w-7xl mx-auto px-4 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <h4 className="text-xl font-semibold text-white">
            Dubai<span className="text-emerald-500">Tours</span>
          </h4>
          <p className="text-sm mt-3 leading-relaxed">
            Your trusted partner for unforgettable Dubai travel experiences.
            Discover tours, adventures, and luxury experiences with ease.
          </p>
        </div>

        {/* Links */}
        <div>
          <h5 className="text-white font-semibold mb-4">Company</h5>
          <ul className="space-y-2 text-sm">
            {["Home", "About Us", "Tours", "Contact"].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="text-white font-semibold mb-4">Support</h5>
          <ul className="space-y-2 text-sm">
            {["FAQs", "Privacy Policy", "Terms & Conditions"].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="text-white font-semibold mb-4">Contact</h5>
          <p className="text-sm">Email: info@dubaitours.com</p>
          <p className="text-sm mt-1">Phone: +971 000 0000</p>
          <p className="text-sm mt-1">Dubai, UAE</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6 text-center text-sm">
        © {new Date().getFullYear()} DubaiTours. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
