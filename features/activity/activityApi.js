import { baseApi } from "@/services/baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= GET ALL ACTIVITIES =================
   getActivities: builder.query({
  query: ({
    page = 1,
    limit = 10,
    isActive,
    categories,
    duration,
    location,
  } = {}) => {
    const params = new URLSearchParams({ page, limit });

    if (isActive !== undefined) params.append("isActive", isActive);
    if (categories) {
      params.append(
        "categories",
        Array.isArray(categories) ? categories.join(",") : categories
      );
    }
    if (duration) params.append("duration", duration);
    if (location) params.append("location", location);

    return `/activity/search?${params.toString()}`;
  },
  providesTags: ["Activity"],
}),

    // ================= GET ACTIVITIES BY CATEGORY (NEW) =================
    getActivitiesByCategory: builder.query({
      query: ({ category, limit = 10, page = 1 }) => {
        if (!category) {
          throw new Error("category is required");
        }

        const params = new URLSearchParams({ limit, page });

        return `/activity/category/${category}?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),
    // ================= POPULAR ACTIVITIES =================
    getPopularActivities: builder.query({
      query: ({ limit = 10 } = {}) => {
        const params = new URLSearchParams({ limit });
        return `/activity/popular?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    // ================= POPULAR LOCATIONS (NEW) =================
    getPopularLocations: builder.query({
      query: ({ limit = 10 } = {}) => {
        const params = new URLSearchParams({ limit });
        return `/activity/popular-locations?${params.toString()}`;
      },
      providesTags: ["Activity"],
    }),

    // ================= GET SINGLE ACTIVITY =================
   getActivityById: builder.query({
  query: (id) => `/activity/get-activity/${id}`,
  providesTags: (result, error, id) => [{ type: "Activity", id }],
}),

    // ================= CREATE ACTIVITY =================
    createActivity: builder.mutation({
      query: (data) => ({
        url: "/activity",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Activity"],
    }),

    // ================= UPDATE ACTIVITY =================
    updateActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/activity/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Activity"],
    }),

    // ================= DELETE ACTIVITY =================
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),

    // ================= TOGGLE ACTIVE STATUS =================
    toggleActivityStatus: builder.mutation({
      query: (id) => ({
        url: `/activity/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivitiesByCategoryQuery,
  useGetPopularActivitiesQuery,
  useGetPopularLocationsQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useToggleActivityStatusMutation,
} = activityApi;
