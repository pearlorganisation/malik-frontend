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
    <div className="max-w-7xl mx-auto px-4 mt-16 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            Customer Reviews
          </h2>
          <p className="text-gray-500 mt-1">
            Genuine feedback from verified users
          </p>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-6 bg-white border rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating}</div>
              <div className="text-xs text-gray-400">out of 5</div>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div>
              <StarRating rating={Math.round(averageRating)} size="md" />
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews} reviews
              </p>
            </div>
          </div>
        )}
      </div>

      {/* REVIEW FORM - MATCHING THE IMAGE DESIGN */}
      <div
        id="review-form"
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Header with Avatar and Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-sm">
              {userInitials}
            </div>
            <span className="text-gray-700 font-medium">
              Write a review
            </span>
          </div>

          {/* Rating Row */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">YOUR RATING</div>
            <div className="flex items-center gap-3">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                interactive
                size="lg"
              />
              <span className="text-sm text-amber-600 font-medium">
                {rating === 1 ? "Poor" : rating === 5 ? "Excellent" : ""}
              </span>
            </div>
          </div>

          {/* Textarea */}
          <form onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Share your experience with us. What did you enjoy the most?"
              className="w-full px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 resize-none transition-all"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              {(editingId || comment.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setComment("");
                    setRating(5);
                    setIsFocused(false);
                  }}
                  className="px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isCreating || isUpdating || !comment.trim()}
                className="px-8 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isCreating || isUpdating
                  ? "Submitting..."
                  : editingId
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* REVIEWS LIST - UNCHANGED FROM YOUR ORIGINAL */}
      <div className="space-y-10">
        {reviews.map((review) => {
          const isOwner = currentUser?._id === review.user?._id;

          const initials = review.user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={review._id} className="flex gap-5">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                {initials}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{review.user?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {review.comment}
                </p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityReviews;