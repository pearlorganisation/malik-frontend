import { baseApi } from "@/services/baseApi";

export const spotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET ALL SPOTS ================= */
    getAllSpots: builder.query({
      query: () => ({
        url: "/spots",
        method: "GET",
      }),
      providesTags: ["Spots"],
    }),

    /* ================= GET SINGLE SPOT ================= */
    getSpotById: builder.query({
      query: (id) => ({
        url: `/spots/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Spots", id }],
    }),
  }),
});

export const { useGetAllSpotsQuery, useGetSpotByIdQuery } = spotApi;
