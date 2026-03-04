'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  enabled?: boolean;
}

export function QrScanner({ onScan, enabled = true }: QrScannerProps) {
  const scannerRef = useRef<import('html5-qrcode').Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const lastScanRef = useRef<string>('');
  const lastScanTimeRef = useRef<number>(0);
  const mountedRef = useRef(true);
  const facingModeRef = useRef(facingMode);
  // Lock to prevent concurrent start/stop transitions
  const busyRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    facingModeRef.current = facingMode;
  }, [facingMode]);

  const scanCallback = useCallback((decodedText: string) => {
    const now = Date.now();
    if (
      decodedText === lastScanRef.current &&
      now - lastScanTimeRef.current < 3000
    ) {
      return;
    }
    lastScanRef.current = decodedText;
    lastScanTimeRef.current = now;
    onScanRef.current(decodedText);
  }, []);

  // Safely stop scanner, chaining onto the busy lock
  const safeStop = useCallback(async () => {
    const doStop = async () => {
      try {
        if (scannerRef.current?.isScanning) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore stop errors
      }
    };
    // Chain onto the existing busy promise so we never overlap
    busyRef.current = busyRef.current.then(doStop, doStop);
    await busyRef.current;
  }, []);

  // Safely start scanner, chaining onto the busy lock
  const safeStart = useCallback(async () => {
    const doStart = async () => {
      if (!mountedRef.current) return;

      const el = document.getElementById('qr-reader');
      if (!el) return;

      // If already scanning, nothing to do
      if (scannerRef.current?.isScanning) return;

      const { Html5Qrcode } = await import('html5-qrcode');
      if (!mountedRef.current) return;

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      await scannerRef.current.start(
        { facingMode: facingModeRef.current },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        scanCallback,
        () => {}
      );

      if (mountedRef.current) setIsRunning(true);
    };

    busyRef.current = busyRef.current.then(doStart, doStart);
    await busyRef.current;
  }, [scanCallback]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) {
      safeStop().then(() => {
        if (mountedRef.current) setIsRunning(false);
      });
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled || !mountedRef.current) return;
      try {
        await safeStart();
      } catch (err) {
        if (!mountedRef.current || cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes('NotAllowedError') || message.includes('Permission')) {
          setError('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.');
        } else if (message.includes('NotFoundError')) {
          setError('Kamera tidak ditemukan pada perangkat ini.');
        } else if (message.includes('NotReadableError') || message.includes('in use')) {
          setError('Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain dan coba lagi.');
        } else {
          setError(message);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      safeStop().then(() => {
        if (mountedRef.current) setIsRunning(false);
      });
    };
  }, [enabled, facingMode, safeStart, safeStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Fire-and-forget final cleanup
      safeStop().then(() => {
        scannerRef.current = null;
      });
    };
  }, [safeStop]);

  const handleRetry = async () => {
    setError(null);
    setIsRunning(false);
    await safeStop();
    scannerRef.current = null;
    try {
      await safeStart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memulai kamera');
    }
  };

  const handleStop = async () => {
    await safeStop();
    setIsRunning(false);
  };

  const handleSwitchCamera = async () => {
    setError(null);
    await safeStop();
    scannerRef.current = null;
    setIsRunning(false);
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="space-y-3">
      <div
        id="qr-reader"
        className="mx-auto overflow-hidden rounded-lg bg-black"
        style={{ maxWidth: 350, minHeight: isRunning ? undefined : 200 }}
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          <CameraOff className="mx-auto mb-2 size-8" />
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={handleRetry} className="mt-3">
            <RefreshCw className="mr-2 size-4" />
            Coba Lagi
          </Button>
        </div>
      )}

      {isRunning && (
        <div className="text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            Arahkan kamera ke QR code pada kupon
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSwitchCamera}>
              <SwitchCamera className="mr-2 size-4" />
              {facingMode === 'environment' ? 'Kamera Depan' : 'Kamera Belakang'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleStop}>
              <CameraOff className="mr-2 size-4" />
              Hentikan
            </Button>
          </div>
        </div>
      )}

      {!isRunning && !error && enabled && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Camera className="size-12 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">Memulai kamera...</p>
        </div>
      )}
    </div>
  );
}
