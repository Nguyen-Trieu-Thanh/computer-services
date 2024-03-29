import React from "react";

//Redux
//Actions
import { setCredentials } from "../redux/slices/auth/authSlice";

//API Actions
import { useRefreshTokenMutation } from "../redux/slices/auth/authApiSlice";

//React-redux
import { useDispatch } from "react-redux";

//JWT-decode
import jwt_decode from "jwt-decode";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  //API
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();

  const refresh = async () => {
    await refreshToken()
      .unwrap()
      .then(async (res) => {
        // console.log(jwt_decode(res.accessToken).username);
        // console.log(res);

        await dispatch(
          setCredentials({
            accessToken: res.accessToken,
            username: jwt_decode(res.accessToken).username,
            role: jwt_decode(res.accessToken).role,
          })
        );
        return res.accessToken;
      });
  };

  return refresh;
};

export default useRefreshToken;
