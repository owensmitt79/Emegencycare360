'use client';
import dynamic from 'next/dynamic';

const SystemSecurityPage = dynamic(() => import('@/views/SystemSecurityPage.jsx'), {
  ssr: false,
});

export default SystemSecurityPage;
