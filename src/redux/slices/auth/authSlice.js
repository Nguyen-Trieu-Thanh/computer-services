import { createSlice } from "@reduxjs/toolkit";

const initState = {
  username: null,
  token: null,
  rememberMe: JSON.parse(localStorage.getItem("rememberMe")) || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setCredentials: (state, action) => {
      const { username, accessToken } = action.payload;
      return { ...state, username: username, token: accessToken };
    },
    setRememberMe: (state, action) => {
      const { rememberMe } = action.payload;
      return { ...state, rememberMe: rememberMe };
    },
  },
});

export const { setCredentials, setRememberMe } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUsername = (state) => state.auth.username;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRememberMe = (state) => state.auth.rememberMe;
