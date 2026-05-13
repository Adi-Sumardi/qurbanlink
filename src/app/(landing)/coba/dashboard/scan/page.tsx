'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, ScanLine, Info, Search } from 'lucide-react';
import { useDemoStore, type ScanResult } from '@/stores/demo.store';
import { DEMO_PENERIMA, DEMO_ZONA } from '@/content/demo-seed';

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Mini 7x7 QR-like pattern, deterministic by id */
function MiniQr({ id }: { id: string }) {
  // Hash sederhana untuk pseudo-random pattern berdasar id
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => {
    // Corner markers (top-left, top-right, bottom-left) = always on at ring
    const row = Math.floor(i / 7);
    const col = i % 7;
    if (
      (row < 3 && col < 3) ||
      (row < 3 && col > 3) ||
      (row > 3 && col < 3)
    ) {
      const isCorner =
        row === 0 || row === 2 || col === 0 || col === 2 ||
        (row === 1 && col === 1) ||
        (row > 3 && row === 6) ||
        (col > 3 && col === 6);
      return isCorner;
    }
    return ((seed * (i + 1)) % 7) > 3;
  });
  return (
    <div className="grid size-12 grid-cols-7 gap-px">
      {cells.map((on, i) => (
        <div key={i} className={on ? 'bg-[#191c1e]' : 'bg-transparent'} />
      ))}
    </div>
  );
}

