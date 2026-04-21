'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  ScanLine, CheckCircle, XCircle, AlertTriangle,
  Keyboard, Camera, Loader2, History,
} from 'lucide-react';
import { motion as m, AnimatePresence } from 'motion/react';
import { QrScanner } from '@/components/scanner/qr-scanner';
import { useActiveEvent } from '@/hooks/use-active-event';
import { scanService } from '@/services/scan.service';
import { SCAN_RESULT_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import type { Scan } from '@/types';

const RESULT_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-[#a6f2d1]',
    iconColor: 'text-[#004532]',
    label: 'Berhasil',
    textColor: 'text-[#004532]',
  },
  already_claimed: {
    icon: AlertTriangle,
    bg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    label: 'Sudah Diklaim',
    textColor: 'text-amber-800',
  },
  invalid: {
    icon: XCircle,
    bg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
    label: 'Tidak Valid',
    textColor: 'text-[#652925]',
  },
  expired: {
    icon: XCircle,
    bg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
    label: 'Kadaluarsa',
    textColor: 'text-[#652925]',
  },
  voided: {
    icon: XCircle,
    bg: 'bg-[#ffdad6]',
    iconColor: 'text-[#ba1a1a]',
    label: 'Dibatalkan',
    textColor: 'text-[#652925]',
  },
} as const;

function ScanResultCard({ scan }: { scan: Scan }) {
  const cfg = RESULT_CONFIG[scan.scan_result as keyof typeof RESULT_CONFIG] ?? RESULT_CONFIG.invalid;
  const Icon = cfg.icon;
  return (
    <m.div
      className={`rounded-2xl p-6 ${cfg.bg}`}
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-white/60">
          <Icon className={`size-10 ${cfg.iconColor}`} />
        </div>
        <div>
          <h3 className={`font-headline text-2xl font-extrabold ${cfg.textColor}`}>
            {SCAN_RESULT_LABELS[scan.scan_result] || cfg.label}
          </h3>
          {scan.coupon && (
            <div className="mt-3 space-y-1 text-sm">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2">
                <span className="font-mono font-bold tracking-widest text-[#191c1e]">
                  {scan.coupon.coupon_number}
                </span>
              </div>
              {scan.coupon.recipient && (
                <p className="mt-2 font-semibold text-[#191c1e]">
                  {scan.coupon.recipient.name}
                </p>
              )}
              {scan.coupon.recipient?.portions && (
                <p className="text-[#3f4944]">
                  {scan.coupon.recipient.portions} porsi
                </p>
              )}
            </div>
          )}
          <p className="mt-3 text-xs text-[#3f4944]/60">
            {formatDateTime(scan.scanned_at)}
          </p>
        </div>
      </div>
    </m.div>
  );
}

