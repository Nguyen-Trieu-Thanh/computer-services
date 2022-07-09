import { apiSlice } from "../apiSlice";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/booking/all",
      keepUnusedDataFor: 5,
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
          cus_id: "62a2c44b5a9810fa40ae483f",
        },
      }),
    }),
  }),
});

export const { useGetBookingsQuery, useCreateBookingMutation } =
  bookingApiSlice;
