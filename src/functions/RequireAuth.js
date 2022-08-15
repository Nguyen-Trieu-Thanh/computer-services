import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectCurrentToken,
  selectCurrentRememberMe,
} from "../redux/slices/auth/authSlice";

const RequireAuth = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const rememberMe = JSON.parse(localStorage.getItem("rememberMe")) || false;
  const location = useLocation();
  return token && rememberMe ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
