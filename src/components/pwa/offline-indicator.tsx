'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] bg-amber-500 px-4 py-1.5 text-center text-sm font-medium text-white">
      <WifiOff className="mr-2 inline-block size-4" />
      Anda sedang offline — data scan akan disimpan dan dikirim saat online
    </div>
  );
}
