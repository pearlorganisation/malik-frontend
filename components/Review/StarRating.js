"use client";
import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  size = "sm",
  className = "",
}) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
    xl: "w-8 h-8",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`transition-all ${
            interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
        >
          <Star
            className={`${sizeMap[size]} ${
              star <= rating
                ? "fill-amber-500 text-amber-500"
                : "fill-gray-200 text-gray-300"
            }`}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;