import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../redux/slices/auth/authApiSlice";
import {
  selectCurrentRememberMe,
  selectCurrentToken,
  setCredentials,
} from "../redux/slices/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";

const RememberMeLogin = ({ children }) => {
  //Local state
  const [isLoading, setIsLoading] = useState(true);

  //Global state
  const token = useSelector(selectCurrentToken);
  const rememberMe = useSelector(selectCurrentRememberMe);

  //API
  const [refreshToken, { isFetching: isRefreshLoading }] =
    useRefreshTokenMutation();

  //Utilities
  const dispatch = useDispatch();
  const location = useLocation();

  const refresh = async () => {
    await refreshToken()
      .unwrap()
      .then(async (res) => {
        await dispatch(setCredentials({ accessToken: res.accessToken }));
      });
  };

  useEffect(() => {
    if (token === null && rememberMe) {
      refresh();
    }
  }, []);

  return isRefreshLoading ? (
    <p>Loading...</p>
  ) : token ? (
    rememberMe ? (
      <Navigate to="/dashboard" state={{ from: location }} replace />
    ) : (
      children
    )
  ) : (
    children
  );
};

export default RememberMeLogin;
