import React from "react";

function About() {
  return (
    <section id="about" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">

        {/* IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
            alt="Dubai skyline"
            className="rounded-3xl shadow-2xl w-full object-cover"
          />

          {/* EXPERIENCE BADGE */}
          <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white px-7 py-5 rounded-2xl shadow-xl hidden sm:block">
            <p className="text-xl font-semibold">10+ Years</p>
            <p className="text-sm text-slate-300">Industry Experience</p>
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">
            About Us
          </span>

          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 leading-tight">
            Premium Dubai Travel,
            <br className="hidden sm:block" />
            Designed Around You
          </h3>

          <p className="text-slate-600 mt-6 leading-relaxed">
            At <strong>DubaiTours</strong>, we curate world-class travel
            experiences that reflect the elegance, adventure, and luxury of
            Dubai. Every tour is crafted to deliver comfort, safety, and
            unforgettable memories.
          </p>

          <p className="text-slate-600 mt-4 leading-relaxed">
            From breathtaking desert safaris to iconic city landmarks and
            private yacht experiences, our local experts ensure every detail is
            flawlessly executed.
          </p>

          {/* FEATURES */}
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {[
              "Hand-picked experiences with verified local experts",
              "Transparent pricing with best value guarantee",
              "Seamless booking & instant confirmation",
              "Dedicated 24/7 customer support",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-semibold">
                  ✓
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button className="mt-12 inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-indigo-600 transition duration-300 shadow-md">
            Explore Our Tours
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
