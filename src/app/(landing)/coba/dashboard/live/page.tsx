'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Activity,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demo.store';
import {
  DEMO_EVENT,
  DEMO_MASJID,
  DEMO_PENERIMA,
  DEMO_ZONA,
  type DemoScanLog,
} from '@/content/demo-seed';

const FEED_ITEM_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    badgeBg: 'bg-green-500/15 text-green-400',
    label: 'Berhasil',
  },
  duplicate: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badgeBg: 'bg-amber-500/15 text-amber-400',
    label: 'Sudah Diambil',
  },
  invalid: {
    icon: XCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badgeBg: 'bg-red-500/15 text-red-400',
    label: 'Tidak Valid',
  },
} as const;

function maskName(name: string): string {
  // Mask: "Bp. Suparman" → "Bp. Sup***"
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 3) + '***';
  const last = parts[parts.length - 1];
  parts[parts.length - 1] = last.slice(0, 3) + '***';
  return parts.join(' ');
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.floor(diff / 60_000));
  if (m < 60) return `${m}m yang lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j yang lalu`;
  return `${Math.floor(h / 24)}h yang lalu`;
}

export default function DemoLiveDashboardPage() {
  const kupon = useDemoStore((s) => s.kupon);
  const scanLog = useDemoStore((s) => s.scanLog);

  // Force re-render tiap 30s untuk update "x menit lalu"
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const total = kupon.length;
    const distributed = kupon.filter((k) => k.status === 'Terpakai').length;
    const unclaimed = total - distributed;
    const pct = total ? Math.round((distributed / total) * 100) : 0;
    return { total, distributed, unclaimed, pct };
  }, [kupon]);

  const perZona = useMemo(() => {
    return DEMO_ZONA.map((z) => {
      const penerimaIds = new Set(
        DEMO_PENERIMA.filter((p) => p.zonaId === z.id).map((p) => p.id)
      );
      const kuponZona = kupon.filter((k) => penerimaIds.has(k.penerimaId));
      const used = kuponZona.filter((k) => k.status === 'Terpakai').length;
      const total = kuponZona.length;
      const pct = total ? Math.round((used / total) * 100) : 0;
      return { nama: z.nama, used, total, pct };
    });
  }, [kupon]);

  return (
    <div className="-mx-4 -my-6 flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden bg-slate-900 text-white md:-mx-6 lg:-my-6">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-700/50 bg-slate-900/80 px-3 py-2 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 sm:gap-2 sm:px-3 sm:py-1 sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              LIVE
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-white sm:text-xl">
                {DEMO_EVENT.nama}
              </h1>
              <p className="truncate text-xs text-slate-400 sm:text-sm">
                {DEMO_MASJID.nama}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 text-right text-xs text-slate-500 sm:block">
            Powered by{' '}
            <span className="font-semibold text-green-500">Tawzii Digital</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row lg:gap-5 lg:p-5">
        {/* Left column */}
        <div className="flex shrink-0 flex-col gap-3 lg:w-[55%] lg:min-h-0 lg:flex-1 lg:gap-4">
          {/* Stat Cards */}
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            <StatCard
              title="Total Kupon"
              value={stats.total}
              icon={Ticket}
              color="text-blue-400"
            />
            <StatCard
              title="Terdistribusi"
              value={stats.distributed}
              icon={CheckCircle}
              color="text-green-400"
            />
            <StatCard
              title="Belum Diambil"
              value={stats.unclaimed}
              icon={Clock}
              color="text-amber-400"
            />
            <StatCard
              title="Progress"
              value={`${stats.pct}%`}
              icon={TrendingUp}
              color="text-emerald-400"
            />
          </div>

          {/* Main Progress */}
          <div className="shrink-0 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 sm:text-sm">
                Progress Keseluruhan
              </span>
              <span className="text-lg font-bold text-green-400 sm:text-2xl">
                {stats.pct}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-700 sm:h-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-xs text-slate-400 sm:mt-2 sm:text-sm">
              {stats.distributed.toLocaleString('id-ID')} dari{' '}
              {stats.total.toLocaleString('id-ID')} kupon telah didistribusikan
            </p>
          </div>

          {/* Per Zona */}
          <div className="min-h-0 flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4">
            <h3 className="mb-3 text-xs font-medium text-slate-300 sm:text-sm">
              Distribusi Per Zona
            </h3>
            <div className="flex flex-col justify-evenly gap-2">
              {perZona.map((z) => (
                <div key={z.nama}>
                  <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-300">{z.nama}</span>
                    <span className="tabular-nums text-slate-400">
                      {z.used}/{z.total}
                      <span className="ml-2 font-semibold text-slate-200">
                        {z.pct}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700 sm:h-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${z.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Live Feed */}
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-700/50 bg-slate-800/50 lg:max-w-[45%]">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 px-3 py-2 sm:px-4 sm:py-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-200 sm:text-sm">
              <Activity className="size-3.5 text-green-400 sm:size-4" />
              Log Pengambilan
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
              </span>
              Live
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3">
            {scanLog.length > 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                {scanLog.slice(0, 30).map((log) => (
                  <LiveFeedItem key={`${log.kuponId}-${log.at}`} log={log} />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShieldCheck className="size-12 text-slate-700 sm:size-16" />
                <p className="mt-3 text-xs font-medium text-slate-400 sm:text-sm">
                  Belum ada aktivitas scan
                </p>
                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  Log akan muncul saat kupon mulai di-scan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`rounded-lg bg-slate-700/50 p-1.5 sm:p-2 ${color}`}>
          <Icon className="size-4 sm:size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
            {title}
          </p>
          <p className="text-lg font-bold text-white sm:text-2xl">
            {typeof value === 'number'
              ? value.toLocaleString('id-ID')
              : value}
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveFeedItem({ log }: { log: DemoScanLog }) {
  const config = FEED_ITEM_CONFIG[log.status] ?? FEED_ITEM_CONFIG.invalid;
  const Icon = config.icon;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${config.bg} ${config.border}`}
    >
      <div className={`shrink-0 rounded-full p-1 sm:p-1.5 ${config.badgeBg}`}>
        <Icon className="size-3.5 sm:size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="flex items-center gap-1 truncate text-xs font-semibold text-slate-200 sm:text-sm">
            <User className="size-3 shrink-0 text-slate-400 sm:size-3.5" />
            {maskName(log.penerimaNama)}
          </span>
          <span className="hidden font-mono text-xs text-slate-400 sm:inline">
            {log.kuponId}
          </span>
        </div>
        <p className="truncate text-[10px] text-slate-500 sm:text-xs">
          {log.zona}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${config.badgeBg}`}
      >
        {config.label}
      </span>
      <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">
        {formatRelativeTime(log.at)}
      </span>
    </div>
  );
}
