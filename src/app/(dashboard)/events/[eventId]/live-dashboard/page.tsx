'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService } from '@/services/dashboard.service';
import { formatNumber } from '@/lib/format';
import type { DashboardStats } from '@/types';

function LiveStatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { title: 'Total Kupon', value: stats.total_coupons, icon: Ticket, color: 'text-blue-600' },
    { title: 'Terdistribusi', value: stats.total_distributed, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Belum Diambil', value: stats.total_unclaimed, icon: Clock, color: 'text-amber-600' },
    { title: 'Persentase', value: `${stats.distribution_percentage}%`, icon: TrendingUp, color: 'text-emerald-600' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <c.icon className={`size-8 ${c.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{c.title}</p>
                <p className="text-2xl font-bold">
                  {typeof c.value === 'number' ? formatNumber(c.value) : c.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function LiveDashboardPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats', eventId],
    queryFn: () => dashboardService.getStats(eventId),
    refetchInterval: 5000,
  });

  const stats = data?.data;

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Dashboard</h1>
          <p className="text-muted-foreground">Update otomatis setiap 5 detik</p>
        </div>
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <Minimize2 className="size-4" />
              Keluar Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="size-4" />
              Fullscreen
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          <LiveStatsCards stats={stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress per Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.by_category).map(([cat, d]) => {
                  const pct = d.total > 0 ? Math.round((d.distributed / d.total) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{cat || 'Umum'}</span>
                        <span className="text-muted-foreground">
                          {d.distributed}/{d.total} ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribusi per Jam</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.hourly_distribution.length > 0 ? (
                  <div className="space-y-2">
                    {stats.hourly_distribution.map((h) => (
                      <div key={h.hour} className="flex items-center gap-3 text-sm">
                        <span className="w-12 text-muted-foreground">{h.hour}</span>
                        <div className="flex-1">
                          <div
                            className="h-6 rounded bg-primary/20"
                            style={{
                              width: `${Math.max(
                                (h.count /
                                  Math.max(...stats.hourly_distribution.map((x) => x.count), 1)) *
                                  100,
                                4
                              )}%`,
                            }}
                          >
                            <span className="px-2 text-xs font-medium leading-6">
                              {h.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada data distribusi
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
