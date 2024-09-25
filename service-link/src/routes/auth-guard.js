// auth-guard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
const AuthGuard = ({ element, allowedRoles }) => {
  // Retrieve user role from localStorage
  const userRole = 1;

  // Check if the user has the required role to access the route
  const isAuthorized = allowedRoles.includes(userRole);
  // If the user is authorized, render the requested component

  if (isAuthorized) {
    return element;
  } else {
    // If the user is not authorized, redirect to a not authorized page or handle it as per your app's logic
    return <Navigate to="/not-authorized" />;
  }
};

export default AuthGuard;
