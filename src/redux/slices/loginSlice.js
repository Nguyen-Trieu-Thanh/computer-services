import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoginCorrect: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {
    getLogin: () => {},
    setIsLoginCorrect: (state, action) => {
      return {
        ...state,
        isLoginCorrect: action.payload.isLoginCorrect,
      };
    },
  },
});

export const { getLogin, setIsLoginCorrect } = loginSlice.actions;

export default loginSlice.reducer;
