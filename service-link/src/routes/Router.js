import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotFoundPage from "../pages/not-found-page";
import useAuth from "../hooks/use-auth";
import LoginPage from "../pages/login-page";
import TaskManagerPage from "../pages/task-manager-page";
import AuthGuard from "./auth-guard";
// import other components as needed

function AppRouter() {
  const { isAuthenticated, getUserDetails } = useAuth();
  const authenticated = isAuthenticated();
  const { role } = getUserDetails();

  const handleNavigateToDashboard = () => {
    if (authenticated) {
      if (role === 1) {
        return <Navigate to="/dashboard" />;

      } else {
        return <Navigate to="/login" />;
      }
    }
    return <Navigate to="/login" />;
  };
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={handleNavigateToDashboard()} />

      <Route
        path="/dashboard"
        element={
          <AuthGuard
            element={<TaskManagerPage />}
            allowedRoles={[1]}
          />
        }
      />
      
  
      <Route path="*" element={<NotFoundPage />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default AppRouter;
