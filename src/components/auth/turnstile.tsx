'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile — invisible / background-only mode.
 *
 * The visible widget is hidden because Cloudflare's iframe has internal
 * CSP/TrustedTypes bugs that prevent the checkbox from functioning.
 * Instead, we attempt verification silently and fall back to a sentinel
 * token after TIMEOUT_MS. Backend accepts the fallback and relies on
 * rate-limiting for brute-force protection.
 *
 * Site key: NEXT_PUBLIC_TURNSTILE_SITE_KEY. No key → dev mode.
 */

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const TIMEOUT_MS = 3_000;

export const TURNSTILE_FALLBACK_TOKEN = 'TURNSTILE_WIDGET_ERROR';

let counter = 0;

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export function Turnstile({ onVerify, onExpire, onError, theme = 'light' }: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const id       = useRef(`__ts_${++counter}`);
  const cbVerify = `${id.current}_verify`;
  const cbExpire = `${id.current}_expire`;
  const cbError  = `${id.current}_error`;
  const verified = useRef(false);

  const fallback = () => {
    if (!verified.current) {
      verified.current = true;
      onVerify(TURNSTILE_FALLBACK_TOKEN);
    }
  };

  // Dev mode
  useEffect(() => {
    if (!siteKey) onVerify('DEV_MODE_NO_TURNSTILE');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fail-open timeout
  useEffect(() => {
    if (!siteKey) return;
    const timer = setTimeout(fallback, TIMEOUT_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  // Global callbacks
  useEffect(() => {
    if (!siteKey) return;
    window[cbVerify] = (token: string) => {
      verified.current = true;
      onVerify(token);
    };
    window[cbExpire] = () => {
      verified.current = false;
      onExpire?.();
    };
    window[cbError] = () => {
      fallback();
      onError?.();
    };
    return () => {
      delete window[cbVerify];
      delete window[cbExpire];
      delete window[cbError];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onVerify, onExpire, onError]);

  // Load script once
  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return;
    if (document.querySelector(`script[src^="${SCRIPT_URL}"]`)) return;
    const script = document.createElement('script');
    script.src   = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;

  // Widget hidden — runs silently in background
  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback={cbVerify}
      data-expired-callback={cbExpire}
      data-error-callback={cbError}
      data-theme={theme}
      data-size="invisible"
      style={{ display: 'none' }}
    />
  );
}
