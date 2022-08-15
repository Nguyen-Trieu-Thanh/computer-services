import { createSlice } from "@reduxjs/toolkit";

const initState = {
  username: null,
  token: null,
  rememberMe: JSON.parse(localStorage.getItem("rememberMe")) || false,
  profile: {
    name: "",
    phonenum: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setCredentials: (state, action) => {
      const { username, accessToken, _id } = action.payload;
      return { ...state, username: username, token: accessToken };
    },
    setRememberMe: (state, action) => {
      const { rememberMe } = action.payload;
      return { ...state, rememberMe: rememberMe };
    },
    setProfile: (state, action) => {
      return { ...state, profile: { ...action.payload } };
    },
  },
});

export const { setCredentials, setRememberMe, setProfile } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUsername = (state) => state.auth.username;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRememberMe = (state) => state.auth.rememberMe;
export const selectCurrentProfile = (state) => state.auth.profile;
