import { baseApi } from "@/services/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= CREATE REVIEW ================= */
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
      ],
    }),

    /* ================= GET REVIEWS BY ACTIVITY ================= */
    getActivityReviews: builder.query({
      query: (activityId) => ({
        url: `/reviews/activity/${activityId}`,
        method: "GET",
      }),
      providesTags: (result, error, activityId) => [
        { type: "Reviews", id: activityId },
      ],
    }),

    /* ================= UPDATE REVIEW ================= */
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
      ],
    }),

    /* ================= DELETE REVIEW ================= */
    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
      ],
    }),
    // ✅ ADD THESE

/* ================= GET ALL REVIEWS ================= */
getAllReviews: builder.query({
  query: ({ page = 1, limit = 5 }) => ({
    url: `/reviews/all?page=${page}&limit=${limit}`,
    method: "GET",
  }),
  providesTags: ["Reviews"],
}),

/* ================= GET REVIEW STATS ================= */
getReviewStats: builder.query({
  query: () => ({
    url: `/reviews/stats`,
    method: "GET",
  }),
  providesTags: ["Reviews"],
}),
  }),
});

export const {
  useCreateReviewMutation,
  useGetActivityReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
    useGetAllReviewsQuery,
  useGetReviewStatsQuery,
} = reviewApi;
