import { baseApi } from "@/services/baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query({
      query: ({
        page = 1,
        limit = 10,
        isActive,
        categoryId,
        duration,
        location,
        slug
      } = {}) => {
        const params = new URLSearchParams({ page, limit: limit.toString() });

        if (isActive !== undefined) params.append("isActive", isActive);
        if (categoryId) params.append("categoryId", categoryId);
        if (duration) params.append("duration", duration);
        if (location) params.append("place", location);
        if (slug) params.append("slug", slug);

        return `/activity/search?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    getActivitiesByCategory: builder.query({
      query: ({ category, limit = 10, page = 1 }) => {
        const params = new URLSearchParams({ limit, page });
        return `/activity/category/${category}?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    getPopularActivities: builder.query({
      query: ({ limit = 10 } = {}) => {
        const params = new URLSearchParams({ limit });
        return `/activity/popular?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    getActivityById: builder.query({
      query: (id) => `/activity/get-activity/${id}`,
      providesTags: (result, error, id) => [{ type: "Activity", id }],
    }),

    createActivity: builder.mutation({
      query: (data) => ({ url: "/activity", method: "POST", body: data }),
      invalidatesTags: ["Activity"],
    }),

    updateActivity: builder.mutation({
      query: ({ id, data }) => ({ url: `/activity/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Activity"],
    }),

    deleteActivity: builder.mutation({
      query: (id) => ({ url: `/activity/${id}`, method: "DELETE" }),
      invalidatesTags: ["Activity"],
    }),

    getTopRatedActivities: builder.query({
      query: () => ({ url: "/activity/top-rated", method: "GET" }),
      providesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivitiesByCategoryQuery,
  useGetPopularActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetTopRatedActivitiesQuery
} = activityApi;