import { baseApi } from "@/services/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    // USER: Create Booking
    createBooking: builder.mutation({
      query: (body) => ({ url: "/bookings/create", method: "POST", body }),
      invalidatesTags: ["MyBookings"],
    }),

    // USER: Get My Bookings (Dashboard)
    getMyBookings: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/bookings/my-bookings",
        params: { page, limit, status: status === "all" ? undefined : status },
      }),
      providesTags: ["MyBookings"],
    }),

    // ADMIN: Get All Bookings
    getBookings: builder.query({
      query: ({ page = 1, limit = 10, search, status } = {}) => ({
        url: "/bookings",
        params: { page, limit, search, status },
      }),
      providesTags: ["Bookings"],
    }),

    // SHARED: Get Specific Booking Detail
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (res, err, id) => [{ type: "Bookings", id }],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
} = bookingApi;