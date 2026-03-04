import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scan, ScanRequest } from '@/types';

interface OfflineScan extends ScanRequest {
  id: string;
  scanned_at: string;
}

interface ScanState {
  lastScan: Scan | null;
  offlineQueue: OfflineScan[];
  isScanning: boolean;
  setLastScan: (scan: Scan | null) => void;
  setIsScanning: (scanning: boolean) => void;
  addToOfflineQueue: (scan: OfflineScan) => void;
  removeFromOfflineQueue: (id: string) => void;
  clearOfflineQueue: () => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      lastScan: null,
      offlineQueue: [],
      isScanning: false,

      setLastScan: (scan) => set({ lastScan: scan }),
      setIsScanning: (scanning) => set({ isScanning: scanning }),

      addToOfflineQueue: (scan) =>
        set((state) => ({
          offlineQueue: [...state.offlineQueue, scan],
        })),

      removeFromOfflineQueue: (id) =>
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((s) => s.id !== id),
        })),

      clearOfflineQueue: () => set({ offlineQueue: [] }),
    }),
    {
      name: 'scan-storage',
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);
