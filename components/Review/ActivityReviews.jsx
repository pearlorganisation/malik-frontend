"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetActivityReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/features/review/reviewApi";
import {
  Star,
  MessageSquarePlus,
  Trash2,
  Edit2,
  ThumbsUp,
} from "lucide-react";

/* ---------------- STAR RATING ---------------- */
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

/* ---------------- MAIN COMPONENT ---------------- */
const ActivityReviews = ({ activityId }) => {
  const { data, isLoading, error } = useGetActivityReviewsQuery(activityId);

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const currentUser = useSelector((state) => state.auth?.user);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  /* ---------------- DATA ---------------- */
  const reviews = useMemo(() => {
    const list = data?.reviews || [];
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data]);

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  /* ---------------- HANDLERS ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      if (editingId) {
        await updateReview({
          id: editingId,
          activityId,
          data: { rating, comment },
        }).unwrap();
      } else {
        await createReview({ activityId, rating, comment }).unwrap();
      }

      setRating(5);
      setComment("");
      setEditingId(null);
      setIsFocused(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setIsFocused(true);
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    await deleteReview({ id, activityId }).unwrap();
  };

  /* ---------------- STATES ---------------- */
  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load reviews
      </div>
    );
  }

  const userInitials = currentUser?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 space-y-5">
  {/* HEADER */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Customer Reviews
      </h2>
      <p className="text-gray-500 mt-1 text-xs md:text-sm">
        Genuine feedback from verified users
      </p>
    </div>

    {totalReviews > 0 && (
      <div className="flex items-center gap-3 bg-white border rounded-lg px-3 py-2 text-xs md:text-sm">
        <div className="text-center">
          <div className="text-xl font-bold">{averageRating}</div>
          <div className="text-[10px] text-gray-400">out of 5</div>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div>
          <StarRating rating={Math.round(averageRating)} size="sm" />
          <p className="text-[10px] text-gray-500 mt-0.5">{totalReviews} reviews</p>
        </div>
      </div>
    )}
  </div>

  {/* REVIEW FORM */}
  <div id="review-form" className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-xs">
          {userInitials}
        </div>
        <span className="text-gray-700 font-medium text-xs md:text-sm">Write a review</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        YOUR RATING
        <div className="flex items-center gap-1">
          <StarRating rating={rating} onRatingChange={setRating} interactive size="sm" />
          <span className="text-xs text-amber-600 font-medium">
            {rating === 1 ? "Poor" : rating === 5 ? "Excellent" : ""}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="w-full px-3 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 resize-none text-xs md:text-sm"
        />

        <div className="flex justify-end gap-2 mt-2">
          {(editingId || comment.trim()) && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setComment("");
                setRating(5);
                setIsFocused(false);
              }}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isCreating || isUpdating || !comment.trim()}
            className="px-4 py-1.5 rounded-md bg-amber-600 text-white text-xs font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isCreating || isUpdating ? "Submitting..." : editingId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* REVIEWS LIST */}
  <div className="space-y-4">
    {reviews.map((review) => {
      const isOwner = currentUser?._id === review.user?._id;
      const initials = review.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div key={review._id} className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
            {initials}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex justify-between text-xs md:text-sm">
              <div>
                <p className="font-semibold">{review.user?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-[10px] text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-1 hover:bg-blue-50 rounded-sm"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-1 hover:bg-red-50 rounded-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-1 text-gray-600 leading-snug text-xs md:text-sm">{review.comment}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>
  );
};

export default ActivityReviews;