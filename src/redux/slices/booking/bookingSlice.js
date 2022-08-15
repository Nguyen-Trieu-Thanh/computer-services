import { createSlice } from "@reduxjs/toolkit";

const initState = {
  data: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState: initState,
  reducers: {
    getBookings: () => {},
    setBookings: (state, action) => {
      const newData = action.payload.data;
      return { ...state, data: newData };
    },
    createBooking: () => {},
  },
});

export const { getBookings, setBookings, createBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
