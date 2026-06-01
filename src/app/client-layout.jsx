'use client';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { DoctorAuthProvider } from '@/contexts/DoctorAuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import { ConsultantProvider } from '@/contexts/ConsultantProvider.jsx';
import { TranslationProvider } from '@/contexts/TranslationContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ConsultantBar from '@/components/ConsultantBar.jsx';

export default function ClientLayout({ children }) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <DoctorAuthProvider>
          <AdminAuthProvider>
            <ConsultantProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <ConsultantBar />
              <Toaster position="top-center" richColors />
            </ConsultantProvider>
          </AdminAuthProvider>
        </DoctorAuthProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}
