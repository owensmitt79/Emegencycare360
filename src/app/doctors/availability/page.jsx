'use client';
import dynamic from 'next/dynamic';

const DoctorsAvailabilityPage = dynamic(() => import('@/views/DoctorsAvailabilityPage.jsx'), {
  ssr: false,
});

export default DoctorsAvailabilityPage;
