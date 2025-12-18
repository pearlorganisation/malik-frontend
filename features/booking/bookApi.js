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
  }),
});

export const { useCreateBookingMutation,useConfirmBookingMutation } = bookingApi;