'use client';
import dynamic from 'next/dynamic';

const AuditLogsPage = dynamic(() => import('@/views/AuditLogsPage.jsx'), {
  ssr: false,
});

export default AuditLogsPage;
