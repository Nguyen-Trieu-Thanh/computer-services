import { apiSlice } from "../apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: (order_id) => "/order/" + order_id,
      keepUnusedDataFor: 0,
    }),
    updateOrderById: builder.mutation({
      query: (orderDetail) => ({
        url: `/order/${orderDetail._id}`,
        method: "PATCH",
        body: {
          orderDetails_id: orderDetail.orderDetails_id,
          status: orderDetail.status,
        },
      }),
    }),
  }),
});

export const { useGetOrderQuery, useUpdateOrderByIdMutation } = orderApiSlice;
