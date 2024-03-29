import { apiSlice } from "../apiSlice";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (filterBooking) =>
        `/booking/all?sort=${filterBooking.sort}&status=${
          filterBooking.status
        }&page=${filterBooking.page}&limit=${10}`,
      keepUnusedDataFor: 0,
    }),
    getBookingsWithOrderDetail: builder.query({
      query: (filterBooking) =>
        `/booking/with-order-status/all?sort=${filterBooking.sort}&status=${
          filterBooking.status
        }&page=${filterBooking.page}&cus_name=${
          filterBooking.cus_name
        }&limit=${10}`,
      keepUnusedDataFor: 0,
    }),
    getBookingsWithOrderDetailByCusId: builder.query({
      query: ({ cusId, filterBooking }) =>
        `/booking/booking-by-id/${cusId}?sort=${filterBooking.sort}&status=${
          filterBooking.status
        }&page=${filterBooking.page}&limit=${7}`,
      keepUnusedDataFor: 0,
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "/booking/create",
        method: "POST",
        body: {
          cus_name: booking.cus_name,
          services: booking.services,
          description: booking.description,
          type: booking.type,
          cus_address: booking.cus_address,
          time: booking.time,
          status: booking.status,
          phonenum: booking.phonenum,
          acc_id: booking.acc_id,
        },
      }),
    }),
    createBookingManager: builder.mutation({
      query: (booking) => ({
        url: `/booking/create-booking-manager?cusId=${booking.acc_id}`,
        method: "POST",
        body: {
          cus_name: booking.cus_name,
          services: booking.services,
          // .map((service, index) => {
          //   return {
          //     name: service,
          //   };
          // }),
          description: booking.description,
          type: booking.type,
          cus_address: booking.cus_address,
          time: booking.time,
          // status: booking.status,
          phonenum: booking.phonenum,
          acc_id: booking.acc_id,
        },
      }),
    }),
    updateBooking: builder.mutation({
      query: (booking) => ({
        url: "/booking/" + booking._id,
        method: "PUT",
        body: {
          status: booking.status,
        },
      }),
    }),
    acceptBooking: builder.mutation({
      query: (booking) => ({
        url: `/booking/accept-booking/${booking._id}`,
        method: "PATCH",
      }),
    }),
    getBookingById: builder.mutation({
      query: (booking_id) => `/booking/search/${booking_id}`,
    }),
    getBookingWithOrderById: builder.mutation({
      query: (booking_id) => `/booking/with-order/${booking_id}`,
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingsWithOrderDetailQuery,
  useGetBookingsWithOrderDetailByCusIdQuery,
  useCreateBookingMutation,
  useCreateBookingManagerMutation,
  useUpdateBookingMutation,
  useAcceptBookingMutation,
  useGetBookingByIdMutation,
  useGetBookingWithOrderByIdMutation,
} = bookingApiSlice;
