import { apiSlice } from "../apiSlice";

export const chartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dataToChart: builder.mutation({
      query: (request) => ({
        url: "/chart/data-chart",
        method: "POST",
        body: {
          dates: request.dates,
          types: request.types,
          filter: request.filter,
        },
      }),
    }),
  }),
});

export const { useDataToChartMutation } = chartApiSlice;
