import type { Metadata } from 'next';

const BASE_URL = 'https://tawzii.id';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Tawzii Digital — Platform Distribusi Kurban Digital #1 untuk Masjid Indonesia',
    template: '%s | Tawzii Digital',
  },
  description:
    'Platform distribusi kurban digital berbasis QR Code untuk masjid dan organisasi Islam. Kelola pembagian daging kurban dengan transparan, cegah kupon palsu, dan pantau distribusi real-time. Gratis untuk masjid!',
  keywords: [
    // Primary keywords
    'distribusi kurban',
    'kurban digital',
    'digital kurban',
    'pembagian kurban',
    'qrcode kurban',
    'qr code kurban',
    // Secondary keywords
    'aplikasi kurban masjid',
    'kupon kurban QR code',
    'sistem distribusi kurban',
    'manajemen kurban online',
    'platform kurban idul adha',
    'software distribusi daging kurban',
    'distribusi daging kurban digital',
    'pembagian daging kurban online',
    'aplikasi pembagian kurban',
    'kupon digital kurban',
    // Long-tail keywords
    'aplikasi distribusi kurban untuk masjid',
    'sistem pembagian kurban dengan QR code',
    'cara distribusi kurban yang adil',
    'aplikasi manajemen kurban idul adha',
    'software pengelolaan hewan kurban',
    'platform digital kurban masjid indonesia',
    'distribusi kurban transparan',
    'kupon kurban anti palsu',
    'laporan distribusi kurban otomatis',
    'scan qr kurban',
    // Brand
    'tawzii',
    'tawzii digital',
    'adilabs',
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
    title: 'Tawzii Digital — Platform Distribusi Kurban Digital #1 untuk Masjid',
    description:
      'Distribusi kurban digital berbasis QR Code. Cegah kupon palsu, atur pembagian per zona RT/RW, dan pantau transparansi hewan kurban secara real-time. Gratis untuk masjid di seluruh Indonesia.',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'Tawzii Digital — Platform Distribusi Kurban Digital untuk Masjid Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawzii Digital — Platform Distribusi Kurban Digital',
    description:
      'Distribusi kurban digital berbasis QR Code. Cegah kupon palsu, pembagian per zona, transparansi real-time. Gratis untuk masjid!',
    images: ['/og'],
    creator: '@tawziidigital',
  },
  other: {
    'google-site-verification': '', // TODO: add Google Search Console verification code
  },
};

/**
 * JSON-LD Structured Data for Google Rich Results.
 * - Organization: brand identity
 * - SoftwareApplication: app listing in search
 * - WebSite: sitelinks search box
 * NOTE: FAQPage schema lives in faq-section.tsx (single source of truth)
 */
function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tawzii Digital',
    alternateName: 'Tawzii',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Platform distribusi kurban digital berbasis QR Code untuk masjid dan organisasi Islam di Indonesia.',
    foundingDate: '2025',
    founder: {
      '@type': 'Organization',
      name: 'adilabs.id',
    },
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Indonesian'],
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tawzii Digital',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
      description: 'Gratis untuk masjid — paket Free tersedia tanpa batas waktu',
    },
    description: 'Platform distribusi kurban digital berbasis QR Code. Kelola pembagian daging kurban dengan transparan dan real-time.',
    featureList: [
      'Kupon QR Code anti-palsu',
      'Distribusi per zona RT/RW',
      'Live dashboard real-time',
      'Laporan PDF & Excel otomatis',
      'Scan offline tetap jalan',
      'Manajemen hewan kurban lengkap',
    ],
    screenshot: `${BASE_URL}/og-image.png`,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tawzii Digital',
    url: BASE_URL,
    description: 'Platform distribusi kurban digital untuk masjid Indonesia',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };



  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

    </>
  );
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      {children}
    </>
  );
}
