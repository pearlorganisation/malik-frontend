"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetActivityReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/features/review/reviewApi";
import StarRating from "@/components/Review/StarRating"; 
import { Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

const ActivityReviews = ({ activityId }) => {
  const { data, isLoading, error } = useGetActivityReviewsQuery(activityId);
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const currentUser = useSelector((state) => state.auth?.user);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const reviews = useMemo(() => {
    const list = data?.reviews || [];
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

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
        toast.success("Review updated!");
      } else {
        await createReview({ activityId, rating, comment }).unwrap();
        toast.success("Review posted successfully!");
      }

      // Success hone par erase karein
      setRating(5);
      setComment("");
      setEditingId(null);

    } catch (err) {
      // 1. Error message toast mein dikhayein
      const errorMessage = err?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage); 

      // 2. ✅ Catch mein aate hi jo usne likha hai use erase (reset) kar dein
      setRating(5);
      setComment("");
      setEditingId(null);
      
      console.log("Mutation Error:", err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
        await deleteReview({ id, activityId }).unwrap();
        toast.success("Review deleted");
    } catch (err) {
        toast.error("Failed to delete review");
    }
  };

  if (isLoading) return <div className="py-10 text-center text-gray-500">Loading reviews...</div>;
  if (error) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 space-y-5">
      {/* Average Rating Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
            <span className="font-bold">{averageRating}</span>
            <StarRating rating={Math.round(averageRating)} size="sm" />
          </div>
        )}
      </div>

      {/* Review Form (Inline) */}
      <div id="review-form" className="bg-white rounded-xl shadow border p-4">
        <span className="text-xs font-bold text-gray-400 uppercase">Write a review</span>
        <div className="my-2">
          <StarRating rating={rating} onRatingChange={setRating} interactive size="sm" />
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience..."
            className="w-full p-3 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2 mt-2">
            {/* Cancel Button agar Edit mode mein hai */}
            {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setComment(""); setRating(5); }}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                    Cancel
                </button>
            )}
            <button 
               type="submit" 
               disabled={isCreating || isUpdating}
               className="px-6 py-2 bg-blue-700 text-white text-xs font-bold rounded-md hover:bg-blue-800 disabled:opacity-50"
            >
              {isCreating || isUpdating ? "Processing..." : editingId ? "Update Review" : "Post Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="flex gap-3 border-b pb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xs">
              {r.user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm">{r.user?.name}</p>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                {currentUser?._id === r.user?._id && (
                  <div className="flex gap-2 text-gray-400">
                    <button onClick={() => handleEdit(r)} className="hover:text-blue-600">
                        <Edit2 size={14}/>
                    </button>
                    <button onClick={() => handleDelete(r._id)} className="hover:text-red-600">
                        <Trash2 size={14}/>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityReviews;