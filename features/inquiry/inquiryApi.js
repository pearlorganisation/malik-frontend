import { baseApi } from "@/services/baseApi";

export const inquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= CREATE INQUIRY ================= */
    createInquiry: builder.mutation({
      query: (data) => ({
        url: "/inquiry/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    /* ================= GET ALL INQUIRIES ================= */
    getAllInquiries: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/inquiry?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),

    /* ================= GET SINGLE INQUIRY ================= */
    getInquiryById: builder.query({
      query: (id) => ({
        url: `/inquiry/${id}`,
        method: "GET",
      }),
      providesTags: ["Inquiry"],
    }),

    /* ================= DELETE INQUIRY ================= */
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/inquiry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiry"],
    }),

  }),
});

export const {
  useCreateInquiryMutation,
  useGetAllInquiriesQuery,
  useGetInquiryByIdQuery,
  useDeleteInquiryMutation,
} = inquiryApi;