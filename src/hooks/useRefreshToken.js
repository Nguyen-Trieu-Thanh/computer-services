import React from "react";

//Redux
//Actions
import { setCredentials } from "../redux/slices/auth/authSlice";

//API Actions
import { useRefreshTokenMutation } from "../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch } from "react-redux";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  //API
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();

  const refresh = async () => {
    await refreshToken()
      .unwrap()
      .then(async (res) => {
        await dispatch(setCredentials({ accessToken: res.accessToken }));
        return res.accessToken;
      });
  };

  return refresh;
};

export default useRefreshToken;
