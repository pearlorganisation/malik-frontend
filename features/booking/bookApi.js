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
  }),
});

export const { useCreateBookingMutation } = bookingApi;