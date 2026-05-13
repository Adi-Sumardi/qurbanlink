'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Lock, Printer, Download } from 'lucide-react';
import { useDemoStore } from '@/stores/demo.store';
import { DEMO_PENERIMA, DEMO_ZONA } from '@/content/demo-seed';

export default function DemoKuponPage() {
  const kupon = useDemoStore((s) => s.kupon);
  const [filter, setFilter] = useState<'Semua' | 'Aktif' | 'Terpakai'>('Semua');
  const [zonaFilter, setZonaFilter] = useState<string>('Semua');
  const [query, setQuery] = useState('');

  const enriched = useMemo(
    () =>
      kupon.map((k) => {
        const p = DEMO_PENERIMA.find((x) => x.id === k.penerimaId)!;
        const z = DEMO_ZONA.find((zo) => zo.id === p.zonaId)!;
        return { ...k, penerima: p, zona: z };
      }),
    [kupon]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((row) => {
      if (filter !== 'Semua' && row.status !== filter) return false;
      if (zonaFilter !== 'Semua' && row.zona.id !== zonaFilter) return false;
      if (!q) return true;
      return (
        row.id.toLowerCase().includes(q) ||
        row.penerima.nama.toLowerCase().includes(q)
      );
    });
  }, [enriched, filter, zonaFilter, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="font-headline text-2xl font-extrabold text-[#191c1e] md:text-3xl">
          Daftar Kupon QR
        </h1>
        <p className="mt-2 text-sm text-[#3f4944]">
          {kupon.length} kupon ·{' '}
          {kupon.filter((k) => k.status === 'Aktif').length} aktif ·{' '}
          {kupon.filter((k) => k.status === 'Terpakai').length} terpakai
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kupon atau nama penerima…"
              className="w-full rounded-full border border-[#eceef0] bg-[#f7f9fb] py-2.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder:text-[#3f4944]/50 focus:border-[#004532] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6f2d1]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(['Semua', 'Aktif', 'Terpakai'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    filter === f
                      ? 'bg-[#004532] text-white'
                      : 'bg-[#f2f4f6] text-[#3f4944] hover:bg-[#e6e8ea]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="h-6 w-px bg-[#eceef0]" />

            <select
              value={zonaFilter}
              onChange={(e) => setZonaFilter(e.target.value)}
              className="rounded-full border border-[#eceef0] bg-[#f7f9fb] px-4 py-2 text-xs font-bold text-[#3f4944] focus:border-[#004532] focus:outline-none"
            >
              <option value="Semua">Semua Zona</option>
              {DEMO_ZONA.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f2f4f6] pt-4">
          <p className="text-xs text-[#3f4944]/60">
            Menampilkan {filtered.length} dari {kupon.length} kupon
          </p>
          <div className="flex flex-wrap gap-2">
            <DisabledAction icon={Printer} label="Cetak Batch PDF" />
            <DisabledAction icon={Download} label="Export Excel" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#eceef0] bg-[#f7f9fb] text-left text-xs font-bold uppercase tracking-wider text-[#3f4944]/70">
                <th className="px-5 py-3.5 font-mono">ID</th>
                <th className="px-5 py-3.5">Penerima</th>
                <th className="px-5 py-3.5">Zona</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#3f4944]/60">
                    Tidak ada kupon yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#f2f4f6] last:border-0 hover:bg-[#f7f9fb]"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#191c1e]">
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#191c1e]">
                      {row.penerima.nama}
                    </td>
                    <td className="px-5 py-3.5 text-[#3f4944]">{row.zona.nama}</td>
                    <td className="px-5 py-3.5 text-[#3f4944]">
                      {row.penerima.kategori}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          row.status === 'Terpakai'
                            ? 'bg-[#f2f4f6] text-[#3f4944]'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            row.status === 'Terpakai'
                              ? 'bg-[#3f4944]/40'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade nudge */}
      <Link
        href="/register"
        className="block rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-6 text-center text-white shadow-lg md:p-8"
      >
        <p className="text-xs font-black uppercase tracking-widest text-[#6ffbbe]">
          Tersedia Setelah Daftar
        </p>
        <p className="font-headline mt-2 text-xl font-extrabold md:text-2xl">
          Cetak kupon PDF, kirim via WhatsApp, export Excel
        </p>
        <p className="mt-2 text-sm text-white/80">
          Semua aksi di atas aktif begitu Anda daftarkan masjid. Gratis untuk
          paket Free.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#004532] shadow-xl">
          Daftar Gratis →
        </span>
      </Link>
    </div>
  );
}

function DisabledAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span
      title="Tersedia setelah daftar"
      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#f7f9fb] px-4 py-2 text-xs font-bold text-[#3f4944]/50 ring-1 ring-[#eceef0]"
    >
      <Lock className="size-3" />
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
