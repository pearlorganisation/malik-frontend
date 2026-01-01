import { Star } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="bg-blue-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Trusted by <span className="text-yellow-400">30,000+</span>{" "}
            Travelers
          </h2>
          <p className="text-lg md:text-xl text-blue-200">
            #1 RATED TOUR OPERATOR IN DUBAI ACROSS ALL MAJOR BOOKING PLATFORMS.
          </p>
        </div>

        {/* Rating Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {/* Trustpilot */}
          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-600">Trustpilot</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-3xl font-bold mr-2">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-green-500 text-green-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">VERIFIED</p>
          </div>

          {/* GetYourGuide */}
          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-600">GetYourGuide</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-3xl font-bold mr-2">4.8</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < 4
                        ? "w-5 h-5 fill-orange-500 text-orange-500"
                        : "w-5 h-5 fill-gray-300 text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-orange-600 font-medium">24K+ REVIEWS</p>
          </div>

          {/* Tripadvisor */}
          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-600">Tripadvisor</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-3xl font-bold mr-2">5.0</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-teal-500 text-teal-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-teal-600 font-medium uppercase">
              Travelers' Choice
            </p>
          </div>

          {/* Google */}
          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-600">Google</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-3xl font-bold mr-2">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">15K+ REVIEWS</p>
          </div>

          {/* Headout */}
          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium text-gray-600">Headout</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-3xl font-bold mr-2">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-purple-500 text-purple-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-purple-600 font-medium uppercase">
              Excellent
            </p>
          </div>

          {/* Licensed */}
          <div className="bg-blue-800 text-white rounded-2xl p-4 shadow-lg text-center">
            <p className="text-sm font-medium opacity-80">Licensed</p>
            <div className="my-4">
              <span className="text-4xl font-bold">100%</span>
            </div>
            <p className="text-xs uppercase font-medium opacity-80">
              Govt. Verified
            </p>
          </div>
        </div>

        {/* Partners */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider text-blue-300 mb-4">
            Authorized Partner of
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <span className="text-lg font-medium">GetYourGuide</span>
            <span className="text-lg font-medium">Viator</span>
            <span className="text-lg font-medium">Booking.com</span>
            <span className="text-lg font-medium">Expedia</span>
            <span className="text-lg font-medium">Klook</span>
            <span className="text-lg font-medium">Headout</span>
          </div>
        </div>
      </div>
    </section>
  );
}
