'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget (auto-render mode).
 *
 * Menggunakan cf-turnstile div + data attributes — lebih kompatibel dengan
 * strict CSP dan Trusted Types dibanding explicit render API.
 *
 * Callbacks di-expose ke window dengan nama unik per-instance.
 * Site key via NEXT_PUBLIC_TURNSTILE_SITE_KEY. Jika kosong → dev mode.
 */

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let counter = 0;

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export function Turnstile({ onVerify, onExpire, onError, theme = 'light', className }: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Unique names per widget instance so multiple widgets don't clash
  const id = useRef(`__ts_${++counter}`);
  const cbVerify  = `${id.current}_verify`;
  const cbExpire  = `${id.current}_expire`;
  const cbError   = `${id.current}_error`;

  // Dev mode: no site key → auto-verify with dummy token
  useEffect(() => {
    if (!siteKey) onVerify('DEV_MODE_NO_TURNSTILE');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register/update global callbacks (auto-rendering reads them by name)
  useEffect(() => {
    if (!siteKey) return;
    window[cbVerify] = onVerify;
    window[cbExpire] = onExpire ?? (() => {});
    window[cbError]  = onError  ?? (() => {});
    return () => {
      delete window[cbVerify];
      delete window[cbExpire];
      delete window[cbError];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onVerify, onExpire, onError]);

  // Load Turnstile script once (without ?render=explicit → auto-render mode)
  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return;
    if (document.querySelector(`script[src^="${SCRIPT_URL}"]`)) return;

    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <div
      className={`cf-turnstile ${className ?? ''}`.trim()}
      data-sitekey={siteKey}
      data-callback={cbVerify}
      data-expired-callback={cbExpire}
      data-error-callback={cbError}
      data-theme={theme}
    />
  );
}
