'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion as m, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ScanLine, Info, Search, Sparkles, ShieldX, Ban } from 'lucide-react';
import { useDemoStore, type ScanResult } from '@/stores/demo.store';
import { DEMO_PENERIMA, DEMO_ZONA } from '@/content/demo-seed';
import { DemoCouponCard } from '@/components/coba/demo-coupon-card';

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

/* ─── Confetti-like particle burst for success ─── */
function SuccessParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        angle: (i / 16) * 360,
        distance: 60 + Math.random() * 50,
        size: 4 + Math.random() * 6,
        color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#22c55e'][i % 6],
        delay: Math.random() * 0.15,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.8,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Success checkmark with drawing animation ─── */
function AnimatedCheckmark() {
  return (
    <m.div
      className="relative flex size-20 items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
    >
      {/* Glowing background ring */}
      <m.div
        className="absolute inset-0 rounded-full bg-emerald-400/30"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.8, 1.4], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Second pulse ring */}
      <m.div
        className="absolute inset-0 rounded-full bg-emerald-400/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 2.5], opacity: [0.4, 0] }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
      />
      {/* Icon circle */}
      <m.div
        className="relative flex size-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 350 }}
      >
        <m.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <CheckCircle2 className="size-9 text-white" strokeWidth={2.5} />
        </m.div>
      </m.div>
    </m.div>
  );
}

/* ─── Rejected/duplicate X with shake animation ─── */
function AnimatedReject() {
  return (
    <m.div
      className="relative flex size-20 items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {/* Red flash ring */}
      <m.div
        className="absolute inset-0 rounded-full bg-rose-500/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 2], opacity: [0.5, 0] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Icon circle */}
      <m.div
        className="relative flex size-16 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/40"
        initial={{ scale: 0.6, rotate: 0 }}
        animate={{ scale: 1, rotate: [0, -12, 12, -6, 0] }}
        transition={{ delay: 0.05, duration: 0.5 }}
      >
        <XCircle className="size-9 text-white" strokeWidth={2.5} />
      </m.div>
    </m.div>
  );
}

