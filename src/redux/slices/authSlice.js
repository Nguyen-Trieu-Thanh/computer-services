import { createSlice } from "@reduxjs/toolkit";

const initState = {
  name: "",
  role: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    getLogin: () => {},
    setUser: (state, action) => {
      return {
        ...state,
        name: action.payload.name,
        role: action.payload.role,
      };
    },
    setIsLoggedIn: (state, action) => {
      return { ...state, isLoggedIn: action.payload.isLoggedIn };
    },
  },
});

export const { getLogin, setUser, setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
