import { describe, it, expect, beforeEach } from 'vitest';
import { useScanStore } from '../scan.store';

describe('useScanStore', () => {
  beforeEach(() => {
    useScanStore.setState({
      lastScan: null,
      offlineQueue: [],
      isScanning: false,
    });
  });

  it('addToOfflineQueue adds a scan to the queue', () => {
    useScanStore.getState().addToOfflineQueue({
      id: 'offline-1',
      qr_payload: 'test-payload',
      scan_method: 'qr',
      scanned_at: '2025-01-01T00:00:00Z',
    });

    expect(useScanStore.getState().offlineQueue).toHaveLength(1);
    expect(useScanStore.getState().offlineQueue[0].id).toBe('offline-1');
  });

  it('addToOfflineQueue appends multiple scans', () => {
    const store = useScanStore.getState();
    store.addToOfflineQueue({
      id: 'offline-1',
      qr_payload: 'payload-1',
      scan_method: 'qr',
      scanned_at: '2025-01-01T00:00:00Z',
    });
    useScanStore.getState().addToOfflineQueue({
      id: 'offline-2',
      qr_payload: 'payload-2',
      scan_method: 'manual',
      scanned_at: '2025-01-01T00:01:00Z',
    });

    expect(useScanStore.getState().offlineQueue).toHaveLength(2);
  });

  it('removeFromOfflineQueue removes by id', () => {
    useScanStore.getState().addToOfflineQueue({
      id: 'offline-1',
      qr_payload: 'payload-1',
      scan_method: 'qr',
      scanned_at: '2025-01-01T00:00:00Z',
    });
    useScanStore.getState().addToOfflineQueue({
      id: 'offline-2',
      qr_payload: 'payload-2',
      scan_method: 'qr',
      scanned_at: '2025-01-01T00:01:00Z',
    });

    useScanStore.getState().removeFromOfflineQueue('offline-1');

    const queue = useScanStore.getState().offlineQueue;
    expect(queue).toHaveLength(1);
    expect(queue[0].id).toBe('offline-2');
  });

  it('clearOfflineQueue empties the queue', () => {
    useScanStore.getState().addToOfflineQueue({
      id: 'offline-1',
      qr_payload: 'payload',
      scan_method: 'qr',
      scanned_at: '2025-01-01T00:00:00Z',
    });

    useScanStore.getState().clearOfflineQueue();
    expect(useScanStore.getState().offlineQueue).toHaveLength(0);
  });

  it('setIsScanning updates scanning state', () => {
    useScanStore.getState().setIsScanning(true);
    expect(useScanStore.getState().isScanning).toBe(true);

    useScanStore.getState().setIsScanning(false);
    expect(useScanStore.getState().isScanning).toBe(false);
  });
});