export default function DemoScanPage() {
  const kupon = useDemoStore((s) => s.kupon);
  const previewScan = useDemoStore((s) => s.previewScan);
  const confirmScan = useDemoStore((s) => s.confirmScan);

  const [preview, setPreview] = useState<ScanResult | null>(null);
  const [filter, setFilter] = useState<'Semua' | 'Aktif' | 'Terpakai'>('Aktif');
  const [query, setQuery] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [lastConfirmedName, setLastConfirmedName] = useState('');

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
    // Scroll preview into view
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        document
          .getElementById('scan-preview')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function handleConfirm() {
    if (preview?.kind === 'success') {
      confirmScan(preview.kupon.id);
      setLastConfirmedName(preview.penerimaNama);
      setShowSuccessOverlay(true);
    }
    setPreview(null);
  }

  // Auto-hide success overlay
  useEffect(() => {
    if (!showSuccessOverlay) return;
    const timer = setTimeout(() => setShowSuccessOverlay(false), 2500);
    return () => clearTimeout(timer);
  }, [showSuccessOverlay]);

  return (
    <div className="space-y-6">
      {/* ═══ FULL-SCREEN SUCCESS OVERLAY ═══ */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <m.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-600/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessParticles />
            <AnimatedCheckmark />
            <m.p
              className="mt-6 text-center font-headline text-3xl font-extrabold text-white md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Scan Berhasil!
            </m.p>
            <m.p
              className="mt-2 flex items-center gap-2 text-center text-lg text-emerald-100"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Sparkles className="size-5" />
              Kupon {lastConfirmedName} sudah diverifikasi
            </m.p>
            <m.div
              className="mt-8 rounded-full bg-white/20 px-6 py-2 text-sm font-medium text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Menutup otomatis...
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

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

      {/* Preview hasil scan dengan animasi */}
      <div id="scan-preview">
        <AnimatePresence mode="wait">
          {preview && (
            <ScanResultCard
              key={`${preview.kind}-${preview.kind !== 'invalid' ? preview.kupon.id : ''}`}
              result={preview}
              onConfirm={handleConfirm}
              onCancel={() => setPreview(null)}
            />
          )}
        </AnimatePresence>
      </div>

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

      {/* Grid kupon — pakai DemoCouponCard versi compact */}
      <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
          {filtered.length} kupon — klik untuk simulasi scan
        </p>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#3f4944]/60">
            Tidak ada kupon yang cocok dengan filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((k) => {
              const p = DEMO_PENERIMA.find((x) => x.id === k.penerimaId);
              const z = p && DEMO_ZONA.find((zo) => zo.id === p.zonaId);
              if (!p || !z) return null;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => handleClick(k.id)}
                  className="group block text-left transition-transform active:scale-95 hover:-translate-y-0.5"
                >
                  <DemoCouponCard
                    kupon={k}
                    penerima={p}
                    zona={z}
                    variant="compact"
                  />
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
      <m.div
        initial={{ opacity: 0, scale: 0.92, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white shadow-xl shadow-emerald-100/40"
      >
        {/* Animated success pulse banner */}
        <div className="relative overflow-hidden bg-emerald-50 px-6 py-5">
          <m.div
            className="absolute -left-10 top-1/2 size-24 -translate-y-1/2 rounded-full bg-emerald-300/40"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 2.5], opacity: [0.7, 0] }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <m.div
            className="absolute right-10 top-1/2 size-16 -translate-y-1/2 rounded-full bg-emerald-200/40"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 3], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 }}
          />
          <div className="relative flex items-center gap-3">
            <m.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 350 }}
              className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
            >
              <CheckCircle2 className="size-7" strokeWidth={2.5} />
            </m.div>
            <div>
              <m.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="font-headline text-lg font-extrabold text-emerald-900"
              >
                Kupon Valid — Siap Diambil
              </m.p>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 text-xs text-emerald-700"
              >
                <Sparkles className="size-3" />
                Scan berhasil — konfirmasi untuk update status
              </m.p>
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
      </m.div>
    );
  }

  if (result.kind === 'duplicate') {
    return (
      <m.div
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: 1,
          x: [0, -16, 16, -12, 12, -6, 6, 0],
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="overflow-hidden rounded-3xl border-2 border-rose-300 bg-white shadow-xl shadow-rose-100/40"
      >
        {/* Rejected banner with red flash */}
        <div className="relative overflow-hidden bg-rose-50 px-6 py-5">
          {/* Red flash overlay */}
          <m.div
            className="absolute inset-0 bg-rose-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
          />
          {/* Second red flash */}
          <m.div
            className="absolute inset-0 bg-rose-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <div className="relative flex items-center gap-3">
            <m.div
              initial={{ scale: 0.6, rotate: 0 }}
              animate={{ scale: 1, rotate: [0, -12, 12, -6, 0] }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="flex size-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/40"
            >
              <Ban className="size-7" strokeWidth={2.5} />
            </m.div>
            <div>
              <m.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="font-headline text-lg font-extrabold text-rose-900"
              >
                Kupon Tidak Bisa Diambil!
              </m.p>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-1.5 text-xs text-rose-700"
              >
                <ShieldX className="size-3" />
                Kupon ini sudah pernah dipakai sebelumnya
              </m.p>
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
            <m.span
              className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              TERPAKAI
            </m.span>
          </div>

          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 rounded-2xl bg-[#f7f9fb] p-4 text-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
              Riwayat Scan Pertama
            </p>
            <p className="mt-2 text-[#191c1e]">
              <span className="font-bold">{formatDateTime(result.scanAt)}</span>{' '}
              · oleh{' '}
              <span className="font-bold">{result.scanBy}</span>
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-3 flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50/50 p-3 text-xs text-rose-800"
          >
            <ShieldX className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
            <p>
              <strong>Anti-fraud aktif:</strong> Kupon yang sudah di-scan tidak bisa dipakai lagi, meskipun QR-nya di-fotocopy atau di-screenshot.
            </p>
          </m.div>

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
      </m.div>
    );
  }

  // invalid
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-lg"
    >
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
    </m.div>
  );
}
