'use client';
import dynamic from 'next/dynamic';

const AdminVerificationPage = dynamic(() => import('@/views/AdminVerificationPage.jsx'), {
  ssr: false,
});

export default AdminVerificationPage;
