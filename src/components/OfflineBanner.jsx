import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status on mount to avoid hydration mismatch
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm font-medium">
            You are offline. Emergency services may be limited. Please check your connection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;