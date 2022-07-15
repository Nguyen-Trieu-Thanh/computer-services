import { apiSlice } from "../apiSlice";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service/all-service",
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetServicesQuery } = serviceApiSlice;
