import { baseApi } from "@/services/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/create",
        method: "POST",
        body,
      }),
    }),

    confirmBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/confirm-payment",
        method: "POST",
        body,
      }),
    }),

    getMyBookings: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/bookings/my-bookings",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && { status }),
        },
      }),
      providesTags: ["MyBookings"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useConfirmBookingMutation,
  useGetMyBookingsQuery,
} = bookingApi;
