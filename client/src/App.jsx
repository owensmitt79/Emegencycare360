import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { DoctorAuthProvider } from '@/contexts/DoctorAuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import { ConsultantProvider } from '@/contexts/ConsultantProvider.jsx';
import { TranslationProvider } from '@/contexts/TranslationContext.jsx';

// Public Pages
import HomePage from '@/pages/HomePage.jsx';
import EmergencyPage from '@/pages/EmergencyPage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import CoverageMapPage from '@/pages/CoverageMapPage.jsx';
import FirstAidPage from '@/pages/FirstAidPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import VerifyEmailPage from '@/pages/VerifyEmailPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ConsultationRoomPage from '@/pages/ConsultationRoomPage.jsx';

// Doctor Pages
import DoctorRegisterPage from '@/pages/DoctorRegisterPage.jsx';
import DoctorLoginPage from '@/pages/DoctorLoginPage.jsx';
import DoctorDashboardPage from '@/pages/DoctorDashboardPage.jsx';

// Admin Pages
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ConsultantBar from '@/components/ConsultantBar.jsx';

function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
      <DoctorAuthProvider>
        <AdminAuthProvider>
          <ConsultantProvider>
            <Router>
              <ScrollToTop />
              <Header />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/coverage" element={<CoverageMapPage />} />
                <Route path="/firstaid" element={<FirstAidPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/consultation/:doctorId" element={<ConsultationRoomPage />} />
                
                {/* Doctor Routes */}
                <Route path="/doctors/register" element={<DoctorRegisterPage />} />
                <Route path="/doctors/login" element={<DoctorLoginPage />} />
                <Route path="/doctors/dashboard" element={<DoctorDashboardPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
              <Footer />
              <ConsultantBar />
              <Toaster position="top-center" richColors />
            </Router>
          </ConsultantProvider>
        </AdminAuthProvider>
      </DoctorAuthProvider>
    </AuthProvider>
    </TranslationProvider>
  );
}

export default App;