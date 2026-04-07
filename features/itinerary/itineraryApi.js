import { baseApi } from "@/services/baseApi";

export const itineraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🟢 GENERATE AI ITINERARY
    generateItinerary: builder.mutation({
      query: (data) => ({
        url: "/itinerary/generate", // backend route
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useGenerateItineraryMutation,
} = itineraryApi;