export default function DemoScanPage() {
  const kupon = useDemoStore((s) => s.kupon);
  const previewScan = useDemoStore((s) => s.previewScan);
  const confirmScan = useDemoStore((s) => s.confirmScan);

  const [preview, setPreview] = useState<ScanResult | null>(null);
  const [filter, setFilter] = useState<'Semua' | 'Aktif' | 'Terpakai'>('Aktif');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kupon.filter((k) => {
      if (filter !== 'Semua' && k.status !== filter) return false;
      if (!q) return true;
      const p = DEMO_PENERIMA.find((x) => x.id === k.penerimaId);
      return (
        k.id.toLowerCase().includes(q) ||
        (p?.nama.toLowerCase().includes(q) ?? false)
      );
    });
  }, [kupon, filter, query]);

  function handleClick(id: string) {
    const result = previewScan(id);
    setPreview(result);
  }

  function handleConfirm() {
    if (preview?.kind === 'success') {
      confirmScan(preview.kupon.id);
    }
    setPreview(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#a6f2d1] text-[#004532]">
            <ScanLine className="size-6" />
          </div>
          <div className="flex-1">
            <h1 className="font-headline text-2xl font-extrabold text-[#191c1e] md:text-3xl">
              Scan QR — Mode Simulasi
            </h1>
            <p className="mt-2 text-sm text-[#3f4944] md:text-base">
              Di kondisi nyata, petugas mengarahkan kamera HP ke QR Code kupon.
              Di demo ini, klik salah satu kupon di bawah untuk simulasi scan.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
          <p>
            <strong>Coba juga:</strong> klik kupon yang berstatus{' '}
            <strong className="text-rose-700">Terpakai</strong> — sistem akan
            menolaknya. Ini bukti anti-fraud — kupon tidak bisa dipakai dua
            kali, meskipun di-fotocopy.
          </p>
        </div>
      </div>

      {/* Preview hasil scan */}
      {preview && (
        <ScanResultCard
          result={preview}
          onConfirm={handleConfirm}
          onCancel={() => setPreview(null)}
        />
      )}

      {/* Filter bar */}
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kupon atau nama penerima…"
              className="w-full rounded-full border border-[#eceef0] bg-[#f7f9fb] py-2.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder:text-[#3f4944]/50 focus:border-[#004532] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6f2d1]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['Aktif', 'Terpakai', 'Semua'] as const).map((f) => {
              const count =
                f === 'Semua'
                  ? kupon.length
                  : kupon.filter((k) => k.status === f).length;
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#004532] text-white'
                      : 'bg-[#f2f4f6] text-[#3f4944] hover:bg-[#e6e8ea]'
                  }`}
                >
                  {f} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid kupon */}
      <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
          {filtered.length} kupon
        </p>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#3f4944]/60">
            Tidak ada kupon yang cocok dengan filter.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((k) => {
              const p = DEMO_PENERIMA.find((x) => x.id === k.penerimaId);
              const z = p && DEMO_ZONA.find((zo) => zo.id === p.zonaId);
              const isTerpakai = k.status === 'Terpakai';
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => handleClick(k.id)}
                  className={`group flex flex-col items-center rounded-2xl border-2 p-3 text-left transition-all active:scale-95 ${
                    isTerpakai
                      ? 'border-[#f2f4f6] bg-[#f7f9fb] opacity-70 hover:opacity-100'
                      : 'border-[#eceef0] bg-white hover:-translate-y-0.5 hover:border-[#004532]/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[#191c1e]">
                      {k.id}
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        isTerpakai
                          ? 'bg-[#eceef0] text-[#3f4944]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {k.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="my-2 flex w-full justify-center rounded-lg bg-[#f7f9fb] p-2">
                    <MiniQr id={k.id} />
                  </div>
                  <p className="line-clamp-1 w-full text-[11px] font-bold text-[#191c1e]">
                    {p?.nama ?? '—'}
                  </p>
                  <p className="line-clamp-1 w-full text-[10px] text-[#3f4944]/60">
                    {z?.nama ?? '—'}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ScanResultCard({
  result,
  onConfirm,
  onCancel,
}: {
  result: ScanResult;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (result.kind === 'success') {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white shadow-lg shadow-emerald-100/40">
        <div className="bg-emerald-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-600" />
            <div>
              <p className="font-headline text-base font-extrabold text-emerald-900">
                Kupon Valid — Siap Diambil
              </p>
              <p className="text-xs text-emerald-700">
                Scan berhasil dalam 2.1 detik
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold text-[#3f4944]/60">
                {result.kupon.id}
              </p>
              <p className="font-headline mt-1 text-xl font-extrabold text-[#191c1e]">
                {result.penerimaNama}
              </p>
              <p className="mt-1 text-sm text-[#3f4944]">
                {result.zona} · 1 paket (≈2.5 kg)
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
              AKTIF
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-md transition-all active:scale-95 hover:bg-emerald-700"
            >
              <CheckCircle2 className="size-4" />
              Konfirmasi Ambil
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full bg-[#f2f4f6] px-6 py-3 text-sm font-bold text-[#3f4944] transition-colors hover:bg-[#e6e8ea]"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result.kind === 'duplicate') {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-white shadow-lg shadow-rose-100/40">
        <div className="bg-rose-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <XCircle className="size-6 text-rose-600" />
            <div>
              <p className="font-headline text-base font-extrabold text-rose-900">
                Kupon Sudah Dipakai
              </p>
              <p className="text-xs text-rose-700">
                Kupon ini tidak bisa dipakai dua kali
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold text-[#3f4944]/60">
                {result.kupon.id}
              </p>
              <p className="font-headline mt-1 text-xl font-extrabold text-[#191c1e]">
                {result.penerimaNama}
              </p>
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800">
              TERPAKAI
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-[#f7f9fb] p-4 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
              Riwayat Scan Pertama
            </p>
            <p className="mt-2 text-[#191c1e]">
              <span className="font-bold">{formatDateTime(result.scanAt)}</span>{' '}
              · oleh{' '}
              <span className="font-bold">{result.scanBy}</span>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-full bg-[#f2f4f6] px-6 py-3 text-sm font-bold text-[#3f4944] transition-colors hover:bg-[#e6e8ea]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // invalid
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <XCircle className="size-6 text-rose-600" />
        <p className="font-headline text-base font-extrabold text-rose-900">
          Kupon Tidak Dikenal
        </p>
      </div>
      <p className="mt-2 text-sm text-[#3f4944]">{result.reason}</p>
      <button
        type="button"
        onClick={onCancel}
        className="mt-4 w-full rounded-full bg-[#f2f4f6] px-6 py-3 text-sm font-bold text-[#3f4944] hover:bg-[#e6e8ea]"
      >
        Tutup
      </button>
    </div>
  );
}
