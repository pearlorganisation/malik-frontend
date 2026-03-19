"use client";
import { useState } from "react";
import { useCreateReviewMutation } from "@/features/review/reviewApi";
import toast from "react-hot-toast";

export default function ReviewModal({ isOpen, onClose, activityId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async () => {
    if (!comment) return toast.error("Please write a comment");

    try {
      await createReview({
        activityId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review added successfully 🎉");
      setComment("");
      setRating(5);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-5 shadow-xl">
        
        <h2 className="text-lg font-bold mb-4">Write a Review</h2>

        {/* Rating */}
        <div className="mb-3">
          <label className="text-sm font-semibold">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full mt-1 border rounded-lg p-2 text-sm"
          >
            {[1,2,3,4,5].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full mt-1 border rounded-lg p-2 text-sm"
            placeholder="Write your experience..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-md bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-3 py-1 text-sm rounded-md bg-black text-white"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}