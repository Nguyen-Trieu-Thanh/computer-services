import { apiSlice } from "../apiSlice";

export const accessoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccessories: builder.query({
      query: () => "/accessory/all-accessories",
      keepUnusedDataFor: 0,
    }),
    getAccessoryDetail: builder.query({
      query: (accessory_id) => `/accessory/detail-accessory/${accessory_id}`,
      keepUnusedDataFor: 0,
    }),
    createAccessory: builder.mutation({
      query: (accessory) => ({
        url: "/accessory/new-accessory",
        method: "POST",
        body: {
          name: accessory.name,
          price: accessory.price,
          description: accessory.description,
          insurance: accessory.insurance,
          supplier_id: accessory.supplier_id,
          type: accessory.type,
          component: accessory.component,
        },
      }),
    }),
    updateAccessory: builder.mutation({
      query: (accessory) => ({
        url: `/accessory/upadated-accessory/${accessory._id}`,
        method: "PATCH",
        body: {
          name: accessory.name,
          price: accessory.price,
          description: accessory.description,
          insurance: accessory.insurance,
          supplier_id: accessory.supplier_id,
        },
      }),
    }),
    uploadAccessoryImage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/accessory/upload-img/${id}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAccessoriesQuery,
  useGetAccessoryDetailQuery,
  useCreateAccessoryMutation,
  useUpdateAccessoryMutation,
  useUploadAccessoryImageMutation,
} = accessoryApiSlice;
