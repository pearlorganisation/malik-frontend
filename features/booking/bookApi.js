import { baseApi } from "@/services/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/booking/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateBookingMutation } = bookingApi;