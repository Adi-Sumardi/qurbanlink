import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PANDUAN_MODULES } from '@/content/panduan';

export const metadata: Metadata = {
  title: 'Panduan Penggunaan — Handbook Modul Tawzii Digital',
  description:
    'Panduan lengkap penggunaan aplikasi Tawzii Digital: dari setup event kurban, manajemen hewan, kupon QR, scan distribusi, hingga laporan. Handbook resmi untuk panitia masjid.',
  alternates: { canonical: 'https://tawzii.id/panduan' },
  openGraph: {
    title: 'Panduan Penggunaan Tawzii Digital',
    description:
      'Handbook lengkap tiap modul aplikasi untuk panitia kurban masjid.',
    url: 'https://tawzii.id/panduan',
    type: 'website',
  },
};

export default function PanduanIndexPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
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
          <Link
            href="/register"
            className="hidden rounded-full bg-[#004532] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#003524] md:inline-flex"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#3f4944] transition-colors hover:text-[#004532]"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Beranda
          </Link>
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#004532]">
            Handbook Aplikasi
          </p>
          <h1 className="font-headline text-4xl font-extrabold text-[#191c1e] md:text-5xl">
            Panduan Penggunaan Tawzii Digital
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#3f4944] md:text-lg">
            Dokumentasi lengkap setiap modul aplikasi — dari setup event,
            manajemen hewan kurban, kupon QR, scan distribusi, hingga laporan
            akhir. Klik salah satu modul untuk panduan detail.
          </p>
        </div>
      </section>

      {/* Module Grid */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PANDUAN_MODULES.map((m) => (
              <Link
                key={m.slug}
                href={`/panduan/${m.slug}`}
                className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:p-7"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#a6f2d1] text-[#004532]">
                  <m.icon className="size-6" />
                </div>
                <h2 className="font-headline text-lg font-extrabold text-[#191c1e] group-hover:text-[#004532] md:text-xl">
                  {m.title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-[#3f4944]">
                  {m.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#004532]">
                  Baca panduan
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-10 text-center text-white shadow-lg">
            <h3 className="font-headline text-2xl font-extrabold md:text-3xl">
              Siap memulai distribusi kurban modern?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
              Daftarkan masjid Anda sekarang — gratis, tanpa kartu kredit, dan
              bisa langsung dipakai untuk event terdekat.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-[#004532] shadow-xl transition-all hover:opacity-90 active:scale-95"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eceef0] bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-[#3f4944]/50">
          © {new Date().getFullYear()} adilabs.id. Seluruh hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
