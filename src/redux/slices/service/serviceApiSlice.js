import { apiSlice } from "../apiSlice";

export const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/service/all-service",
      keepUnusedDataFor: 0,
    }),
    // getServiceDetail: builder.query({
    //   query: (serviceId) => `/service/all-accessories-service/${serviceId}`,
    //   keepUnusedDataFor: 0,
    // }),
    getServiceDetail: builder.query({
      query: (serviceId) => `/service/detail-service-with-deleted/${serviceId}`,
      keepUnusedDataFor: 0,
    }),
    createService: builder.mutation({
      query: (service) => ({
        url: "/service/new-service",
        method: "POST",
        body: {
          name: service.name,
          description: service.description,
          price: service.price,
          type: service.type,
          // brand: service.brand,
          // accessories: service.accessories_id.map((x) => {
          //   return {
          //     typeCom: x.type,
          //     brandCom: x.brandCom,
          //     accessory_id: x._id,
          //   };
          // }),
          // hasAccessory: service.accessories_id.length === 0 ? false : true,
        },
      }),
    }),
    updateService: builder.mutation({
      query: (service) => ({
        url: `/service/${service._id}`,
        method: "PATCH",
        body: {
          name: service.name,
          description: service.description,
          price: service.price,
          type: service.type,
          // brand: service.brand,
          // accessories: service.accessories_id.map((x) => {
          //   return {
          //     typeCom: x.type,
          //     // brandCom: x.brandCom,
          //     accessory_id: x._id,
          //   };
          // }),
          // hasAccessory: service.accessories_id.length === 0 ? false : true,
        },
      }),
    }),
    deleteService: builder.mutation({
      query: (service) => ({
        url: `/service/deleted-service/${service._id}`,
        method: "DELETE",
      }),
    }),
    restoreService: builder.mutation({
      query: (service) => ({
        url: `/service/restored-service/${service._id}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceDetailQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useRestoreServiceMutation,
} = serviceApiSlice;
