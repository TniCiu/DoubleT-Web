import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? rest.element : <Navigate to={redirectTo || '/'} replace />}
    />
  );
};

export default ProtectedRoute;
