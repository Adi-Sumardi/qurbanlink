import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

// Midtrans domains — wildcard covers all subdomains (snap, api, assets, app, etc.)
const midtransWild    = '*.sandbox.midtrans.com *.midtrans.com';
const midtransFonts   = 'https://fonts.gstatic.com';

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' ${midtransWild};
  style-src 'self' 'unsafe-inline' ${midtransWild} https://fonts.googleapis.com;
  font-src 'self' ${midtransFonts} ${midtransWild};
  img-src 'self' data: blob:
    https://images.unsplash.com
    https://source.unsplash.com
    ${midtransWild};
  frame-src 'self' ${midtransWild};
  connect-src 'self' ${midtransWild}
    ${isDev ? 'ws://localhost:* http://localhost:*' : ''};
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
  { key: 'Permissions-Policy',            value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // HSTS — only for production (browsers ignore it on HTTP/localhost)
  ...(!isDev ? [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
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
