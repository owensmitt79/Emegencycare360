'use client';
import React, { Suspense } from 'react';
import VerifyEmailPage from '@/views/VerifyEmailPage.jsx';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailPage />
    </Suspense>
  );
}
