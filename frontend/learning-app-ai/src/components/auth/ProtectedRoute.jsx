import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppLayout from "../layout/AppLayout";

const ProtectedRoute = () => {
  const isAuthenticated = true;
  const loading = false;

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );

  //   return <div>ProtectedRoute</div>;
};

export default ProtectedRoute;
