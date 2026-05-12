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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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
 * - FAQPage: FAQ rich results
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Apa itu Tawzii Digital?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tawzii Digital adalah platform distribusi kurban digital berbasis QR Code yang membantu masjid dan organisasi Islam mengelola pembagian daging kurban secara transparan, adil, dan efisien.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana cara kerja distribusi kurban dengan QR Code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Setiap penerima mendapat kupon digital dengan QR Code unik. Saat pengambilan, panitia cukup scan QR Code — sistem otomatis memverifikasi dan menandai kupon sebagai sudah digunakan. Tidak bisa dipalsukan atau digunakan dua kali.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah Tawzii Digital gratis untuk masjid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya! Tawzii menyediakan paket Free yang bisa digunakan masjid tanpa biaya. Paket berbayar tersedia untuk fitur tambahan seperti kuota kupon lebih banyak dan laporan lanjutan.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apakah bisa digunakan tanpa internet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ya, fitur scan QR Code tetap bisa berjalan meski koneksi internet terputus. Data akan otomatis tersinkronisasi saat koneksi kembali tersedia.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apa keunggulan kupon digital dibanding kupon kertas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Kupon digital QR Code tidak bisa difotokopi atau dipalsukan, otomatis hangus setelah digunakan, dan semua data tercatat di sistem secara real-time. Panitia bisa memantau distribusi dari dashboard tanpa perlu rekap manual.',
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
