'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctorAuth } from '@/contexts/DoctorAuthContext.jsx';

const ProtectedDoctorRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useDoctorAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/doctors/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedDoctorRoute;