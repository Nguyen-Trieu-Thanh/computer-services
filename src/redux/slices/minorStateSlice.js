import { createSlice } from "@reduxjs/toolkit";

const initState = {
  loading: true,
  loginLoading: false,
};

const minorStateSlice = createSlice({
  name: "minorState",
  initialState: initState,
  reducers: {
    setLoading: (state, action) => {
      return { ...state, loading: action.payload.loading };
    },
    setLoginLoading: (state, action) => {
      return { ...state, loginLoading: action.payload.loginLoading };
    },
  },
});

export const { setLoading, setLoginLoading } = minorStateSlice.actions;

export default minorStateSlice.reducer;
