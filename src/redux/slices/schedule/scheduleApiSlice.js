import { apiSlice } from "../apiSlice";

export const scheduleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => "/schedule/allschedule",
      keepUnusedDataFor: 0,
    }),
    getSchedulesWithStaffDetail: builder.query({
      query: () => "/schedule/show-schedule-for-assign",
      keepUnusedDataFor: 0,
    }),
    assignWorkSlotToOrder: builder.mutation({
      query: (updateOrderSlot) => ({
        url: "/schedule/assign-slot-to-order",
        method: "PATCH",
        body: {
          workSlotId: updateOrderSlot.workSlotId,
          orderId: updateOrderSlot.orderId,
        },
      }),
    }),
    getWorkSlotsById: builder.query({
      query: (staffId) => `/schedule/work-slot/${staffId}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetSchedulesWithStaffDetailQuery,
  useAssignWorkSlotToOrderMutation,
  useGetWorkSlotsByIdQuery,
} = scheduleApiSlice;
