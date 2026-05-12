import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// Midtrans domains — wildcard covers all subdomains (snap, api, assets, app, etc.)
const midtransWild    = '*.sandbox.midtrans.com *.midtrans.com';
const midtransCdn     = '*.cdn.gtflabs.io *.gtflabs.io';
const cloudflare      = 'static.cloudflareinsights.com cloudflareinsights.com';
const turnstile       = 'challenges.cloudflare.com';
const midtransFonts   = 'https://fonts.gstatic.com';

// Extract API origin from env so CSP always matches the configured backend URL
const apiUrl    = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const apiOrigin = new URL(apiUrl).origin;

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' ${midtransWild} ${midtransCdn} ${cloudflare} ${turnstile};
  style-src 'self' 'unsafe-inline' ${midtransWild} ${midtransCdn} https://fonts.googleapis.com;
  font-src 'self' ${midtransFonts} ${midtransWild} ${midtransCdn};
  img-src 'self' data: blob:
    https://images.unsplash.com
    https://source.unsplash.com
    ${midtransWild} ${midtransCdn};
  frame-src 'self' ${midtransWild} ${midtransCdn} ${turnstile};
  connect-src 'self' ${apiOrigin} ${midtransWild} ${midtransCdn}
    https://images.unsplash.com https://source.unsplash.com
    https://api.tawzii.id ${cloudflare} ${turnstile}
    ${isDev ? 'ws://localhost:* http://localhost:* https://*.trycloudflare.com wss://*.trycloudflare.com https://*.ngrok-free.app ws://*.ngrok-free.app' : ''};
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  { key: 'Content-Security-Policy',        value: ContentSecurityPolicy },
  { key: 'X-Content-Type-Options',         value: 'nosniff' },
  { key: 'X-Frame-Options',                value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection',              value: '1; mode=block' },
  { key: 'Referrer-Policy',               value: 'strict-origin-when-cross-origin' },
  // camera=(self) → izinkan kamera untuk QR scanner di /scan (halaman own origin)
  { key: 'Permissions-Policy',            value: 'camera=(self), microphone=(), geolocation=(), payment=(self)' },
  // HSTS — only for production (browsers ignore it on HTTP/localhost)
  ...(!isDev ? [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ] : []),
  // Allow Midtrans Sandbox popup (hosted on public domain) to access localhost
  // Chrome Private Network Access policy blocks this by default
  ...(isDev ? [
    { key: 'Access-Control-Allow-Private-Network', value: 'true' },
  ] : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ── Static assets: content-hashed by Next.js → safe to cache 1 year ──
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // ── HTML pages: always revalidate so users never get stale UI ──────────
      {
        source: '/((?!_next/static).*)',
        headers: [
          ...securityHeaders,
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma',        value: 'no-cache' },
          { key: 'Expires',       value: '0' },
        ],
      },
    ];
  },

  // Prevent exposing Next.js version in headers
  poweredByHeader: false,
};

export default nextConfig;