export default function ScanPage() {
  const { activeEvent } = useActiveEvent();
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [lastScan, setLastScan] = useState<Scan | null>(null);
  const [scanHistory, setScanHistory] = useState<Scan[]>([]);

  const handleScanResult = useCallback((scan: Scan) => {
    setLastScan(scan);
    setScanHistory((prev) => [scan, ...prev].slice(0, 50));
    if (scan.scan_result === 'success') {
      toast.success('Kupon berhasil di-scan!');
    } else {
      toast.warning(SCAN_RESULT_LABELS[scan.scan_result] || 'Scan gagal');
    }
  }, []);

  const scanMutation = useMutation({
    mutationFn: (payload: string) =>
      scanService.scan(activeEvent!.id, { qr_payload: payload, scan_method: 'qr' }),
    onSuccess: (data) => handleScanResult(data.data),
    onError: () => toast.error('Gagal memproses scan'),
  });

  const manualMutation = useMutation({
    mutationFn: (code: string) =>
      scanService.manualScan(activeEvent!.id, { coupon_number: code }),
    onSuccess: (data) => { handleScanResult(data.data); setManualCode(''); },
    onError: () => toast.error('Gagal memproses scan manual'),
  });

  const handleQrScan = useCallback((decodedText: string) => {
    if (!activeEvent || scanMutation.isPending) return;
    scanMutation.mutate(decodedText);
  }, [activeEvent, scanMutation]);

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim() || !activeEvent) return;
    manualMutation.mutate(manualCode.trim().toUpperCase());
  }, [manualCode, activeEvent, manualMutation]);

  if (!activeEvent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-[#a6f2d1]">
          <ScanLine className="size-10 text-[#004532]" />
        </div>
        <h2 className="font-headline text-xl font-bold text-[#191c1e]">
          Pilih Event Terlebih Dahulu
        </h2>
        <p className="max-w-xs text-sm text-[#3f4944]">
          Pilih event aktif dari sidebar untuk mulai melakukan scan kupon
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
          Verifikasi Kupon
        </p>
        <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Scan Kupon</h1>
        <p className="mt-1 text-sm text-[#3f4944]">{activeEvent.name}</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex rounded-2xl bg-[#e6e8ea] p-1">
        {(['camera', 'manual'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === tab
                ? 'bg-white text-[#004532] shadow-sm'
                : 'text-[#3f4944]/60 hover:text-[#3f4944]'
            }`}
          >
            {tab === 'camera' ? (
              <><Camera className="size-4" /> Kamera</>
            ) : (
              <><Keyboard className="size-4" /> Manual</>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'camera' ? (
          <m.div
            key="camera"
            className="overflow-hidden rounded-2xl bg-white editorial-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-6">
              <QrScanner onScan={handleQrScan} enabled={activeTab === 'camera'} />
              {scanMutation.isPending && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f2f4f6] p-3 text-sm text-[#3f4944]">
                  <Loader2 className="size-4 animate-spin text-[#004532]" />
                  Memproses scan...
                </div>
              )}
            </div>
          </m.div>
        ) : (
          <m.div
            key="manual"
            className="rounded-2xl bg-white p-6 editorial-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-headline mb-4 font-bold text-[#191c1e]">
              Masukkan Nomor Kupon
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                placeholder="Contoh: QRB-K7M3X9P"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                autoFocus
                maxLength={15}
                className="w-full rounded-xl bg-[#f2f4f6] py-4 px-5 font-mono text-lg tracking-widest text-[#191c1e] placeholder-[#3f4944]/30 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#004532]"
              />
              <p className="text-xs text-[#3f4944]/60">
                Masukkan nomor kupon yang tercetak pada kartu kupon penerima
              </p>
              <button
                type="submit"
                disabled={!manualCode.trim() || manualMutation.isPending}
                className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold font-headline shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {manualMutation.isPending
                  ? <Loader2 className="size-5 animate-spin" />
                  : <ScanLine className="size-5" />
                }
                {manualMutation.isPending ? 'Memproses...' : 'Verifikasi Kupon'}
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {lastScan && <ScanResultCard scan={lastScan} />}
      </AnimatePresence>

      {/* History */}
      {scanHistory.length > 0 && (
        <div className="rounded-2xl bg-white editorial-shadow overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[rgba(190,201,194,0.2)] px-6 py-4">
            <History className="size-4 text-[#3f4944]/50" />
            <h3 className="font-headline font-bold text-[#191c1e]">Riwayat Scan</h3>
            <span className="ml-auto rounded-full bg-[#f2f4f6] px-2 py-0.5 text-xs font-bold text-[#3f4944]">
              {scanHistory.length}
            </span>
          </div>
          <div className="divide-y divide-[rgba(190,201,194,0.15)] px-6">
            {scanHistory.map((scan, i) => {
              const cfg = RESULT_CONFIG[scan.scan_result as keyof typeof RESULT_CONFIG] ?? RESULT_CONFIG.invalid;
              const Icon = cfg.icon;
              return (
                <div key={`${scan.id}-${i}`} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${cfg.iconColor}`} />
                    <div>
                      <span className="font-mono text-sm font-semibold text-[#191c1e]">
                        {scan.coupon?.coupon_number || '-'}
                      </span>
                      {scan.coupon?.recipient && (
                        <span className="ml-2 text-xs text-[#3f4944]/60">
                          {scan.coupon.recipient.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.textColor}`}>
                    {SCAN_RESULT_LABELS[scan.scan_result] || scan.scan_result}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
