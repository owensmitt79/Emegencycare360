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
import { motion } from 'framer-motion';

export default function ClientLayout({ children }) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <DoctorAuthProvider>
          <AdminAuthProvider>
            <ConsultantProvider>
              
              {/* Global Overlay Animated Motion Effect */}
              <div className="fixed inset-0 z-[999] overflow-hidden pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-40 transition-opacity duration-1000">
                <div 
                  className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-emerald-400/40 via-cyan-400/30 to-transparent blur-[120px] animate-blob1"
                />
                <div 
                  className="absolute top-[30%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tl from-blue-500/30 via-purple-400/20 to-transparent blur-[150px] animate-blob2"
                />
                <div 
                  className="absolute bottom-[-20%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-teal-400/40 via-emerald-300/20 to-transparent blur-[100px] animate-blob3"
                />
              </div>

              <Header />
              <main className="min-h-screen relative z-0">
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
