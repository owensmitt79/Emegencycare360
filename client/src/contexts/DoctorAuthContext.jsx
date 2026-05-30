import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient.js';

const DoctorAuthContext = createContext();

export const useDoctorAuth = () => {
  const context = useContext(DoctorAuthContext);
  if (!context) {
    throw new Error('useDoctorAuth must be used within a DoctorAuthProvider');
  }
  return context;
};

export const DoctorAuthProvider = ({ children }) => {
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // On mount, check if a doctor session exists in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('doctorAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.record && parsed?.token) {
          setCurrentDoctor(parsed.record);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem('doctorAuth');
      }
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiClient.doctorLogin(email, password);
      setCurrentDoctor(data.record);
      setIsAuthenticated(true);
      return { record: data.record };
    } catch (error) {
      throw new Error(error.message || 'Doctor login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentDoctor(null);
    setIsAuthenticated(false);
    localStorage.removeItem('doctorAuth');
  }, []);

  const signup = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      // For now, doctor registration is informational — no PocketBase needed
      const record = {
        id: `doctor-${Date.now()}`,
        email: formData.email,
        full_name: formData.name || formData.full_name,
        phone: formData.phone || '',
        specialization: formData.specialization || 'General Practice',
        medical_license: formData.medical_license || formData.licenseNumber || '',
        years_experience: formData.years_experience || formData.yearsExperience || 0,
        hospital: formData.hospital || '',
        bio: formData.bio || '',
        is_available: false,
        is_verified: false,
      };
      return record;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    currentDoctor,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
  };

  return (
    <DoctorAuthContext.Provider value={value}>
      {children}
    </DoctorAuthContext.Provider>
  );
};