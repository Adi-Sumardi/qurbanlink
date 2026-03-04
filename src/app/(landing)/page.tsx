'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  QrCode,
  BarChart3,
  Users,
  Shield,
  Smartphone,
  Zap,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Scan,
  FileSpreadsheet,
  Wifi,
} from 'lucide-react';
import { motion as m, useInView } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- Animation variants ---

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

// --- Hook for section-level in-view ---

function useSectionInView() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return { ref, isInView };
}

// --- Data ---

const FEATURES = [
  {
    icon: QrCode,
    title: 'Kupon QR Digital',
    description: 'Generate kupon QR unik untuk setiap penerima. Anti-duplikasi dengan HMAC signature.',
  },
  {
    icon: Scan,
    title: 'Scan Cepat',
    description: 'Scan kupon via kamera HP atau input manual. Verifikasi instan kurang dari 1 detik.',
  },
  {
    icon: BarChart3,
    title: 'Live Dashboard',
    description: 'Pantau distribusi secara real-time. Progress per kategori, grafik per jam, live feed.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant',
    description: 'Setiap masjid/organisasi punya data terpisah. Aman dan terisolasi.',
  },
  {
    icon: Smartphone,
    title: 'PWA Mobile-Ready',
    description: 'Install di HP seperti aplikasi native. Bisa scan offline, sinkron saat online.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Import & Export',
    description: 'Import data penerima dari Excel. Export laporan PDF & spreadsheet.',
  },
  {
    icon: Shield,
    title: 'Role & Permission',
    description: '4 level akses: Admin, Operator, Viewer, Super Admin. Kontrol penuh.',
  },
  {
    icon: Wifi,
    title: 'Offline Support',
    description: 'Scan tetap jalan walau tanpa internet. Data tersimpan & auto-sync.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: 'Gratis',
    period: 'selamanya',
    description: 'Cocok untuk masjid kecil',
    features: ['100 kupon', '1 event/tahun', '3 pengguna', 'QR scan dasar', 'Manual scan'],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: 'Rp99.000',
    period: '/bulan',
    description: 'Untuk masjid menengah',
    features: [
      '500 kupon',
      '3 event/tahun',
      '5 pengguna',
      'Live dashboard',
      'Export PDF',
      'Notifikasi email',
    ],
    cta: 'Pilih Starter',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 'Rp249.000',
    period: '/bulan',
    description: 'Untuk organisasi besar',
    features: [
      '2.000 kupon',
      'Unlimited event',
      '20 pengguna',
      'Export Excel & PDF',
      'Custom branding',
      'API access',
      'Priority support',
    ],
    cta: 'Pilih Professional',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Solusi khusus skala besar',
    features: [
      'Unlimited kupon',
      'Unlimited semua',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Training tim',
    ],
    cta: 'Hubungi Kami',
    highlighted: false,
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Daftar & Buat Event',
    description: 'Registrasi gratis, buat event kurban, tambahkan lokasi distribusi.',
  },
  {
    step: '02',
    title: 'Input Data Penerima',
    description: 'Tambahkan penerima satu per satu atau import dari Excel.',
  },
  {
    step: '03',
    title: 'Generate Kupon QR',
    description: 'Sistem otomatis membuat kupon QR unik per penerima. Cetak atau distribusi digital.',
  },
  {
    step: '04',
    title: 'Scan & Distribusi',
    description: 'Hari H: scan kupon, daging tersalurkan. Pantau real-time di dashboard.',
  },
];

