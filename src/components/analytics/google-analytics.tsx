'use client';

import Script from 'next/script';

/**
 * Google Analytics 4 + Google Ads gtag.js — single component.
 *
 * Env vars:
 * - NEXT_PUBLIC_GA_ID           → GA4 Measurement ID (G-XXXXXXXXXX)
 * - NEXT_PUBLIC_GADS_ID         → Google Ads ID (AW-XXXXXXXXXX)
 *
 * If neither is set, nothing renders (safe for dev/staging).
 */
export function GoogleAnalytics() {
  const gaId   = process.env.NEXT_PUBLIC_GA_ID;
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID;

  // No tracking IDs → skip
  if (!gaId && !gadsId) return null;

  const primaryId = gaId || gadsId;

  return (
    <>
      {/* Load gtag.js once with primary ID */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId   ? `gtag('config', '${gaId}', { send_page_view: true });`   : ''}
          ${gadsId ? `gtag('config', '${gadsId}');` : ''}
        `}
      </Script>
    </>
  );
}

/**
 * Fire a Google Ads conversion event.
 * Call this after a successful registration or purchase.
 *
 * Example: trackConversion('AW-123456789/abcdef')
 */
export function trackConversion(conversionId: string, value?: number, currency = 'IDR') {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      ...(value !== undefined && { value, currency }),
    });
  }
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
