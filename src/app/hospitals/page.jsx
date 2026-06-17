'use client';
import dynamic from 'next/dynamic';

const HospitalDirectory = dynamic(() => import('@/views/HospitalDirectory.jsx'), {
  ssr: false,
});

export default HospitalDirectory;