// --- Sections ---

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <m.div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32">
        <m.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainerSlow}
        >
          <m.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Zap className="mr-1 size-3" />
              Platform distribusi kurban #1 di Indonesia
            </Badge>
          </m.div>
          <m.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Distribusi Daging Kurban{' '}
            <span className="text-primary">Lebih Tertib & Transparan</span>
          </m.h1>
          <m.p
            className="mt-6 text-lg text-muted-foreground sm:text-xl"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Kelola penerima, generate kupon QR, scan distribusi, dan pantau progress
            secara real-time. Semua dalam satu platform digital.
          </m.p>
          <m.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/register">
                Mulai Gratis
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <a href="#cara-kerja">
                Lihat Cara Kerja
                <ChevronRight className="ml-1 size-4" />
              </a>
            </Button>
          </m.div>
          <m.p
            className="mt-4 text-xs text-muted-foreground"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            Gratis untuk 100 kupon pertama. Tanpa kartu kredit.
          </m.p>
        </m.div>

        {/* Hero visual mockup */}
        <m.div
          className="mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="size-3 rounded-full bg-red-400" />
              <div className="size-3 rounded-full bg-yellow-400" />
              <div className="size-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground">dashboard.qurbanlink.id</span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              <StatCard label="Total Penerima" value="1.250" />
              <StatCard label="Kupon Tergenerate" value="1.250" />
              <StatCard label="Sudah Terdistribusi" value="847" accent />
              <StatCard label="Belum Diambil" value="403" />
            </div>
            <div className="px-6 pb-6">
              <div className="h-40 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex items-end p-4 gap-2">
                {[35, 52, 68, 45, 78, 92, 85, 60, 42, 30, 15, 8].map((h, i) => (
                  <m.div
                    key={i}
                    className="flex-1 rounded-t bg-primary/60"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 1 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">Distribusi per jam — Hari H Kurban</p>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, isInView } = useSectionInView();

  return (
    <section id="fitur" className="border-t bg-muted/30 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Semua yang Anda Butuhkan</h2>
          <p className="mt-4 text-muted-foreground">
            Dari pendataan penerima hingga laporan distribusi, QurbanLink menangani semuanya.
          </p>
        </m.div>
        <m.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {FEATURES.map((feature) => (
            <m.div key={feature.title} variants={fadeUp} transition={{ duration: 0.4 }}>
              <m.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <Card className="border-0 bg-background shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-6">
                    <m.div
                      className="flex size-10 items-center justify-center rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <feature.icon className="size-5 text-primary" />
                    </m.div>
                    <h3 className="mt-4 font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </m.div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { ref, isInView } = useSectionInView();

  return (
    <section id="cara-kerja" className="border-t py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Cara Kerja</h2>
          <p className="mt-4 text-muted-foreground">
            4 langkah sederhana dari pendaftaran sampai distribusi selesai.
          </p>
        </m.div>
        <m.div
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainerSlow}
        >
          {STEPS.map((step, i) => (
            <m.div
              key={step.step}
              className="relative"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              {i < STEPS.length - 1 && (
                <m.div
                  className="absolute right-0 top-8 hidden w-full border-t border-dashed border-primary/30 lg:block"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                />
              )}
              <div className="relative">
                <m.span
                  className="text-5xl font-extrabold text-primary/15 block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, type: 'spring', stiffness: 200 }}
                >
                  {step.step}
                </m.span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, isInView } = useSectionInView();

  return (
    <section id="harga" className="border-t bg-muted/30 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Harga Transparan</h2>
          <p className="mt-4 text-muted-foreground">
            Mulai gratis, upgrade kapan saja sesuai kebutuhan.
          </p>
        </m.div>
        <m.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {PLANS.map((plan) => (
            <m.div
              key={plan.name}
              variants={scaleUp}
              transition={{ duration: 0.4 }}
            >
              <m.div whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                <Card
                  className={`relative flex flex-col h-full ${
                    plan.highlighted
                      ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                      : 'border'
                  }`}
                >
                  {plan.highlighted && (
                    <m.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <Badge className="bg-primary text-primary-foreground">Populer</Badge>
                    </m.div>
                  )}
                  <CardContent className="flex flex-1 flex-col pt-6">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                    <ul className="mt-6 flex-1 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full"
                      variant={plan.highlighted ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/register">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </m.div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}

function CtaSection() {
  const { ref, isInView } = useSectionInView();

  return (
    <section className="border-t py-20 sm:py-28" ref={ref}>
      <m.div
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainerSlow}
      >
        <m.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <m.div
            animate={isInView ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block"
          >
            <Globe className="mx-auto size-12 text-primary/50" />
          </m.div>
        </m.div>
        <m.h2
          className="mt-6 text-3xl font-bold sm:text-4xl"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          Siap Digitalisasi Distribusi Kurban?
        </m.h2>
        <m.p
          className="mt-4 text-lg text-muted-foreground"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          Bergabung dengan ratusan masjid dan organisasi yang sudah menggunakan QurbanLink
          untuk distribusi kurban yang lebih tertib dan transparan.
        </m.p>
        <m.div
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <Button size="lg" asChild>
            <Link href="/register">
              Daftar Sekarang — Gratis
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </m.div>
        <m.div
          className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-primary" />
            Gratis 100 kupon
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-primary" />
            Tanpa kartu kredit
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-primary" />
            Setup 5 menit
          </span>
        </m.div>
      </m.div>
    </section>
  );
}

// --- Main page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <m.nav
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              QL
            </div>
            <span className="text-lg font-bold">QurbanLink</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#cara-kerja" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
            </a>
            <a href="#harga" className="text-muted-foreground hover:text-foreground transition-colors">
              Harga
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Daftar Gratis</Link>
            </Button>
          </div>
        </div>
      </m.nav>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                QL
              </div>
              <span className="font-semibold">QurbanLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} QurbanLink. Platform distribusi kurban digital.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-primary' : ''}`}>{value}</p>
    </div>
  );
}
