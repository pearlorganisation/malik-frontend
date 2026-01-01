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
  }),
});

export const {
  useCreateReviewMutation,
  useGetActivityReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
