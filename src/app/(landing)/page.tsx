'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users,
  Shield,
  ArrowRight,
  QrCode,
  Zap,
  CheckCircle,
  Eye,
  Truck,
  BarChart3,
  Camera,
  FileText,
  Loader2,
} from 'lucide-react';
import { motion as m, useInView } from 'motion/react';
import { publicService } from '@/services/public.service';
import { formatCurrency, formatNumber } from '@/lib/format';
import { SUBSCRIPTION_PLAN_LABELS } from '@/lib/constants';
import type { SubscriptionPlanInfo } from '@/services/subscription.service';

// --- Animation Variants ---

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function useSectionView() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return { ref, inView };
}

// --- Navbar ---

function Navbar() {
  return (
    <m.nav
      className="glass sticky top-0 z-50 border-b border-[rgba(190,201,194,0.15)]"
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Tawzii Digital" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="font-headline text-sm font-extrabold text-[#004532]">Tawzii Digital</p>
            <p className="text-[10px] text-[#3f4944]/60">by adilabs.id</p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: 'Beranda', href: '#' },
            { label: 'Fitur', href: '#fitur' },
            { label: 'Harga', href: '#harga' },
            { label: 'Amanah', href: '#amanah' },
          ].map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className={`rounded-xl px-4 py-2 text-sm font-semibold font-headline tracking-tight transition-colors ${
                i === 0
                  ? 'text-[#004532]'
                  : 'text-[#3f4944] hover:bg-[#f2f4f6] hover:text-[#004532]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-[#3f4944] hover:text-[#004532] transition-colors md:block"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="btn-gradient rounded-full px-6 py-2.5 text-sm font-bold font-headline shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>
    </m.nav>
  );
}

// --- Hero Section ---

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-6 lg:px-8">
      {/* BG glow */}
      <m.div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#a6f2d1]/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          {/* Left: Text */}
          <m.div
            className="lg:col-span-6 space-y-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Badge */}
            <m.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#6ffbbe] px-4 py-2 text-xs font-black tracking-widest uppercase text-[#002113]">
                <Zap className="size-3" />
                Platform Kurban Digital
              </div>
            </m.div>

            {/* Headline */}
            <m.div variants={fadeUp} transition={{ duration: 0.6 }}>
              <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-[#004532] md:text-6xl lg:text-7xl">
                Amanah Kurban
                <br />
                <span className="text-[#00714d]">Masjid Digital.</span>
              </h1>
            </m.div>

            {/* Subtext */}
            <m.p
              className="max-w-xl text-lg leading-relaxed text-[#3f4944]"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              Ubah pengelolaan kurban tradisional menjadi ekosistem digital yang presisi,
              transparan, dan bermartabat. Pastikan setiap distribusi tepat sasaran dengan
              integritas Islami.
            </m.p>

            {/* CTA Buttons */}
            <m.div
              className="flex flex-wrap gap-4 pt-2"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/register"
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-extrabold font-headline shadow-xl shadow-[#004532]/20 transition-all active:scale-95 hover:opacity-90"
              >
                Daftarkan Masjid Anda
                <ArrowRight className="size-5" />
              </Link>
              <a
                href="#cara-kerja"
                className="inline-flex items-center gap-2 rounded-full bg-[#e6e8ea] px-8 py-4 text-base font-bold font-headline text-[#191c1e] transition-colors hover:bg-[#e0e3e5]"
              >
                Lihat Demo
              </a>
            </m.div>
          </m.div>

          {/* Right: Animal Images */}
          <m.div
            className="relative lg:col-span-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Card Sapi */}
              <div className="pt-12">
                <m.div
                  className="overflow-hidden rounded-3xl shadow-2xl"
                  style={{ rotate: -3 }}
                  whileHover={{ rotate: 0, transition: { duration: 0.4 } }}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src="https://images.unsplash.com/photo-1654224933022-a4916680a657?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Sapi Kurban"
                      className="h-full w-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003826]/80 via-transparent to-transparent" />
                    <p className="absolute bottom-5 left-0 right-0 text-center text-xs font-bold tracking-widest uppercase text-[#6ffbbe]">
                      Sapi Kurban
                    </p>
                  </div>
                </m.div>
              </div>

              {/* Card Kambing */}
              <div>
                <m.div
                  className="overflow-hidden rounded-3xl shadow-2xl"
                  style={{ rotate: 3 }}
                  whileHover={{ rotate: 0, transition: { duration: 0.4 } }}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src="https://images.unsplash.com/photo-1588466585717-f8041aec7875?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Kambing Kurban"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003826]/80 via-transparent to-transparent" />
                    <p className="absolute bottom-5 left-0 right-0 text-center text-xs font-bold tracking-widest uppercase text-[#6ffbbe]">
                      Kambing Kurban
                    </p>
                  </div>
                </m.div>
              </div>
            </div>

            {/* Stats overlay card */}
            <m.div
              className="absolute -bottom-8 -left-6 hidden rounded-2xl bg-white/90 p-5 shadow-xl shadow-[#004532]/8 backdrop-blur-xl md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#a6f2d1]">
                  <svg viewBox="0 0 24 24" className="size-6 fill-[#004532]"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/></svg>
                </div>
                <div>
                  <p className="text-sm text-[#3f4944]">Hewan Dikelola</p>
                  <p className="font-headline text-2xl font-bold text-[#004532]">12.450+</p>
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

// --- Bento Features Section ---

function FeaturesSection() {
  const { ref, inView } = useSectionView();

  return (
    <section id="fitur" className="bg-[#f2f4f6] py-32 px-6 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <m.div
          className="mb-20 text-center"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-4xl font-extrabold text-[#004532] mb-4">
            Distribusi Tepat Sasaran
          </h2>
          <p className="mx-auto max-w-2xl text-[#3f4944]">
            Platform kami memastikan kemuliaan kurban Anda setara dengan keunggulan
            sistem distribusi yang kami bangun.
          </p>
        </m.div>

        <m.div
          className="grid grid-cols-1 gap-6 md:grid-cols-12"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          {/* Large: Mustahik Management */}
          <m.div
            className="relative overflow-hidden rounded-3xl bg-white p-10 editorial-shadow md:col-span-8"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#a6f2d1]">
                <Users className="size-7 text-[#004532]" />
              </div>
              <h3 className="font-headline mb-4 text-3xl font-extrabold text-[#004532]">
                Manajemen Mustahik Mudah
              </h3>
              <p className="max-w-md leading-relaxed text-[#3f4944]">
                Profil penerima yang canggih mencegah duplikasi dan memastikan
                distribusi yang adil ke seluruh jaringan komunitas Anda.
              </p>
            </div>
            <div className="mt-8 flex gap-4 overflow-hidden">
              {[
                { zone: 'RT 04 / RW 02', pct: 80 },
                { zone: 'RT 01 / RW 03', pct: 45 },
              ].map((z) => (
                <div key={z.zone} className="min-w-[200px] rounded-xl bg-[#f2f4f6] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#6ffbbe]" />
                    <span className="text-sm font-bold text-[#191c1e]">{z.zone}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#e0e3e5]">
                    <div
                      className="h-full rounded-full bg-[#004532]"
                      style={{ width: `${z.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 bottom-0 opacity-5 text-[300px] leading-none text-[#004532] select-none">
              ⬤
            </div>
          </m.div>

          {/* Dark: Digital Coupons */}
          <m.div
            className="relative overflow-hidden rounded-3xl bg-[#004532] p-10 editorial-shadow md:col-span-4"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <QrCode className="mb-6 size-10 text-[#6ffbbe]" />
              <h3 className="font-headline mb-4 text-2xl font-extrabold text-white">
                Kupon Digital
              </h3>
              <p className="leading-relaxed text-white/70">
                Kupon digital berbasis QR yang aman menghilangkan antrean panjang
                dan klaim palsu.
              </p>
            </div>
            <div className="relative z-10 mt-8 rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                  ID Kupon Digital
                </span>
                <span className="chip-active">AKTIF</span>
              </div>
              <div className="font-mono text-xl tracking-tighter text-white">
                #QRB-2024-X921
              </div>
            </div>
          </m.div>

          {/* Small: Transparency */}
          <m.div
            className="flex items-start gap-6 rounded-3xl bg-white p-8 editorial-shadow md:col-span-6"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#ffdad6]">
              <Eye className="size-7 text-[#652925]" />
            </div>
            <div>
              <h3 className="font-headline mb-2 text-xl font-extrabold text-[#004532]">
                Transparansi Penuh
              </h3>
              <p className="text-sm leading-relaxed text-[#3f4944]">
                Dasbor real-time untuk donatur memantau kurban mereka dari pemilihan
                hewan hingga foto distribusi akhir.
              </p>
            </div>
          </m.div>

          {/* Small: Smart Logistics */}
          <m.div
            className="flex items-start gap-6 rounded-3xl bg-white p-8 editorial-shadow md:col-span-6"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#8bd6b6]">
              <Truck className="size-7 text-[#004532]" />
            </div>
            <div>
              <h3 className="font-headline mb-2 text-xl font-extrabold text-[#004532]">
                Logistik Cerdas
              </h3>
              <p className="text-sm leading-relaxed text-[#3f4944]">
                Rute pengiriman daging yang dioptimalkan untuk memastikan kesegaran
                maksimal dan kecepatan sampai ke penerima.
              </p>
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

// --- Transparency Section ---

function TransparencySection() {
  const { ref, inView } = useSectionView();

  const items = [
    {
      icon: CheckCircle,
      title: 'Data Penerima Terverifikasi',
      desc: 'Setiap mustahik diverifikasi melalui integrasi KTP nasional.',
    },
    {
      icon: Camera,
      title: 'Dokumentasi Bukti Foto',
      desc: 'Unggahan foto otomatis untuk setiap paket yang diserahkan.',
    },
    {
      icon: FileText,
      title: 'Laporan Pasca-Event',
      desc: 'Laporan PDF profesional instan untuk panitia masjid dan donatur.',
    },
  ];

  return (
    <section id="amanah" className="overflow-hidden py-32 px-6 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-20 lg:flex-row">
          {/* Left */}
          <m.div
            className="flex-1 space-y-10"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            <m.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <div className="inline-block rounded-full bg-[#ffdad6] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#652925]">
                Jaminan Amanah
              </div>
            </m.div>
            <m.h2
              className="font-headline text-4xl font-extrabold leading-tight text-[#004532] md:text-5xl"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              Distribusi Langsung
              <br />
              <span className="italic text-[#73332f]">Dapat Diaudit.</span>
            </m.h2>
            <m.div className="space-y-6" variants={stagger}>
              {items.map((item) => (
                <m.div
                  key={item.title}
                  className="flex items-start gap-4"
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#a6f2d1]">
                    <item.icon className="size-5 text-[#004532]" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-lg text-[#191c1e]">{item.title}</p>
                    <p className="text-[#3f4944]">{item.desc}</p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </m.div>

          {/* Right: Dashboard mockup */}
          <m.div
            className="relative flex-1"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 -z-10 size-80 rounded-full bg-gradient-to-tr from-[#eceef0] to-white" />
            <div className="overflow-hidden rounded-3xl bg-white editorial-shadow p-4">
              <div className="rounded-2xl bg-[#004532] p-6">
                <p className="mb-1 text-xs font-bold tracking-widest uppercase text-[#6ffbbe]">
                  Data Distribusi Langsung
                </p>
                <p className="font-headline text-2xl font-extrabold text-white mb-6">
                  Progres Real-time
                </p>
                <div className="flex h-32 items-end gap-2">
                  {[40, 65, 80, 55, 90, 100, 85, 70, 50, 35, 20, 10].map((h, i) => (
                    <m.div
                      key={i}
                      className="flex-1 rounded-t-sm bg-[#6ffbbe]/30"
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${h}%` } : { height: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                    >
                      <div
                        className="w-full rounded-t-sm bg-[#6ffbbe]"
                        style={{ height: '60%' }}
                      />
                    </m.div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Penerima', val: '2.840' },
                    { label: 'Terdistribusi', val: '2.180' },
                    { label: 'Progress', val: '85%' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-white/60">{s.label}</p>
                      <p className="font-headline text-lg font-bold text-white">{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}

// --- Pricing Section ---


const FEATURE_LABELS: Record<string, string> = {
  qr_code: 'QR Code Scan',
  manual_scan: 'Manual Scan',
  live_dashboard: 'Live Dashboard',
  export_pdf: 'Export PDF',
  export_excel: 'Export Excel',
  custom_branding: 'Custom Branding',
  email_notifications: 'Notifikasi Email',
  api_access: 'Akses API',
  priority_support: 'Priority Support',
};

const POPULAR_PLAN = 'professional';

function PricingSection() {
  const { ref, inView } = useSectionView();

  const { data: plansRes, isLoading } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => publicService.getPlans(),
    staleTime: 5 * 60 * 1000,
  });

  function extractPlans(raw: unknown): SubscriptionPlanInfo[] {
    if (Array.isArray(raw)) return raw as SubscriptionPlanInfo[];
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r?.data)) return r.data as SubscriptionPlanInfo[];
    return [];
  }

  const plans = extractPlans(plansRes);

  return (
    <section id="harga" className="bg-[#f7f9fb] py-32 px-6 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <m.div
          className="mb-20 space-y-4 text-center"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-4xl font-extrabold text-[#004532]">
            Harga yang Transparan
          </h2>
          <p className="mx-auto max-w-2xl text-[#3f4944]">
            Pilih paket yang sesuai dengan ukuran dan kebutuhan distribusi masjid Anda.
            Semua paket termasuk dukungan prioritas 24/7.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <BarChart3 className="size-4 text-[#3f4944]/50" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#3f4944]/60">
              Pembayaran Aman via Midtrans
            </span>
          </div>
        </m.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-[#004532]/40" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center text-sm text-[#3f4944]/60 py-10">
            Paket belum tersedia
          </div>
        ) : (
          <m.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {plans.map((plan) => {
              const isPopular = plan.slug === POPULAR_PLAN;
              const features = plan.features ?? {};
              const enabledFeatures = Object.entries(features).filter(([, v]) => v);
              const disabledFeatures = Object.entries(features).filter(([, v]) => !v);

              return (
                <m.div
                  key={plan.slug}
                  className={`relative flex flex-col rounded-[2rem] p-8 editorial-shadow ${
                    isPopular
                      ? 'bg-[#004532] text-white scale-105 shadow-2xl shadow-[#004532]/25'
                      : 'bg-white'
                  }`}
                  variants={scaleUp}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: isPopular ? -4 : -6, transition: { duration: 0.25 } }}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6ffbbe] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-[#002113]">
                      Paling Populer
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className={`font-headline mb-2 text-xl font-bold ${isPopular ? 'text-white' : 'text-[#004532]'}`}>
                      {SUBSCRIPTION_PLAN_LABELS[plan.slug] || plan.name}
                    </h3>
                    <p className={`text-sm ${isPopular ? 'text-white/70' : 'text-[#3f4944]'}`}>
                      {formatNumber(plan.coupon_quota)} kupon per periode
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      {plan.price_monthly === 0 ? (
                        <span className={`font-headline text-4xl font-black ${isPopular ? 'text-white' : 'text-[#004532]'}`}>
                          Gratis
                        </span>
                      ) : (
                        <>
                          <span className={`font-headline text-4xl font-black ${isPopular ? 'text-white' : 'text-[#004532]'}`}>
                            {formatCurrency(plan.price_monthly)}
                          </span>
                          <span className={isPopular ? 'text-white/60' : 'text-[#3f4944]'}>/bulan</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="mb-10 flex-1 space-y-3 text-sm">
                    {enabledFeatures.map(([key]) => (
                      <li key={key} className="flex items-center gap-3">
                        <CheckCircle className={`size-4 shrink-0 ${isPopular ? 'text-[#6ffbbe]' : 'text-[#004532]'}`} />
                        <span className={isPopular ? 'text-white' : 'text-[#191c1e]'}>
                          {FEATURE_LABELS[key] || key}
                        </span>
                      </li>
                    ))}
                    {disabledFeatures.map(([key]) => (
                      <li key={key} className="flex items-center gap-3 opacity-40">
                        <Shield className="size-4 shrink-0" />
                        <span>{FEATURE_LABELS[key] || key}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`w-full rounded-full py-4 text-center text-base font-bold font-headline transition-all hover:opacity-90 active:scale-95 ${
                      isPopular
                        ? 'bg-[#6ffbbe] text-[#002113] shadow-lg shadow-black/20'
                        : 'border-2 border-[#004532] text-[#004532] hover:bg-[#004532]/5'
                    }`}
                  >
                    {plan.price_monthly === 0 ? 'Mulai Gratis' : 'Pilih Paket'}
                  </Link>
                </m.div>
              );
            })}
          </m.div>
        )}
      </div>
    </section>
  );
}

// --- CTA Section ---

function CtaSection() {
  const { ref, inView } = useSectionView();

  return (
    <section className="px-6 pb-32 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <m.div
          className="relative overflow-hidden rounded-[3rem] bg-[#003826] px-12 py-24 text-center md:px-24"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 size-64 rounded-full bg-[#006c49] blur-[100px]" />
            <div className="absolute bottom-0 right-0 size-96 rounded-full bg-[#065f46] blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <m.h2
              className="font-headline mb-8 text-4xl font-black leading-tight text-[#f0faf5] md:text-6xl"
              initial={fadeIn.hidden}
              animate={inView ? fadeIn.visible : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Perkuat Masjid Anda
              <br />
              di Idul Adha Ini.
            </m.h2>
            <m.p
              className="mb-12 text-xl text-[#8bd6b6]/80"
              initial={fadeIn.hidden}
              animate={inView ? fadeIn.visible : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Bergabunglah dengan lebih dari 250 Masjid yang telah merevolusi
              pengelolaan kurban mereka bersama Tawzii Digital by adilabs.id.
            </m.p>
            <m.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={fadeIn.hidden}
              animate={inView ? fadeIn.visible : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#6ffbbe] px-10 py-5 text-lg font-black font-headline text-[#002113] transition-all hover:scale-105 active:scale-95"
              >
                Coba Gratis Sekarang
                <ArrowRight className="size-5" />
              </Link>
              <a
                href="https://wa.me/6285121379697?text=Halo%2C%20saya%20ingin%20konsultasi%20mengenai%20Tawzii%20Digital"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#f0faf5]/20 px-10 py-5 text-lg font-black font-headline text-[#f0faf5] transition-all hover:bg-[#f0faf5]/10"
              >
                Konsultasi dengan Tim
              </a>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

// --- Footer ---

function Footer() {
  return (
    <footer className="bg-[#f7f9fb] py-12 border-t border-[#eceef0]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <p className="font-headline font-bold text-[#004532] mb-1">Tawzii Digital by adilabs.id</p>
            <p className="text-xs text-[#3f4944]/60">
              © {new Date().getFullYear()} adilabs.id. Seluruh hak dilindungi.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
              { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
              { label: 'Laporan Keberlanjutan', href: '/laporan-keberlanjutan' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-[#3f4944]/60 hover:text-[#004532] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TransparencySection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
