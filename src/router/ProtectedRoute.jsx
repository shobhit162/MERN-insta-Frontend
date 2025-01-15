import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils";


const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;