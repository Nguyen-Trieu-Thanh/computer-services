import { createSlice } from "@reduxjs/toolkit";

const initState = {
  loading: true,
};

const minorStateSlice = createSlice({
  name: "minorState",
  initialState: initState,
  reducers: {
    setLoading: (state, action) => {
      return { ...state, loading: action.payload.loading };
    },
  },
});

export const { setLoading } = minorStateSlice.actions;

export default minorStateSlice.reducer;
