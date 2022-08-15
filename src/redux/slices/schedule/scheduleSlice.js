import { createSlice } from "@reduxjs/toolkit";

const initState = {
  data: [],
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: initState,
  reducers: {
    getSchedules: () => {},
    setSchedules: (state, action) => {
      const newData = action.payload.data;
      return { ...state, data: newData };
    },
  },
});

export const { getSchedules, setSchedules } = scheduleSlice.actions;

export default scheduleSlice.reducer;
