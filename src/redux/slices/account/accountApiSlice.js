import { apiSlice } from "../apiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: () => "/account/all",
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetAccountsQuery } = accountApiSlice;
