import { baseApi } from "@/services/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    // 1. User: Create Booking
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings", "MyBookings"],
    }),

    // 2. User: Confirm Payment (Stripe Verification)
    confirmBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/confirm-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings", "MyBookings"],
    }),

    // 3. User: Get My Bookings (Dashboard)
    getMyBookings: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/bookings/my-bookings",
        method: "GET",
        params: { page, limit, status },
      }),
      providesTags: ["MyBookings"],
    }),

    // 4. Admin: Get All Bookings (Admin Panel)
    getBookings: builder.query({
      query: ({ page = 1, limit = 10, search, status } = {}) => ({
        url: "/bookings", // Backend route is router.get("/")
        method: "GET",
        params: { page, limit, search, status },
      }),
      providesTags: ["Bookings"],
    }),

    // 5. Shared: Get Booking By ID
    getBookingById: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Bookings", id }],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useConfirmBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
} = bookingApi;