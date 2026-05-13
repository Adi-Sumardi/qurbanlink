'use client';

import { useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users,
  Shield,
  ArrowRight,
  QrCode,
  Zap,
  Eye,
  Truck,
  BarChart3,
  CheckCircle,
  FileText,
  Loader2,
  XCircle,
  AlertTriangle,
  ScanLine,
  Beef,
  ClipboardList,
} from 'lucide-react';
import { motion as m, useInView } from 'motion/react';
import { publicService } from '@/services/public.service';
import { formatCurrency, formatNumber } from '@/lib/format';
import { SUBSCRIPTION_PLAN_LABELS } from '@/lib/constants';
import type { SubscriptionPlanInfo } from '@/services/subscription.service';
import { toast } from 'sonner';
import { FaqSection } from '@/components/landing/faq-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';

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
            { label: 'Testimoni', href: '#testimoni' },
            { label: 'Harga', href: '#harga' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Panduan', href: '/panduan' },
            { label: 'Blog', href: '/blog' },
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
              <Link
                href="/panduan"
                className="inline-flex items-center gap-2 rounded-full bg-[#e6e8ea] px-8 py-4 text-base font-bold font-headline text-[#191c1e] transition-colors hover:bg-[#e0e3e5]"
              >
                Lihat Panduan
              </Link>
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

// --- Features Section (Problem → Solution) ---

function FeaturesSection() {
  const { ref, inView } = useSectionView();

  return (
    <section id="fitur" className="bg-[#f2f4f6] py-32 px-6 lg:px-8" ref={ref}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <m.div
          className="mb-20 text-center"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffdad6] px-4 py-2 text-xs font-black tracking-widest uppercase text-[#652925] mb-6">
            <AlertTriangle className="size-3" />
            3 Masalah Fatal yang Selalu Berulang Setiap Idul Adha
          </div>
          <h2 className="font-headline text-4xl font-extrabold text-[#191c1e] mb-4 md:text-5xl">
            Distribusi Kurban Tradisional{' '}
            <span className="text-[#73332f]">Merusak Kepercayaan Warga.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[#3f4944] text-lg leading-relaxed">
            Setiap tahun, cerita yang sama berulang. Ribut antrean, kupon palsu beredar, donatur kecewa — dan
            nama baik panitia masjid jadi taruhannya.{' '}
            <span className="font-bold text-[#004532]">Tawzii mengakhiri siklus ini sekali untuk selamanya.</span>
          </p>
        </m.div>

        {/* Bento Grid */}
        <m.div
          className="grid grid-cols-1 gap-6 md:grid-cols-12"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
        >

          {/* ── Masalah 1: Distribusi Krodit ── */}
          <m.div
            className="relative overflow-hidden rounded-3xl bg-white p-10 editorial-shadow md:col-span-7"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            {/* Problem pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ffdad6] px-3 py-1.5 text-xs font-bold text-[#652925]">
              <XCircle className="size-3.5" />
              Masalah #1 — Distribusi Krodit & Tidak Teratur
            </div>

            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#a6f2d1]">
              <Users className="size-7 text-[#004532]" />
            </div>

            <h3 className="font-headline mb-3 text-2xl font-extrabold text-[#004532]">
              Distribusi Per Zona — Tidak Ada Lagi Warga Berdesak-desakan
            </h3>

            <div className="mb-6 rounded-2xl border border-[#ffdad6] bg-[#fff5f5] px-4 py-3">
              <p className="text-sm font-bold text-[#73332f] mb-1">⚠ Dampak nyata yang sering terjadi:</p>
              <ul className="space-y-1">
                {[
                  'Warga lansia jatuh terinjak di kerumunan',
                  'Panitia kewalahan, distribusi sampai larut malam',
                  'Hewan kurban dibagi tidak merata — ada yang dapat banyak, ada yang tidak dapat sama sekali',
                  'Foto viral di media sosial memalukan panitia masjid',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-[#652925]">
                    <span className="mt-0.5 shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <p className="max-w-md leading-relaxed text-[#3f4944] mb-8">
              <span className="font-semibold text-[#004532]">Dengan Tawzii:</span>{' '}
              Setiap penerima mendapat kupon digital berzona RT/RW dengan jadwal pengambilan tersendiri. Distribusi
              terbagi rapi ke beberapa sesi. Tidak ada lagi antrean membeludak — panitia tinggal scan, warga dilayani tertib.
            </p>

            {/* Zone progress visual */}
            <div className="space-y-3">
              {[
                { zone: 'RT 01 / RW 03 — Dusun Barat', done: 85, total: 85, time: '07.00 — 09.00' },
                { zone: 'RT 04 / RW 02 — Dusun Timur', done: 96, total: 120, time: '09.00 — 11.00' },
                { zone: 'RT 02 / RW 01 — Dusun Tengah', done: 42, total: 60, time: '11.00 — 13.00' },
              ].map((z) => {
                const pct = Math.round((z.done / z.total) * 100);
                return (
                  <div key={z.zone} className="rounded-xl bg-[#f2f4f6] px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#191c1e]">{z.zone}</span>
                      <span className={`text-xs font-bold ${pct === 100 ? 'text-[#004532]' : 'text-[#3f4944]/70'}`}>
                        {pct === 100 ? '✓ Selesai' : `${pct}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3f4944]/50 mb-2">Sesi: {z.time}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e0e3e5]">
                      <div className="h-full rounded-full bg-[#004532] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-[#3f4944]/50">{z.done} dari {z.total} penerima terlayani</p>
                  </div>
                );
              })}
            </div>

            {/* BG decoration */}
            <div className="pointer-events-none absolute right-0 bottom-0 select-none opacity-[0.03] text-[280px] leading-none text-[#004532]">⬤</div>
          </m.div>

          {/* ── Masalah 2: Kupon Difotokopi ── */}
          <m.div
            className="relative overflow-hidden rounded-3xl bg-[#004532] p-10 editorial-shadow md:col-span-5"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/60">
                <XCircle className="size-3.5" />
                Masalah #2 — Kupon Kertas Dipalsukan
              </div>

              <QrCode className="mb-6 size-10 text-[#6ffbbe]" />

              <h3 className="font-headline mb-3 text-2xl font-extrabold text-white">
                Kupon QR Unik Terenkripsi — Sekali Scan, Langsung Hangus Otomatis
              </h3>

              <div className="mb-5 rounded-2xl bg-red-900/30 border border-red-500/20 px-4 py-3">
                <p className="text-xs font-bold text-red-300 mb-2">⚠ Realita di lapangan:</p>
                <p className="text-xs text-red-200/70 leading-relaxed">
                  Satu kupon kertas difotokopi jadi 10–20 lembar. Satu porsi hewan kurban diklaim puluhan orang.
                  Panitia tidak bisa membedakan asli dari palsu — kerugian materi <span className="font-bold text-red-200">jutaan rupiah</span> per tahun.
                </p>
              </div>

              <p className="leading-relaxed text-white/70 mb-8">
                <span className="font-semibold text-[#6ffbbe]">Dengan Tawzii:</span>{' '}
                Setiap kupon memiliki kode QR unik yang dienkripsi di server. Begitu di-scan — sistem langsung
                menandai hangus dalam <span className="font-bold text-white">hitungan milidetik</span>. Tidak bisa dipindai dua kali,
                tidak bisa dipalsukan, tidak bisa dimanipulasi.
              </p>

              {/* Kupon status visual */}
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScanLine className="size-3.5 text-white/60" />
                      <span className="text-xs font-bold tracking-widest uppercase text-white/60">Kupon Asli</span>
                    </div>
                    <span className="chip-active">AKTIF</span>
                  </div>
                  <div className="font-mono text-sm tracking-tight text-white">#QRB-1446-X921·k8p2</div>
                  <div className="mt-1.5 text-xs text-white/40">Ibu Aminah · RT 04/RW 02 · 1 porsi ✓ Belum diambil</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 opacity-70">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-3.5 text-red-400" />
                      <span className="text-xs font-bold tracking-widest uppercase text-red-300/70">Fotokopi Ditolak</span>
                    </div>
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300">HANGUS</span>
                  </div>
                  <div className="font-mono text-sm tracking-tight text-white/30 line-through">#QRB-1446-X921·k8p2</div>
                  <div className="mt-1.5 text-xs text-red-300/50">Sudah digunakan pukul 08:32 — otomatis ditolak, alarm berbunyi</div>
                </div>
              </div>
            </div>

            {/* BG glow */}
            <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-[#006c49]/30 blur-3xl" />
          </m.div>

          {/* ── Masalah 3: Panitia Kewalahan Tanpa Data ── */}
          <m.div
            className="relative overflow-hidden rounded-3xl bg-[#191c1e] p-10 editorial-shadow md:col-span-12"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              {/* Text side */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/50">
                  <XCircle className="size-3.5" />
                  Masalah #3 — Panitia Kewalahan, Laporan Tidak Ada
                </div>

                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#a6f2d1]">
                  <ClipboardList className="size-7 text-[#004532]" />
                </div>

                <h3 className="font-headline mb-3 text-2xl font-extrabold text-white md:text-3xl">
                  Laporan Otomatis — Panitia Tidak Perlu Rekap Manual Lagi
                </h3>

                <div className="mb-5 rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                  <p className="text-xs font-bold text-white/60 mb-2">⚠ Keluhan panitia yang sering terjadi:</p>
                  <div className="space-y-2">
                    {[
                      '"Sampai jam 11 malam masih rekap data di Excel — besok Senin sudah harus laporan ke DKM."',
                      '"Berapa total porsi yang sudah dibagi? Hitungan kami beda-beda karena catatannya manual."',
                      '"Ketua takmir tanya bukti distribusi — kami tidak punya karena tidak sempat foto semua."',
                    ].map((q) => (
                      <p key={q} className="text-xs text-white/50 italic leading-relaxed">{q}</p>
                    ))}
                  </div>
                </div>

                <p className="leading-relaxed text-white/60 mb-2">
                  <span className="font-semibold text-[#6ffbbe]">Dengan Tawzii:</span>{' '}
                  Setiap scan kupon otomatis tercatat di sistem. Laporan distribusi per RT, per zona, dan per hewan
                  langsung tersedia — bisa diunduh PDF atau Excel kapan saja tanpa perlu input manual satu pun.
                  Panitia bisa fokus di lapangan, bukan di depan laptop.
                </p>

                {/* Stats row */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { val: '0 menit', label: 'Waktu rekap manual' },
                    { val: 'Otomatis', label: 'Laporan PDF & Excel' },
                    { val: 'Real-time', label: 'Data terupdate tiap scan' },
                    { val: '100%', label: 'Akurasi data terjamin' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/8 border border-white/10 px-4 py-3 text-center min-w-[100px]">
                      <p className="font-headline text-lg font-black text-[#6ffbbe]">{s.val}</p>
                      <p className="text-xs text-white/40">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laporan & aktivitas cards */}
              <div className="space-y-4">
                {/* Rekap distribusi card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-3">Rekap Distribusi Hari Ini</p>
                  <div className="space-y-3">
                    {[
                      { zona: 'RT 01–03 / Dusun Barat', total: 85, done: 85, warna: '#6ffbbe' },
                      { zona: 'RT 04–06 / Dusun Timur', total: 120, done: 96, warna: '#6ffbbe' },
                      { zona: 'RT 07–09 / Dusun Tengah', total: 60, done: 42, warna: '#facc15' },
                    ].map((z) => {
                      const pct = Math.round((z.done / z.total) * 100);
                      return (
                        <div key={z.zona}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-white/70">{z.zona}</span>
                            <span className="text-xs font-bold" style={{ color: z.warna }}>{pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: z.warna }} />
                          </div>
                          <p className="text-[10px] text-white/30 mt-1">{z.done}/{z.total} penerima terlayani</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Export card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-3">Laporan Siap Unduh</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Laporan Distribusi Lengkap', sub: '265 penerima · semua zona', badge: 'PDF', badgeColor: 'bg-red-500/20 text-red-300' },
                      { label: 'Rekap Per Hewan Kurban', sub: '8 hewan · total 265 porsi', badge: 'Excel', badgeColor: 'bg-green-500/20 text-green-300' },
                      { label: 'Daftar Penerima Lengkap', sub: 'Nama, RT/RW, status kupon', badge: 'PDF', badgeColor: 'bg-red-500/20 text-red-300' },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{r.label}</p>
                          <p className="text-[10px] text-white/30">{r.sub}</p>
                        </div>
                        <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${r.badgeColor}`}>{r.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BG glow */}
            <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#004532]/20 blur-[80px]" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-[#6ffbbe]/5 blur-[80px]" />
          </m.div>
        </m.div>

        {/* ── Why Tawzii Strip ── */}
        <m.div
          className="mt-10 rounded-3xl bg-[#004532] p-10 editorial-shadow"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#6ffbbe]/60 mb-2">Kenapa Pilih Tawzii?</p>
            <h3 className="font-headline text-2xl font-extrabold text-white md:text-3xl">
              Satu Platform. Semua yang Panitia Masjid Butuhkan.
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: QrCode, title: 'Kupon QR Anti-Palsu', desc: 'Setiap kupon unik & hangus otomatis setelah scan pertama' },
              { icon: ScanLine, title: 'Scan Offline Tetap Jalan', desc: 'Internet putus? Scan tetap bisa. Data sync otomatis saat online' },
              { icon: Truck, title: 'Distribusi Per Zona', desc: 'Warga dibagi per RT/RW/dusun dengan jadwal sesi terpisah' },
              { icon: BarChart3, title: 'Laporan PDF Otomatis', desc: 'Laporan resmi siap cetak, tidak perlu input manual lagi' },
              { icon: Shield, title: 'Data Aman & Terenkripsi', desc: 'Server Indonesia, backup otomatis, privasi data terjaga' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#6ffbbe]/15">
                  <f.icon className="size-5 text-[#6ffbbe]" />
                </div>
                <div>
                  <p className="font-headline text-sm font-bold text-white mb-1">{f.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </m.div>

        {/* Bottom proof strip */}
        <m.div
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
        >
          {[
            {
              icon: Shield,
              value: '0%',
              label: 'Kupon palsu berhasil lolos verifikasi',
              bg: 'bg-[#004532]',
              valueColor: 'text-[#6ffbbe]',
              labelColor: 'text-white/60',
            },
            {
              icon: ScanLine,
              value: '100%',
              label: 'Setiap distribusi terverifikasi QR scan',
              bg: 'bg-[#a6f2d1]',
              valueColor: 'text-[#004532]',
              labelColor: 'text-[#3f4944]',
            },
            {
              icon: BarChart3,
              value: 'Real-time',
              label: 'Laporan hewan & penerima kurban tersedia',
              bg: 'bg-white',
              valueColor: 'text-[#004532]',
              labelColor: 'text-[#3f4944]',
            },
          ].map((s) => (
            <m.div
              key={s.label}
              className={`flex items-center gap-4 rounded-2xl ${s.bg} p-6 editorial-shadow`}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/5">
                <s.icon className={`size-6 ${s.valueColor}`} />
              </div>
              <div>
                <p className={`font-headline text-2xl font-black ${s.valueColor}`}>{s.value}</p>
                <p className={`text-sm leading-tight ${s.labelColor}`}>{s.label}</p>
              </div>
            </m.div>
          ))}
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
      icon: QrCode,
      title: 'Scan QR Code — Verifikasi Instan',
      desc: 'Setiap penerima diverifikasi dengan scan QR unik. Tidak ada yang bisa klaim dua kali. Proses cepat, akurat, dan bisa dilakukan offline.',
    },
    {
      icon: FileText,
      title: 'Export Laporan PDF & Excel Otomatis',
      desc: 'Laporan distribusi lengkap — per penerima, per zona, per hewan — siap unduh kapan saja. Tidak perlu rekap manual.',
    },
    {
      icon: BarChart3,
      title: 'Live Dashboard Real-time',
      desc: 'Pantau progres distribusi langsung dari layar. Berapa yang sudah klaim, berapa yang belum — semua terlihat jelas secara real-time.',
    },
    {
      icon: Shield,
      title: 'Hak Akses Berbasis Role',
      desc: 'Kelola siapa yang bisa scan, input data, atau hanya melihat laporan. Panitia, operator lapangan, dan admin punya akses yang tepat.',
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
              <div className="inline-block rounded-full bg-[#a6f2d1] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#004532]">
                Fitur Unggulan
              </div>
            </m.div>
            <m.h2
              className="font-headline text-4xl font-extrabold leading-tight text-[#004532] md:text-5xl"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              Semua Alat yang{' '}
              <br />
              <span className="italic text-[#73332f]">Panitia Butuhkan.</span>
            </m.h2>
            <m.p
              className="max-w-md text-lg leading-relaxed text-[#3f4944]"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Dari scan di lapangan hingga laporan akhir — Tawzii menyediakan semua
              fitur yang dibutuhkan panitia masjid untuk mengelola distribusi kurban
              secara profesional.
            </m.p>
            <m.div className="space-y-5" variants={stagger}>
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
                    <p className="font-headline font-bold text-base text-[#191c1e]">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#3f4944]">{item.desc}</p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </m.div>

          {/* Right: App mockup */}
          <m.div
            className="relative w-full flex-1"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 -z-10 size-80 rounded-full bg-gradient-to-tr from-[#eceef0] to-white" />
            <div className="overflow-hidden rounded-3xl bg-white editorial-shadow p-4 space-y-3">

              {/* Live dashboard card */}
              <div className="rounded-2xl bg-[#004532] p-6">
                <p className="mb-1 text-xs font-bold tracking-widest uppercase text-[#6ffbbe]">
                  Live Dashboard
                </p>
                <p className="font-headline text-xl font-extrabold text-white mb-5">
                  Progres Distribusi Real-time
                </p>
                <div className="flex h-24 items-end gap-1.5">
                  {[40, 65, 80, 55, 90, 100, 85, 70, 50, 35, 20, 10].map((h, i) => (
                    <m.div
                      key={i}
                      className="flex-1 rounded-t-sm bg-[#6ffbbe]/20"
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${h}%` } : { height: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                    >
                      <div className="w-full rounded-t-sm bg-[#6ffbbe]" style={{ height: '60%' }} />
                    </m.div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Total Penerima', val: '2.840' },
                    { label: 'Terdistribusi', val: '2.180' },
                    { label: 'Progress', val: '77%' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-white/60">{s.label}</p>
                      <p className="font-headline text-lg font-bold text-white">{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Scan result card */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#e0e3e5] bg-[#f8faf8] px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a6f2d1]">
                  <QrCode className="size-5 text-[#004532]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#004532]">✓ Scan Berhasil</p>
                  <p className="truncate text-xs text-[#3f4944]/60">Bapak Suherman · RT 03/RW 01 · 1 porsi</p>
                </div>
                <span className="rounded-full bg-[#a6f2d1] px-2 py-0.5 text-[10px] font-black text-[#004532]">VALID</span>
              </div>

              {/* Export row */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#e0e3e5] bg-white px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f4f6]">
                  <FileText className="size-5 text-[#3f4944]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#191c1e]">Laporan Distribusi Idul Adha 1446H</p>
                  <p className="text-[10px] text-[#3f4944]/50">2.180 penerima · PDF &amp; Excel tersedia</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">PDF</span>
                  <span className="rounded-lg bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">XLS</span>
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
};

// Fitur yang tidak tersedia — tidak ditampilkan di kartu harga
const HIDDEN_FEATURES = new Set([
  'custom_branding',
  'email_notifications',
  'api_access',
  'priority_support',
]);

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
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6e8ea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#3f4944]/70">
              <span>🔒</span> Pembayaran Aman via Midtrans
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f5e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#004532]">
              <span>📱</span> QRIS & E-Wallet
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f5e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#004532]">
              <span>🏦</span> Virtual Account
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f5e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#004532]">
              <span>💳</span> Transfer Bank
            </span>
          </div>
          <p className="text-xs text-[#3f4944]/50 mt-2">Bayar pakai QRIS, GoPay, OVO, DANA, atau transfer bank — semua bisa</p>
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
              const enabledFeatures = Object.entries(features).filter(([k, v]) => v && !HIDDEN_FEATURES.has(k));
              const disabledFeatures = Object.entries(features).filter(([k, v]) => !v && !HIDDEN_FEATURES.has(k));

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
                    {/* Label top-up khusus paket Professional */}
                    {isPopular && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#6ffbbe]/20 border border-[#6ffbbe]/40 px-3 py-1.5">
                        <span className="text-[11px]">⚡</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6ffbbe]">
                          Bisa Top-up Kupon Tambahan
                        </span>
                      </div>
                    )}
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
                    href={plan.price_monthly === 0 ? '/register' : `/register?plan=${plan.slug}`}
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
              { label: 'Panduan', href: '/panduan' },
              { label: 'Blog', href: '/blog' },
              { label: 'FAQ', href: '/#faq' },
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

// --- JSON-LD Structured Data ---

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://tawzii.id/#website',
      url: 'https://tawzii.id',
      name: 'Tawzii Digital',
      description: 'Platform distribusi kurban digital untuk masjid di seluruh Indonesia',
      publisher: { '@id': 'https://tawzii.id/#organization' },
      inLanguage: 'id-ID',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://tawzii.id/?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://tawzii.id/#organization',
      name: 'Tawzii Digital by adilabs.id',
      url: 'https://tawzii.id',
      logo: { '@type': 'ImageObject', url: 'https://tawzii.id/logo.png' },
      sameAs: ['https://adilabs.id'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: 'Indonesian',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://tawzii.id/#webpage',
      url: 'https://tawzii.id',
      name: 'Tawzii Digital — Platform Distribusi Kurban Digital untuk Masjid',
      isPartOf: { '@id': 'https://tawzii.id/#website' },
      about: { '@id': 'https://tawzii.id/#organization' },
      description:
        'Cegah kupon palsu, atur distribusi per zona RT/RW, dan pantau transparansi hewan kurban secara real-time.',
      inLanguage: 'id-ID',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Tawzii Digital',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
        description: 'Paket gratis tersedia untuk masjid kecil',
      },
      featureList: [
        'Kupon QR terenkripsi anti-palsu',
        'Manajemen penerima kurban per zona',
        'Transparansi data hewan kurban real-time',
        'Laporan distribusi otomatis',
        'Dashboard live untuk panitia',
      ],
      url: 'https://tawzii.id',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Apa itu Tawzii Digital?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tawzii Digital adalah platform SaaS distribusi kurban berbasis QR Code untuk masjid dan organisasi Islam di Indonesia. Platform ini membantu mencegah kupon palsu, mengatur distribusi per zona wilayah, dan memantau transparansi hewan kurban secara real-time.',
          },
        },
        {
          '@type': 'Question',
          name: 'Bagaimana cara mencegah kupon kurban dipalsukan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tawzii Digital menggunakan kupon QR terenkripsi yang unik untuk setiap penerima. Setelah di-scan sekali, kupon langsung hangus dan tidak bisa digunakan lagi — sehingga pemalsuan atau fotokopi kupon tidak bisa terjadi.',
          },
        },
        {
          '@type': 'Question',
          name: 'Apakah Tawzii Digital gratis?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ya, Tawzii Digital menyediakan paket gratis untuk masjid dengan kebutuhan distribusi kecil. Tersedia juga paket berbayar dengan fitur lebih lengkap untuk distribusi skala besar.',
          },
        },
      ],
    },
  ],
};

// --- Payment Notification (needs Suspense wrapper because of useSearchParams) ---

function PaymentNotificationHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'failed') {
      toast.error('Pembayaran gagal atau dibatalkan.', {
        description: 'Anda dapat mencoba mendaftar kembali atau memilih paket lain.',
        duration: 8000,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Payment notification handler — must be in Suspense because of useSearchParams */}
      <Suspense fallback={null}>
        <PaymentNotificationHandler />
      </Suspense>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TransparencySection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
