import { apiSlice } from "../apiSlice";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service/all-service",
      keepUnusedDataFor: 0,
    }),
    createService: builder.mutation({
      query: (service) => ({
        url: "/service/create-service",
        method: "POST",
        body: {
          name: service.name,
          description: service.description,
          price: service.price,
          type: service.type,
          accessories_id: service.accessories_id,
          hasAccessory: service.accessories_id.length === 0 ? false : true,
        },
      }),
    }),
  }),
});

export const { useGetServicesQuery, useCreateServiceMutation } =
  serviceApiSlice;
