import { createSlice } from "@reduxjs/toolkit";

const initState = {
  email: "",
  password: "",
  role: 0,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    setEmail: (state, action) => {
      return { ...state, email: action.payload.email };
    },
    setPassword: (state, action) => {
      return { ...state, password: action.payload.password };
    },
    getLogin: () => {},
    setLogin: (state, action) => {
      return { ...state, role: action.payload.role };
    },
  },
});

export const { setEmail, setPassword, getLogin, setLogin } = loginSlice.actions;

export default loginSlice.reducer;
