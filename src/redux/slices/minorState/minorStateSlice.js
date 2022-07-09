import { createSlice } from "@reduxjs/toolkit";

const initState = {
  loading: true,
  loginLoading: false,
  createBookingLoading: false,
  showConfirmCreateBooking: false,
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
    setCreateBookingLoading: (state, action) => {
      return {
        ...state,
        createBookingLoading: action.payload.createBookingLoading,
      };
    },
    setShowConfirmCreateBooking: (state, action) => {
      return {
        ...state,
        showConfirmCreateBooking: action.payload.showConfirmCreateBooking,
      };
    },
  },
});

export const {
  setLoading,
  setLoginLoading,
  setCreateBookingLoading,
  setShowConfirmCreateBooking,
} = minorStateSlice.actions;

export default minorStateSlice.reducer;
