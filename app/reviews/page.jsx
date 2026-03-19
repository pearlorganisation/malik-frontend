"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Star, TrendingUp } from "lucide-react";
import TrustSection from "@/components/Home/TrustSection";
import {
  useGetAllReviewsQuery,
  useGetReviewStatsQuery,
} from "@/features/review/reviewApi";

export default function ReviewsPage() {
const [page, setPage] = useState(1);
const [allReviews, setAllReviews] = useState([]);
  // ✅ API CALLS
  const { data: statsData } = useGetReviewStatsQuery();
 const { data: reviewData, isLoading, isFetching } = useGetAllReviewsQuery({
  page,
  limit: 4,
});
useEffect(() => {
  if (reviewData?.reviews) {
    setAllReviews((prev) => [...prev, ...reviewData.reviews]);
  }
}, [reviewData]);

  // ✅ DATA MAPPING
  const totalReviews = statsData?.totalReviews || 0;
  const averageRating = statsData?.avgRating || 0;
  const reviews = reviewData?.reviews || [];
  const handleLoadMore = () => {
  setPage((prev) => prev + 1);
};

  return (
    <div className="w-full pt-[90px] bg-[#F8FAFC] min-h-screen">
      
      {/* HERO SECTION */}
      <div className="max-w-[1320px] mx-auto px-4 lg:px-4 pb-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LEFT CONTENT */}
        <div className="max-w-[650px]">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-[10px] font-bold px-4 py-1.5 rounded-full mb-6">
            ✨ VERIFIED EXPERIENCES
          </div>

          <h1 className="text-[48px] leading-[50px] font-[900] text-slate-900 mb-6">
            Trusted by{" "}
            <span className="text-[#1D4ED8]">Thousands</span>
            <br />
            of Global Travelers
          </h1>

          <p className="text-slate-600 text-[16px] leading-[28px] max-w-[520px] font-medium">
            Read verified reviews from adventurers who explored the UAE with Fun Tours.
            We pride ourselves on safety, authenticity, and premium service.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 w-[300px] h-[220px] flex flex-col items-center justify-center text-center">
          
          <h2 className="text-[56px] font-[900] text-slate-900 leading-none">
            {averageRating}
          </h2>

          <div className="flex gap-1 my-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} className="text-yellow-400" fill="currentColor" />
            ))}
          </div>

          <p className="text-[11px] tracking-[0.15em] text-slate-400 font-bold uppercase">
            Based on {totalReviews.toLocaleString()}+ reviews
          </p>

          <div className="w-full h-px bg-slate-100 my-3"></div>

          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
              ✓
            </span>
            Verified Operator
          </div>
        </div>
      </div>

      <TrustSection />

      {/* REVIEWS SECTION */}
      <div className="max-w-[2020px] mx-auto px-4 lg:px-6 pb-20 mt-20">
  
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[22px] font-[800] text-slate-900">
            Recent verified feedback
          </h2>

          <div className="flex gap-3 flex-wrap">
            {["ALL", "WITH PHOTOS", "DESERT SAFARI", "YACHT CRUISE", "CITY TOURS"].map((item, i) => (
              <button
                key={i}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide border ${
                  i === 0
                    ? "bg-[#0F172A] text-white border-[#0F172A]"
                    : "text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="text-center py-20">Loading reviews...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {allReviews.map((review, index) => (
              <div
                key={review._id}
                className="bg-white border border-slate-200 rounded-[28px] p-8 shadow-sm min-h-[450px] hover:shadow-md transition"
              >
                
                {/* TOP */}
                <div className="flex justify-between items-start mb-6">
                  
                  {/* USER */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-blue-800">
                      {/* {review.user?.name?.charAt(0)} */}
                      {review.user?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-[15px] text-gray-900">
                       {review.user?.name || "User"}
                      </h3>
                      {/* <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
                   📍 {review.activity?.placeId?.name || "Dubai"},{" "}
{review.activity?.placeId?.country || "UAE"}
                      </p> */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold tracking-wide">
  <MapPin size={12} className="text-slate-400" />
  <span>
    {review.activity?.placeId?.name || "Dubai"},{" "}
    {review.activity?.placeId?.country || "UAE"}
  </span>
</div>
                    </div>
                  </div>

                  {/* RATING */}
                  <div className="text-right">
                 <div className="flex justify-end">
  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={14}
      className={`${
        i < review.rating ? "text-yellow-400" : "text-gray-300"
      }`}
      fill="currentColor"
    />
  ))}
</div>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
                <div className="flex items-center gap-1 mb-1">
  <TrendingUp size={12} className="text-blue-600" />
  <p className="text-[10px] font-bold text-blue-800 tracking-wider">
    EXPERIENCE
  </p>
</div>
                  <p className="text-[13px] font-bold text-slate-900">
                    {review.activity?.name || "Premium Experience"}
                  </p>
                </div>

                {/* COMMENT */}
                <p className="text-[14px] text-slate-600 font-[500] mb-6 leading-6 italic">
                  "{review.comment}"
                </p>

                {/* IMAGE (same logic preserved) */}
                {/* {review.images?.length > 0 && (
  <div className="w-[70px] h-[70px] rounded-xl overflow-hidden mb-5 shadow">
    <img
      src={review.images[0]?.secure_url}
      className="w-full h-full object-cover"
      alt="review"
    />
  </div>
)} */}

<div className="w-[70px] h-[70px] rounded-xl overflow-hidden mb-16 shadow">
  <img
    src={
      review.images?.[0]?.secure_url ||
      "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=400"
    }
    className="w-full h-full object-cover"
    alt="review"
  />
</div>
                {/* FOOTER */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 bg-green-50 text-green-600 text-[11px] font-bold px-3 py-1 rounded-full">
                    ✓ VERIFIED PURCHASE
                  </div>

                  <button className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 hover:text-slate-600">
                    👍 HELPFUL
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
     <div className="flex justify-center mt-16">
  <button
    onClick={handleLoadMore}
    disabled={isFetching}
    className="group flex items-center hover:shadow-md hover:-translate-y-[1px] gap-2 px-6 py-3 rounded-full border border-slate-300 text-[12px] font-bold tracking-wide text-slate-900 bg-white shadow-sm transition-all duration-300 hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] disabled:opacity-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-all duration-300 group-hover:text-white"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>

    {isFetching ? "LOADING..." : "VIEW MORE REVIEWS"}
  </button>
</div>
      </div>
    </div>
  );
}