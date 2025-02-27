import React from "react";
import useRole from "../hooks/useRole";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (role === "admin") {
    return children;
  }

  return <Navigate to={"/"} />;
};

export default AdminRoute;
