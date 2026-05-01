// import { baseApi } from "@/services/baseApi";

// export const placeApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     /* ================= GET ALL PLACES ================= */
//     getAllPlaces: builder.query({
//       query: () => ({
//         url: "/places",
//         method: "GET",
//       }),
//       providesTags: ["Places"],
//     }),

//     /* ================= GET PLACE BY ID ================= */
//     getPlaceById: builder.query({
//       query: (id) => ({
//         url: `/places/${id}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, id) => [{ type: "Places", id }],
//     }),
//   }),
// });

// export const {
//   useGetAllPlacesQuery,
//   useGetPlaceByIdQuery,
// } = placeApi;


import { baseApi } from "@/services/baseApi";

export const placeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET ALL PLACES ================= */
    getAllPlaces: builder.query({
      query: () => ({
        url: "/places", // Sahi: Kyunki /api/v1 baseUrl mein pehle se hai
        method: "GET",
      }),
      providesTags: ["Places"],
    }),

    /* ================= GET PLACE BY ID ================= */
    getPlaceById: builder.query({
      query: (id) => ({
        url: `/places/${id}`, // Sahi: /api/v1 prefix ki zaroorat nahi
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Places", id }],
    }),
  }),
});

export const {
  useGetAllPlacesQuery,
  useGetPlaceByIdQuery,
} = placeApi;