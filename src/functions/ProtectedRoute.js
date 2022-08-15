import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ user, children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (token !== null) {
    const role = jwt_decode(token).role;
    if (user.includes(role)) {
      return children;
    }
    return <Navigate to="/error" state={{ from: location }} replace />;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute;
