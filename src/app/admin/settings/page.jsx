'use client';
import dynamic from 'next/dynamic';

const PlatformSettingsPage = dynamic(() => import('@/views/PlatformSettingsPage.jsx'), {
  ssr: false,
});

export default PlatformSettingsPage;
