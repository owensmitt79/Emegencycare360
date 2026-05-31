import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount, check localStorage for existing session
  useEffect(() => {
    const stored = localStorage.getItem('userAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.record) {
          setUser(parsed.record);
        }
      } catch (e) {
        localStorage.removeItem('userAuth');
      }
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await apiClient.patientLogin(email, password);
      localStorage.setItem('userAuth', JSON.stringify(data));
      setUser(data.record);
      return { success: true, user: data.record };
    } catch (error) {
      const message = error?.message || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name, phone) => {
    setLoading(true);
    try {
      const data = await apiClient.patientRegister(email, password, name, phone);
      if (data.token) {
        localStorage.setItem('userAuth', JSON.stringify(data));
        setUser(data.record);
        return { success: true, user: data.record };
      } else {
        // Verification is required
        return { success: true, needsVerification: true, message: data.message };
      }
    } catch (error) {
      const message = error?.message || 'Registration failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    localStorage.removeItem('userAuth');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    // No-op for now — user data is session-based
  }, []);

  const value = {
    user,
    role: user?.role || 'user',
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};