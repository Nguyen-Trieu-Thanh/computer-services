import { createSlice } from "@reduxjs/toolkit";

const initState = {
  data: [],
};

const accessorySlice = createSlice({
  name: "accessory",
  initialState: initState,
  reducers: {
    setAccessories: (state, action) => {
      const newData = action.payload.data;
      return { ...state, data: newData };
    },
  },
});

export const { setAccessories } = accessorySlice.actions;

export default accessorySlice.reducer;
