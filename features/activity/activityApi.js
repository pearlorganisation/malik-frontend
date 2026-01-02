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

        // Support multiple categories
        if (categories) {
          const categoryParam = Array.isArray(categories)
            ? categories.join(",")
            : categories;
          params.append("categories", categoryParam);
        }

        if (duration) params.append("duration", duration);
        if (location) params.append("location", location);

        return `/activity?${params.toString()}`;
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
      query: (id) => `/activity/${id}`,
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
  useGetPopularActivitiesQuery,
  useGetPopularLocationsQuery, // ✅ NEW
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useToggleActivityStatusMutation,
} = activityApi;
