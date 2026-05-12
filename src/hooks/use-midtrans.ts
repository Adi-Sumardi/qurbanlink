'use client';

import { useCallback, useEffect, useRef } from 'react';

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
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';

    const scriptSrc = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.setAttribute('data-client-key', clientKey ?? '');
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.head.appendChild(script);

    return () => {
      // Do not remove — keep loaded for subsequent calls
    };
  }, []);

  const openSnap = useCallback(
    (
      snapToken: string,
      callbacks: {
        onSuccess?: (result: Record<string, unknown>) => void;
        onPending?: (result: Record<string, unknown>) => void;
        onError?: (result: Record<string, unknown>) => void;
        onClose?: () => void;
      }
    ) => {
      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay(snapToken, callbacks);
      } else {
        console.error('Midtrans Snap not loaded yet');
      }
    },
    []
  );

  return { openSnap };
}
