'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  Loader2,
  AlertTriangle,
  XCircle,
  Activity,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { publicService } from '@/services/public.service';
import { formatNumber, formatRelativeTime } from '@/lib/format';
import { SCAN_RESULT_LABELS } from '@/lib/constants';
import type { Scan } from '@/types';

const FEED_ITEM_CONFIG = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    badgeBg: 'bg-green-500/15 text-green-400',
    dot: 'bg-green-500',
  },
  already_claimed: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    badgeBg: 'bg-amber-500/15 text-amber-400',
    dot: 'bg-amber-500',
  },
  invalid: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badgeBg: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-500',
  },
  expired: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badgeBg: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-500',
  },
  voided: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badgeBg: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-500',
  },
} as const;

function maskName(name: string): string {
  if (name.length <= 3) return name[0] + '***';
  return name.slice(0, 3) + '***';
}

function LiveFeedItem({ scan }: { scan: Scan }) {
  const config =
    FEED_ITEM_CONFIG[scan.scan_result as keyof typeof FEED_ITEM_CONFIG] ||
    FEED_ITEM_CONFIG.invalid;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${config.bg} ${config.border}`}>
      <div className={`shrink-0 rounded-full p-1 sm:p-1.5 ${config.badgeBg}`}>
        <Icon className="size-3.5 sm:size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {scan.coupon?.recipient && (
            <span className="flex items-center gap-1 truncate text-xs font-semibold text-slate-200 sm:text-sm">
              <User className="size-3 shrink-0 text-slate-400 sm:size-3.5" />
              {maskName(scan.coupon.recipient.name)}
            </span>
          )}
          {scan.coupon?.coupon_number && (
            <span className="hidden font-mono text-xs text-slate-400 sm:inline">{scan.coupon.coupon_number}</span>
          )}
        </div>
      </div>
      <Badge variant="outline" className={`shrink-0 border-0 text-[10px] sm:text-xs ${config.badgeBg}`}>
        {SCAN_RESULT_LABELS[scan.scan_result] || scan.scan_result}
      </Badge>
      <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">
        {formatRelativeTime(scan.scanned_at)}
      </span>
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
          <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">{title}</p>
          <p className="text-lg font-bold text-white sm:text-2xl">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PublicLiveDashboardPage() {
  const { tenantSlug, eventSlug } = useParams<{
    tenantSlug: string;
    eventSlug: string;
  }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public', 'live', tenantSlug, eventSlug],
    queryFn: () => publicService.getLiveDashboard(tenantSlug, eventSlug),
    refetchInterval: 10000,
  });

  const { data: feedData } = useQuery({
    queryKey: ['public', 'live', tenantSlug, eventSlug, 'feed'],
    queryFn: () => publicService.getLiveFeed(tenantSlug, eventSlug),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader2 className="size-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Event tidak ditemukan</h1>
          <p className="mt-2 text-slate-400">Pastikan URL yang Anda akses sudah benar</p>
        </div>
      </div>
    );
  }

  const dashboard = data?.data as Record<string, unknown> | undefined;
  const stats = dashboard?.stats as {
    total_coupons: number;
    total_distributed: number;
    total_unclaimed: number;
    distribution_percentage: number;
    by_category: Record<string, { total: number; distributed: number }>;
  } | undefined;

  const feed = (feedData?.data || []) as Scan[];
  const categories = stats?.by_category ? Object.entries(stats.by_category) : [];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-white">
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
                {(dashboard?.event_name as string) || 'Distribusi Kurban'}
              </h1>
              <p className="truncate text-xs text-slate-400 sm:text-sm">
                {(dashboard?.tenant_name as string) || ''}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 text-right text-xs text-slate-500 sm:block">
            Powered by <span className="font-semibold text-green-500">QurbanLink</span>
          </div>
        </div>
      </header>

      {/* Main Content — fills remaining height */}
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row lg:gap-5 lg:p-5">
        {/* Left Column — Stats & Categories */}
        <div className="flex shrink-0 flex-col gap-3 lg:w-[55%] lg:min-h-0 lg:flex-1 lg:gap-4">
          {/* Stat Cards */}
          {stats && (
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
              <StatCard title="Total Kupon" value={stats.total_coupons} icon={Ticket} color="text-blue-400" />
              <StatCard title="Terdistribusi" value={stats.total_distributed} icon={CheckCircle} color="text-green-400" />
              <StatCard title="Belum Diambil" value={stats.total_unclaimed} icon={Clock} color="text-amber-400" />
              <StatCard title="Progress" value={`${stats.distribution_percentage}%`} icon={TrendingUp} color="text-emerald-400" />
            </div>
          )}

          {/* Main Progress */}
          {stats && (
            <div className="shrink-0 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300 sm:text-sm">Progress Keseluruhan</span>
                <span className="text-lg font-bold text-green-400 sm:text-2xl">{stats.distribution_percentage}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-700 sm:h-4">
                <div
                  className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${stats.distribution_percentage}%` }}
                />
              </div>
              <p className="mt-1.5 text-center text-xs text-slate-400 sm:mt-2 sm:text-sm">
                {formatNumber(stats.total_distributed)} dari {formatNumber(stats.total_coupons)} kupon telah didistribusikan
              </p>
            </div>
          )}

          {/* Per Category — fills remaining space, hidden on small screens when no room */}
          {categories.length > 0 && (
            <div className="hidden min-h-0 flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4 lg:block">
              <h3 className="mb-3 text-xs font-medium text-slate-300 sm:text-sm">Distribusi Per Kategori</h3>
              <div className="flex h-[calc(100%-2rem)] flex-col justify-evenly gap-2">
                {categories.map(([cat, d]) => {
                  const pct = d.total > 0 ? Math.round((d.distributed / d.total) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                        <span className="capitalize text-slate-300">{cat || 'Umum'}</span>
                        <span className="tabular-nums text-slate-400">
                          {d.distributed}/{d.total}
                          <span className="ml-2 font-semibold text-slate-200">{pct}%</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700 sm:h-3">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Live Feed */}
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
            {feed.length > 0 ? (
              <div className="space-y-1.5 sm:space-y-2">
                {feed.map((scan) => (
                  <LiveFeedItem key={scan.id} scan={scan} />
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
