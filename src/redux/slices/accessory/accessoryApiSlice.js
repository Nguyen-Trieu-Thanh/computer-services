import { apiSlice } from "../apiSlice";

export const accessoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccessories: builder.query({
      query: () => "/accessory/all-accessories",
      keepUnusedDataFor: 0,
    }),
    createAccessory: builder.mutation({
      query: (accessory) => ({
        url: "/accessory/create-accessory",
        method: "POST",
        body: {
          name: accessory.name,
          price: accessory.price,
          description: accessory.description,
          insurance: accessory.insurance,
          supplier_id: "62d14b772c7ff9eccc4f528d",
        },
      }),
    }),
  }),
});

export const { useGetAccessoriesQuery, useCreateAccessoryMutation } =
  accessoryApiSlice;
