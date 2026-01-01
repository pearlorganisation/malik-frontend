import { baseApi } from "@/services/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // USER: Create contact query
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ADMIN: Get all queries
    getAllContacts: builder.query({
      query: () => ({
        url: "/admin/contacts",
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),

    // ADMIN: Update status / admin note
    // updateContactStatus: builder.mutation({
    //   query: ({ id, payload }) => ({
    //     url: `/admin/contacts/${id}`,
    //     method: "PATCH",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["Contacts"],
    // }),

  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  // useUpdateContactStatusMutation,
} = contactApi;
