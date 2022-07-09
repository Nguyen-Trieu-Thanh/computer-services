import { createSlice } from "@reduxjs/toolkit";

const initState = {
  data: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState: initState,
  reducers: {
    getAccounts: () => {},
    setAccounts: (state, action) => {
      const newData = action.payload.data;
      return { ...state, data: newData };
    },
  },
});

export const { getAccounts, setAccounts } = accountSlice.actions;

export default accountSlice.reducer;
