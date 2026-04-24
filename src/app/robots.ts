import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/kebijakan-privasi', '/syarat-ketentuan', '/laporan-keberlanjutan'],
        disallow: ['/dashboard', '/admin', '/events/', '/settings', '/api/', '/scan'],
      },
    ],
    sitemap: 'https://tawzii.id/sitemap.xml',
    host: 'https://tawzii.id',
  };
}
