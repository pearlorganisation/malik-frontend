import { baseApi } from "@/services/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    /* ================= CREATE REVIEW ================= */
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      // Invalidate both specific activity list and the global admin list
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    /* ================= GET REVIEWS BY ACTIVITY (Public) ================= */
    getActivityReviews: builder.query({
  query: (activityId) => `/reviews/activity/${activityId}`,
  providesTags: (result, error, activityId) => 
    result 
      ? [
          ...result.reviews.map(({ _id }) => ({ type: "Reviews", id: _id })),
          { type: "Reviews", id: activityId },
          { type: "Reviews", id: "LIST" }
        ]
      : [{ type: "Reviews", id: activityId }],
}),

    /* ================= UPDATE REVIEW (User) ================= */
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    /* ================= DELETE REVIEW (User/Owner) ================= */
    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      // Frontend se mutation call karte waqt 'activityId' bhi pass karna hoga
      invalidatesTags: (result, error, { activityId }) => [
        { type: "Reviews", id: activityId },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    /* ================= GET ALL REVIEWS (Admin Panel) ================= */
    getAllReviews: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/reviews/all`,
        method: "GET",
        params: { page, limit }, // Template literal se behtar params object hai
      }),
      // Unique tag for Admin list refresh
      providesTags: (result) => 
        result 
          ? [...result.reviews.map(({ _id }) => ({ type: "Reviews", id: _id })), { type: "Reviews", id: "LIST" }]
          : [{ type: "Reviews", id: "LIST" }],
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