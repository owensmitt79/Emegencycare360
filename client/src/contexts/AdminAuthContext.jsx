import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient.js';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // On mount, check localStorage for existing session
  useEffect(() => {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.record && parsed?.token) {
          setCurrentAdmin(parsed.record);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiClient.adminLogin(email, password);
      setCurrentAdmin(data.record);
      setIsAuthenticated(true);
      return { record: data.record };
    } catch (error) {
      throw new Error(error.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  }, []);

  const value = {
    currentAdmin,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
