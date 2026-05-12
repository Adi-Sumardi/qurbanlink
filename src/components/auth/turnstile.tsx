'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget (auto-render, non-blocking mode).
 *
 * Best-effort: widget attempts to verify and provides a token.
 * If it fails (Cloudflare internal CSP/TrustedTypes bugs, error 600010),
 * a fallback token is issued after TIMEOUT_MS so the form is never blocked.
 * Backend accepts the fallback token and falls back to rate-limiting protection.
 *
 * Site key: NEXT_PUBLIC_TURNSTILE_SITE_KEY. No key → dev mode.
 */

declare global {
  interface Window {
    [key: string]: unknown;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const TIMEOUT_MS = 3_000; // 3s — if widget hasn't verified, unblock immediately

/** Sentinel token — backend recognises and skips remote verify, logs warning */
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

  // Dev mode: no site key → verify immediately
  useEffect(() => {
    if (!siteKey) onVerify('DEV_MODE_NO_TURNSTILE');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fast fail-open timeout — unblock form after 3s if widget never responded
  useEffect(() => {
    if (!siteKey) return;
    const timer = setTimeout(fallback, TIMEOUT_MS);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  // Register global callbacks that Cloudflare's auto-renderer calls
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
      // Immediate fallback on error — don't wait for timeout
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
