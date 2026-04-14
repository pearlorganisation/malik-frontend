import { baseApi } from "@/services/baseApi";

export const hotelApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    // 1. FRONTEND: Get all hotels (Listing Page)
    // Isme hum filter aur search support bhi de rahe hain
    getHotels: builder.query({
      query: (params) => ({
        url: "/hotel",
        params: params, // { page, limit, search }
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Hotels", id: _id })),
              { type: "Hotels", id: "LIST" },
            ]
          : [{ type: "Hotels", id: "LIST" }],
      // Agar sirf Active hotels dikhane hain frontend par
      transformResponse: (response) => {
        return {
          ...response,
          data: response.data?.filter(hotel => hotel.isActive !== false) || []
        };
      }
    }),

    // 2. FRONTEND: Get specific hotel details by ID
    getHotelById: builder.query({
      query: (id) => `/hotel/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotels", id }],
    }),

    // --- ADMIN MUTATIONS (If you want to manage from same file) ---

    createHotel: builder.mutation({
      query: (data) => ({
        url: "/hotel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Hotels", id: "LIST" }],
    }),

    updateHotel: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hotel/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Hotels", id: "LIST" },
        { type: "Hotels", id: id }
      ],
    }),

    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Hotels", id: "LIST" }],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;