import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDoctorAuth } from '@/contexts/DoctorAuthContext.jsx';

const ProtectedDoctorRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useDoctorAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/doctors/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedDoctorRoute;