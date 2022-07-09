import { createSlice } from "@reduxjs/toolkit";

const initState = {
  username: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    getLogin: () => {},
    getRefreshAccessToken: () => {},
    setCredentials: (state, action) => {
      const { username, accessToken } = action.payload;
      return { ...state, username: username, token: accessToken };
    },
    logOut: (state, action) => {
      return { ...state, user: null, token: null };
    },
  },
});

export const { getLogin, getRefreshAccessToken, setCredentials, logOut } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
