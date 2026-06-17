'use client';
import dynamic from 'next/dynamic';

const DispatcherDashboard = dynamic(() => import('@/views/DispatcherDashboard.jsx'), {
  ssr: false,
});

export default DispatcherDashboard;
