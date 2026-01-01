import { baseApi } from "@/services/baseApi";
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ page = 1, limit = 10, search }) => ({
        url: "/categories",
        params: { page, limit, search },
      }),
      providesTags: ["Categories"],
    }),
    getCategoryById: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetCategoriesQuery, useGetCategoryByIdQuery } = categoryApi;
