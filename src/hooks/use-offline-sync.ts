'use client';

import { useEffect, useCallback } from 'react';
import { useScanStore } from '@/stores/scan.store';
import { scanService } from '@/services/scan.service';
import { toast } from 'sonner';

export function useOfflineSync(eventId?: string) {
  const { offlineQueue, removeFromOfflineQueue } = useScanStore();

  const syncQueue = useCallback(async () => {
    if (!eventId || offlineQueue.length === 0 || !navigator.onLine) return;

    const toSync = [...offlineQueue];
    let synced = 0;

    for (const item of toSync) {
      try {
        await scanService.scan(eventId, {
          qr_payload: item.qr_payload,
          scan_method: item.scan_method,
        });
        removeFromOfflineQueue(item.id);
        synced++;
      } catch {
        // Stop syncing on first failure (server might be down)
        break;
      }
    }

    if (synced > 0) {
      toast.success(`${synced} scan offline berhasil disinkronkan`);
    }
  }, [eventId, offlineQueue, removeFromOfflineQueue]);

  useEffect(() => {
    if (!eventId) return;

    // Try to sync on mount
    syncQueue();

    // Sync when coming back online
    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [eventId, syncQueue]);

  return {
    pendingCount: offlineQueue.length,
    syncNow: syncQueue,
  };
}
