'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  MonitorPlay,
  ScanLine,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveEvent } from '@/hooks/use-active-event';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboardService } from '@/services/dashboard.service';
import { formatNumber, formatDate } from '@/lib/format';
import { EVENT_STATUS_LABELS } from '@/lib/constants';
import type { DashboardStats } from '@/types';

function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: 'Total Kupon',
      value: formatNumber(stats.total_coupons),
      icon: Ticket,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Terdistribusi',
      value: formatNumber(stats.total_distributed),
      icon: CheckCircle,
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      title: 'Belum Diambil',
      value: formatNumber(stats.total_unclaimed),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Persentase',
      value: `${stats.distribution_percentage}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2.5 ${card.bg}`}>
                <card.icon className={`size-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoryProgress({ stats }: { stats: DashboardStats }) {
  const categories = Object.entries(stats.by_category || {});

  if (categories.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribusi per Kategori</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(([category, data]) => {
          const pct = data.total > 0 ? Math.round((data.distributed / data.total) * 100) : 0;
          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{category || 'Umum'}</span>
                <span className="text-muted-foreground">
                  {data.distributed}/{data.total}
                </span>
              </div>
              <Progress value={pct} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ActiveEventInfo() {
  const { activeEvent, events } = useActiveEvent();

  if (!activeEvent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Belum ada event aktif</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Buat event baru untuk mulai mengelola distribusi kurban
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Event Aktif</CardTitle>
          <Badge variant="secondary">
            {EVENT_STATUS_LABELS[activeEvent.status] || activeEvent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{activeEvent.name}</h3>
          {activeEvent.event_date && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(activeEvent.event_date)}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Ticket className="size-4" />
              {formatNumber(activeEvent.total_coupons)} kupon
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {formatNumber(activeEvent.distributed)} terdistribusi
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

  const liveUrl = activeEvent?.tenant_slug && activeEvent?.slug
    ? `/live/${activeEvent.tenant_slug}/${activeEvent.slug}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan distribusi hewan kurban
          </p>
        </div>
        {activeEvent && (
          <div className="flex flex-wrap gap-2">
            {liveUrl && (
              <Button variant="outline" size="sm" asChild>
                <Link href={liveUrl} target="_blank">
                  <MonitorPlay className="size-4" />
                  Live Dashboard
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            )}
            {canScan && (
              <Button size="sm" asChild>
                <Link href="/scan">
                  <ScanLine className="size-4" />
                  Scan QR
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {isLoading && activeEvent ? (
        <StatsCardsSkeleton />
      ) : stats?.data ? (
        <StatsCards stats={stats.data} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveEventInfo />
        {stats?.data && <CategoryProgress stats={stats.data} />}
      </div>
    </div>
  );
}
