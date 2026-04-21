'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Ticket,
  CheckCircle,
  TrendingUp,
  Calendar,
  Users,
  MonitorPlay,
  ScanLine,
  ExternalLink,
  Beef,
  Zap,
  Loader2,
} from 'lucide-react';
import { motion as m } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveEvent } from '@/hooks/use-active-event';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboardService } from '@/services/dashboard.service';
import { recipientService } from '@/services/recipient.service';
import { formatNumber } from '@/lib/format';
import type { DashboardStats, Recipient } from '@/types';

// --- Stat Cards ---

function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: 'Total Penerima',
      value: formatNumber(stats.total_recipients),
      icon: Users,
      iconBg: 'bg-[#a6f2d1]',
      iconColor: 'text-[#004532]',
      dark: false,
    },
    {
      label: 'Total Kupon',
      value: formatNumber(stats.total_coupons),
      icon: Ticket,
      iconBg: 'bg-[#a6f2d1]',
      iconColor: 'text-[#004532]',
      dark: false,
    },
    {
      label: 'Terdistribusi',
      value: formatNumber(stats.total_distributed),
      icon: CheckCircle,
      iconBg: 'bg-[#a6f2d1]',
      iconColor: 'text-[#004532]',
      dark: false,
    },
    {
      label: 'Progress Distribusi',
      value: `${stats.distribution_percentage}%`,
      icon: TrendingUp,
      dark: true,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 editorial-shadow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold text-[#191c1e]">Statistik Distribusi</h2>
        </div>
        <span className="chip-active">LIVE TRACK</span>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <m.div
            key={card.label}
            className={`rounded-2xl p-5 ${card.dark ? 'bg-[#004532] text-white' : 'bg-[#f2f4f6]'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="mb-4">
              {card.dark ? (
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <Ticket className="size-5 text-[#6ffbbe]" />
                </div>
              ) : (
                <div className={`flex size-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <card.icon className={`size-5 ${card.iconColor}`} />
                </div>
              )}
            </div>
            <p className={`font-headline text-3xl font-extrabold ${card.dark ? 'text-white' : 'text-[#191c1e]'}`}>
              {card.value}
            </p>
            <p className={`mt-1 text-xs font-medium ${card.dark ? 'text-white/70' : 'text-[#3f4944]'}`}>
              {card.label}
            </p>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 editorial-shadow">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-[#f2f4f6] p-5">
            <Skeleton className="mb-4 size-10 rounded-xl" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Recent Mustahik Table ---

function RecentMustahikTable({ eventId }: { eventId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['recipients', eventId, { per_page: 5, page: 1 }],
    queryFn: () => recipientService.getAll(eventId, { per_page: 5, page: 1 }),
  });

  const recipients = data?.data ?? [];

  return (
    <div className="rounded-2xl bg-white p-6 editorial-shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline text-xl font-bold text-[#191c1e]">Daftar Penerima Terbaru</h2>
        <Link
          href={`/events/${eventId}/recipients`}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#004532] hover:underline"
        >
          Lihat Semua
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-[#004532]/40" />
        </div>
      ) : recipients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Users className="mb-2 size-10 text-[#3f4944]/20" />
          <p className="text-sm text-[#3f4944]/60">Belum ada penerima terdaftar</p>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div className="mb-3 grid grid-cols-3 gap-4 px-3">
            {['NAMA PENERIMA', 'ALAMAT', 'KATEGORI'].map((h) => (
              <p key={h} className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/50">
                {h}
              </p>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {recipients.map((row: Recipient, i: number) => (
              <m.div
                key={row.id}
                className="grid grid-cols-3 items-center gap-4 rounded-xl p-3 transition-colors hover:bg-[#f2f4f6]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="recipient-avatar shrink-0">
                    {row.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#191c1e]">{row.name}</p>
                    <p className="truncate text-xs text-[#3f4944]/50">{row.nik || `${row.portions} porsi`}</p>
                  </div>
                </div>
                {/* Address */}
                <p className="truncate text-sm text-[#3f4944]">
                  {[row.kelurahan, row.kecamatan].filter(Boolean).join(', ') || row.address || '-'}
                </p>
                {/* Category */}
                <span className="chip-verified w-fit capitalize">{row.category || 'Umum'}</span>
              </m.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Right Panel: Meat Packaging + Quick Action ---

function RightPanel({ stats, activeEventId }: { stats?: DashboardStats; activeEventId: string }) {
  const categories = stats?.by_category ? Object.entries(stats.by_category) : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Meat Packaging Progress */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-headline font-bold text-[#191c1e]">Distribusi Per Kategori</h3>
          <span className="text-xs font-bold text-[#3f4944]/50">Fase 1</span>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.slice(0, 3).map(([cat, data]) => {
              const pct = data.total > 0 ? Math.round((data.distributed / data.total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/60">
                      {cat}
                    </span>
                    <span className="text-xs font-bold text-[#004532]">{pct}%</span>
                  </div>
                  <div className="progress-sacred">
                    <div style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Sapi', pct: 45 },
              { label: 'Kambing', pct: 12 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/60">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold text-[#004532]">{item.pct}%</span>
                </div>
                <div className="progress-sacred">
                  <div style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}

            {/* Halal badge */}
            <div className="flex items-center gap-2 rounded-xl bg-[#f2f4f6] px-4 py-3">
              <CheckCircle className="size-4 text-[#004532]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#004532]">
                Protokol Halal Aktif
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <h3 className="font-headline mb-1 font-bold text-[#191c1e]">Aksi Cepat</h3>
        <p className="mb-4 text-xs text-[#3f4944]">
          Generate dan kelola kupon digital terenkripsi untuk penerima yang sudah terdaftar.
        </p>
        <Link
          href={`/events/${activeEventId}/coupons`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004532] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95"
        >
          <Zap className="size-4" />
          Kelola Kupon Digital
        </Link>
      </div>

      {/* Livestock Health Status */}
      <div className="relative overflow-hidden rounded-2xl editorial-shadow">
        <div className="absolute inset-0 bg-gradient-to-t from-[#003826]/80 to-transparent z-10" />
        <div className="h-36 bg-gradient-to-br from-[#1a5c3d] to-[#004532]">
          {/* Cow illustration */}
          <div className="flex h-full items-center justify-center opacity-20">
            <Beef className="size-20 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-20 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6ffbbe]">
            Status Hewan Kurban
          </p>
          <p className="font-headline text-sm font-bold text-white leading-snug">
            Semua hewan telah lolos pemeriksaan oleh petugas veteriner.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- No Active Event ---

function NoActiveEvent() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center editorial-shadow">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#a6f2d1] mb-4">
        <Calendar className="size-8 text-[#004532]" />
      </div>
      <h3 className="font-headline text-lg font-bold text-[#191c1e]">Belum ada event aktif</h3>
      <p className="mt-2 text-sm text-[#3f4944] max-w-xs">
        Buat event baru untuk mulai mengelola distribusi kurban
      </p>
      <Link
        href="/events"
        className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
      >
        Buat Event Sekarang
        <ExternalLink className="size-4" />
      </Link>
    </div>
  );
}

// --- Main Dashboard Page ---

export default function DashboardPage() {
  const { activeEvent } = useActiveEvent();
  const { isViewer } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canScan = mounted && !isViewer;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats', activeEvent?.id],
    queryFn: () => dashboardService.getStats(activeEvent!.id),
    enabled: !!activeEvent,
  });

  const liveUrl =
    activeEvent?.tenant_slug && activeEvent?.slug
      ? `/live/${activeEvent.tenant_slug}/${activeEvent.slug}`
      : null;

  return (
    <div className="space-y-5">
      {/* Page Hero Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
            Ringkasan Dashboard
          </p>
          <h1 className="font-headline text-2xl font-extrabold text-[#191c1e] leading-tight md:text-3xl lg:text-4xl">
            Distribusi Kurban yang Tepat,
            <br />
            <span className="italic text-[#004532]">Transparan &amp; Berkah.</span>
          </h1>
        </div>

        {/* Action buttons */}
        {activeEvent && (
          <div className="flex shrink-0 items-start gap-2">
            {liveUrl && (
              <Link
                href={liveUrl}
                target="_blank"
                className="flex items-center gap-2 rounded-xl border border-[rgba(190,201,194,0.3)] bg-white px-4 py-2 text-xs font-bold text-[#3f4944] shadow-sm transition-colors hover:bg-[#f2f4f6]"
              >
                <MonitorPlay className="size-4" />
                Live
              </Link>
            )}
            {canScan && (
              <Link
                href="/scan"
                className="btn-gradient flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-lg shadow-[#004532]/20"
              >
                <ScanLine className="size-4" />
                Scan QR
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {!activeEvent ? (
        <NoActiveEvent />
      ) : isLoading ? (
        <StatsGridSkeleton />
      ) : stats?.data ? (
        <StatsGrid stats={stats.data} />
      ) : null}

      {/* Main Content: Table + Right Panel */}
      {activeEvent && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
          <RecentMustahikTable eventId={activeEvent.id} />
          <RightPanel stats={stats?.data} activeEventId={activeEvent.id} />
        </div>
      )}
    </div>
  );
}
