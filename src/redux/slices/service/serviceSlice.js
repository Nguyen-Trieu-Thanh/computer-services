import { createSlice } from "@reduxjs/toolkit";

const initState = {
  data: [],
};

const serviceSlice = createSlice({
  name: "service",
  initialState: initState,
  reducers: {
    setServices: (state, action) => {
      const newData = action.payload.data;
      return { ...state, data: newData };
    },
  },
});

export const { setServices } = serviceSlice.actions;

export default serviceSlice.reducer;
