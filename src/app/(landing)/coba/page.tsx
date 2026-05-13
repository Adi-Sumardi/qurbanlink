import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  LayoutDashboard,
  ScanLine,
  Ticket,
  FileBarChart2,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Coba Tawzii Tanpa Daftar — Demo Interaktif Platform Kurban Digital',
  description:
    'Coba dashboard, scan kupon QR, dan lihat laporan distribusi kurban — semua tanpa email, tanpa daftar. Akses langsung dengan data simulasi.',
  alternates: { canonical: 'https://tawzii.id/coba' },
  openGraph: {
    title: 'Coba Tawzii Tanpa Daftar',
    description:
      'Masuk ke dashboard simulasi, scan kupon QR, dan rasakan platform kurban digital sebelum mendaftar.',
    url: 'https://tawzii.id/coba',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Live',
    desc: 'Pantau progres distribusi real-time dengan KPI & breakdown zona RT/RW.',
  },
  {
    icon: ScanLine,
    title: 'Scan Kupon QR',
    desc: 'Coba scan 50 kupon simulasi — kupon yang sudah terpakai otomatis ditolak.',
  },
  {
    icon: Ticket,
    title: '50 Kupon Aktif',
    desc: 'Lihat daftar kupon dengan filter status, zona, dan pencarian nama penerima.',
  },
  {
    icon: FileBarChart2,
    title: 'Preview Laporan',
    desc: 'Lihat seperti apa laporan PDF & Excel yang akan dikirim ke donatur Anda.',
  },
];

export default function CobaLandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="border-b border-[#eceef0] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Tawzii Digital"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-headline text-sm font-extrabold text-[#004532]">
              Tawzii Digital
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-xs font-bold text-[#3f4944] transition-colors hover:text-[#004532] sm:inline-flex"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#004532] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#003524]"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white pb-16 pt-16 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-800">
            <Sparkles className="size-3" />
            Mode Demo Interaktif
          </div>

          <h1 className="font-headline mt-6 text-4xl font-extrabold leading-tight text-[#191c1e] md:text-6xl">
            Coba Tawzii sekarang —{' '}
            <span className="text-[#004532]">tanpa daftar.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-[#3f4944] md:text-lg">
            Masuk ke dashboard simulasi, scan kupon QR, dan lihat laporan
            otomatis. Semua tanpa email, tanpa password, tanpa commitment.
          </p>

          <div className="mt-8">
            <Link
              href="/coba/dashboard"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-extrabold font-headline shadow-xl shadow-[#004532]/20 transition-all active:scale-95 hover:opacity-90"
            >
              Mulai Demo Sekarang
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#3f4944] md:text-sm">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="size-4 text-[#004532]" />
              Data masjid simulasi
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="size-4 text-[#004532]" />
              Tidak menyimpan apapun di server
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="size-4 text-[#004532]" />
              Reset dengan satu klik
            </li>
          </ul>
        </div>
      </section>

      {/* What's inside */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#004532]">
              Apa yang bisa Anda coba
            </p>
            <h2 className="font-headline mt-3 text-3xl font-extrabold text-[#191c1e] md:text-4xl">
              4 modul interaktif siap pakai
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#a6f2d1] text-[#004532]">
                  <f.icon className="size-6" />
                </div>
                <h3 className="font-headline text-base font-extrabold text-[#191c1e] md:text-lg">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[#3f4944]">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/coba/dashboard"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-extrabold font-headline shadow-xl shadow-[#004532]/20 transition-all active:scale-95 hover:opacity-90"
            >
              Mulai Demo Sekarang
              <ArrowRight className="size-5" />
            </Link>
            <p className="mt-4 text-xs text-[#3f4944]/70">
              Demo terbuka 24/7 · Tidak ada batasan waktu
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eceef0] bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-[#3f4944]/50">
          © {new Date().getFullYear()} adilabs.id. Seluruh hak dilindungi.
        </div>
      </footer>
    </main>
  );
}
