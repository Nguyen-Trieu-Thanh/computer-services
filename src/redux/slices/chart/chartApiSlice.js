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
    dataForDashboard: builder.query({
      query: () => "/chart/data-for-dashboard",
      keepUnusedDataFor: 0,
    }),
    // dataToChartRealTime: builder.query({
    //   query: (request) => ({
    //     url: "/chart/data-chart",
    //     method: "POST",
    //     body: {
    //       dates: request.dates,
    //       types: request.types,
    //       filter: request.filter,
    //     },
    //   }),
    //   keepUnusedDataFor: 0,
    // }),
    // dataToChartRealTime: builder.query({
    //   query: (request) => ({
    //     url: "/chart/data-chart",
    //     method: "POST",
    //     body: {
    //       dates: request.dates,
    //       types: request.types,
    //       filter: request.filter,
    //     },
    //   }),
    //   async onCacheEntryAdded(
    //     arg,
    //     { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
    //   ) {
    //     const ws = new WebSocket("ws://computer-services-api.herokuapp.com");

    //     try {
    //       await cacheDataLoaded;

    //       const listener = (event) => {
    //         const data = JSON.parse(event.data);
    //         if (data.channel !== arg) return;

    //         updateCachedData((draft) => {
    //           draft.push(data);
    //         });
    //       };
    //       ws.addEventListener("message", listener);
    //     } catch (error) {}
    //   },
    //   // keepUnusedDataFor: 0,
    // }),
  }),
});

export const { useDataToChartMutation, useDataForDashboardQuery } =
  chartApiSlice;
