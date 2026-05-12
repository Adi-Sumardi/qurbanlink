'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget (auto-render mode).
 *
 * Fail-safe: if the widget doesn't call onVerify within TIMEOUT_MS
 * (e.g. because of internal Cloudflare CSP/TrustedTypes bugs), we
 * fall back to a special token so the form stays usable.
 * The backend's TurnstileValid rule accepts the fallback token as
 * fail-open (rate-limiting still provides brute-force protection).
 *
 * Site key: NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 * No key → dev mode, auto-verify immediately.
 */

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const TIMEOUT_MS = 8_000; // wait 8s before fail-open

/** Sentinel token for fail-open fallback — backend recognises and skips verify */
export const TURNSTILE_FALLBACK_TOKEN = 'TURNSTILE_WIDGET_ERROR';

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

  const id = useRef(`__ts_${++counter}`);
  const cbVerify = `${id.current}_verify`;
  const cbExpire = `${id.current}_expire`;
  const cbError  = `${id.current}_error`;
  const verified = useRef(false);

  // Dev mode: no site key → auto-verify immediately
  useEffect(() => {
    if (!siteKey) onVerify('DEV_MODE_NO_TURNSTILE');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fail-open timeout: if widget doesn't verify in time, unblock the form
  useEffect(() => {
    if (!siteKey) return;
    const timer = setTimeout(() => {
      if (!verified.current) {
        console.warn('[Turnstile] Widget did not verify in time — using fail-open fallback.');
        onVerify(TURNSTILE_FALLBACK_TOKEN);
      }
    }, TIMEOUT_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  // Register global callbacks
  useEffect(() => {
    if (!siteKey) return;
    window[cbVerify] = (token: string) => {
      verified.current = true;
      onVerify(token);
    };
    window[cbExpire] = onExpire ?? (() => { verified.current = false; });
    window[cbError]  = () => {
      // Widget error → immediately unblock with fallback token
      if (!verified.current) {
        console.warn('[Turnstile] Widget error — using fail-open fallback.');
        verified.current = true;
        onVerify(TURNSTILE_FALLBACK_TOKEN);
      }
      onError?.();
    };
    return () => {
      delete window[cbVerify];
      delete window[cbExpire];
      delete window[cbError];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onVerify, onExpire, onError]);

  // Load Turnstile script once (auto-render mode)
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
