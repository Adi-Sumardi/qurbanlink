'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

/**
 * Cloudflare Turnstile widget — modern alternatif untuk reCAPTCHA.
 * Gratis, privacy-friendly, dan punya mode "managed" yang biasanya invisible.
 *
 * Site key di-set via env NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 * Kalau key kosong, widget di-skip dan token dummy dikirim (development mode).
 */
export function Turnstile({ onVerify, onExpire, onError, theme = 'light', className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Dev mode: no site key — auto-verify with dummy token so forms still work
  useEffect(() => {
    if (!siteKey) {
      onVerify('DEV_MODE_NO_TURNSTILE');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load Turnstile script once (only when siteKey exists)
  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }

    const existing = document.querySelector(`script[src^="${SCRIPT_URL}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  // Render widget once script + container ready
  useEffect(() => {
    if (!siteKey || !scriptReady || !window.turnstile || !containerRef.current) return;
    if (widgetIdRef.current) return; // already rendered

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'expired-callback': onExpire,
      'error-callback': onError,
      theme,
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, siteKey]);

  // No site key = dev mode, render nothing (token already sent via useEffect above)
  if (!siteKey) return null;

  return <div ref={containerRef} className={className} />;
}
