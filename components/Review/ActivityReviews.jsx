import { useState } from "react";
import {
  useGetActivityReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/features/review/reviewApi";
import { Star, MessageCircle, Users } from "lucide-react"; // Optional: lucide-react icons

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  size = "lg",
}) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className={`flex gap-1 ${interactive ? "cursor-pointer" : ""}`}>
      {stars.map((star) => (
        <Star
          key={star}
          className={`${sizeClasses} transition-all duration-200 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${
            interactive
              ? "hover:fill-yellow-400 hover:text-yellow-400 hover:scale-110"
              : ""
          }`}
          onClick={() => interactive && onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const ActivityReviews = ({ activityId }) => {
  const { data, isLoading, error } = useGetActivityReviewsQuery(activityId);
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const reviews = data?.reviews || data || [];
  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

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
    } catch (err) {
      console.error("Review action failed", err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview({ id, activityId }).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-16">
        <p className="text-red-600 text-lg">
          Failed to load reviews. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-12 mx-auto p-6 space-y-12">
      {/* Header with Average Rating */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        {totalReviews > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <div className="text-left">
                <p className="text-5xl font-bold text-gray-900">
                  {averageRating}
                </p>
                <p className="text-gray-600">out of 5 stars</p>
              </div>
            </div>
            <p className="text-gray-600 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg border border-blue-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          {editingId ? "Edit Your Review" : "Write a Review"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Your Rating
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Your Experience
            </label>
            <textarea
              placeholder="Tell us what you loved about this activity... What made it special?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={5}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {editingId ? "Update Review" : "Publish Review"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setRating(5);
                  setComment("");
                }}
                className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-300">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No reviews yet
              </h3>
              <p className="text-gray-600 text-lg">
                Be the first to share your experience and help others discover
                this activity!
              </p>
            </div>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {review.rating}.0
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(review)}
                    className="px-5 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-full hover:bg-indigo-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-5 py-2 bg-red-100 text-red-700 font-medium rounded-full hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mt-6 italic">
                "{review.comment}"
              </p>

              {/* Optional: Add reviewer name/date if available in future */}
              {/* <p className="text-sm text-gray-500 mt-6">— Anonymous • Just now</p> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityReviews;
