import { baseApi } from "@/services/baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. CREATE: Final Booking Request (User Side)
    createTour: builder.mutation({
      query: (data) => ({
        url: "/tours/create",
        method: "POST",
        body: data,
      }),
      // Booking create hone ke baad list ko refresh karne ke liye
      invalidatesTags: ["Tours"],
    }),

    // 2. READ: Get All Bookings (Admin Dashboard)
    getAllTours: builder.query({
      query: () => ({
        url: "/tours/all",
        method: "GET",
      }),
      providesTags: ["Tours"],
    }),

    // 3. READ: Get Single Booking Details
    getTourById: builder.query({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tours", id }],
    }),

    // 4. DELETE: Remove a Booking (Admin Side)
    deleteTour: builder.mutation({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tours"],
    }),

  }),
});

// Hooks export for frontend components
export const {
  useCreateTourMutation,
  useGetAllToursQuery,
  useGetTourByIdQuery,
  useDeleteTourMutation,
} = tourApi;