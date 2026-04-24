import type { Metadata } from 'next';

const BASE_URL = 'https://tawzii.id';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Tawzii Digital — Platform Distribusi Kurban Digital untuk Masjid',
    template: '%s | Tawzii Digital',
  },
  description:
    'Tawzii Digital adalah platform SaaS distribusi kurban berbasis QR Code untuk masjid dan organisasi Islam di Indonesia. Cegah kupon palsu, atur distribusi per zona, dan pantau transparansi hewan kurban secara real-time.',
  keywords: [
    'distribusi kurban digital',
    'aplikasi kurban masjid',
    'kupon kurban QR code',
    'sistem distribusi kurban',
    'manajemen kurban online',
    'platform kurban idul adha',
    'software distribusi daging kurban',
    'tawzii digital',
    'aplikasi masjid idul adha',
    'transparansi kurban',
  ],
  authors: [{ name: 'adilabs.id', url: BASE_URL }],
  creator: 'adilabs.id',
  publisher: 'Tawzii Digital by adilabs.id',
  category: 'Software as a Service',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { 'id-ID': BASE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: BASE_URL,
    siteName: 'Tawzii Digital',
    title: 'Tawzii Digital — Platform Distribusi Kurban Digital untuk Masjid',
    description:
      'Cegah kupon palsu, atur distribusi per zona RT/RW, dan pantau transparansi hewan kurban secara real-time. Solusi digital terpercaya untuk masjid di seluruh Indonesia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tawzii Digital — Platform Distribusi Kurban Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawzii Digital — Platform Distribusi Kurban Digital',
    description:
      'Cegah kupon palsu, distribusi terorganisir per zona, transparansi hewan kurban real-time. Untuk masjid di seluruh Indonesia.',
    images: ['/og-image.png'],
    creator: '@tawziidigital',
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
