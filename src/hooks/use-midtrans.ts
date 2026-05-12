'use client';

import { useCallback, useEffect } from 'react';

declare global {
  interface Window {
    snap: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (result: Record<string, unknown>) => void;
          onClose?: () => void;
        }
      ) => void;
      hide: () => void;
    };
  }
}

export function useMidtransSnap() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.snap) return;

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';

    const scriptSrc = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    if (document.querySelector(`script[src="${scriptSrc}"]`)) return;

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.setAttribute('data-client-key', clientKey ?? '');
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openSnap = useCallback(
    async (
      snapToken: string,
      callbacks: {
        onSuccess?: (result: Record<string, unknown>) => void;
        onPending?: (result: Record<string, unknown>) => void;
        onError?: (result: Record<string, unknown>) => void;
        onClose?: () => void;
      }
    ) => {
      if (typeof window === 'undefined') return;

      // Poll up to ~5s for the Snap script to finish loading
      const deadline = Date.now() + 5000;
      while (!window.snap && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 100));
      }

      if (window.snap) {
        window.snap.pay(snapToken, callbacks);
      } else {
        console.error('Midtrans Snap script failed to load');
        callbacks.onError?.({ status_message: 'Gagal memuat halaman pembayaran.' });
      }
    },
    []
  );

  return { openSnap };
}
