import { baseApi } from "@/services/baseApi";

export const pageApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    
    // 1. FRONTEND: Get all published pages for Footer
    getPages: builder.query({
      query: () => "/pages/all", 
      // Yahan result ab direct transformed array hai
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ _id }) => ({ type: "Page", id: _id })), 
              { type: "Page", id: "LIST" }
            ] 
          : [{ type: "Page", id: "LIST" }],

      transformResponse: (response) => {
        // Backend se response.data array mil raha hai, hum use filter karke bhej rahe hain
        return response.data?.filter(page => page.status === "Published") || [];
      }
    }),

    // 2. FRONTEND: Get specific page details by slug
    getPageBySlug: builder.query({
      query: (slug) => `/pages/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Page", id: slug }],
    }),

    // 3. ADMIN: Create Page
    createPage: builder.mutation({
      query: (body) => ({
        url: "/pages/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }], 
    }),

    // 4. ADMIN: Update Page
    updatePage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Page", id: "LIST" }, 
        { type: "Page", id: id }
      ],
    }),

    // 5. ADMIN: Delete Page
    deletePage: builder.mutation({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Page", id: "LIST" }],
    }),
  }),
});

export const { 
  useGetPagesQuery, 
  useGetPageBySlugQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation 
} = pageApi;