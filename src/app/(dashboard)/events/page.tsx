'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Calendar,
  Eye,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { formatDate, formatNumber } from '@/lib/format';
import { EVENT_STATUS_LABELS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { QueryParams } from '@/types';

export default function EventsPage() {
  const router = useRouter();
  const { isViewer, isOperator } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canEdit = mounted && !isViewer && !isOperator;
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    search: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getAll(params),
  });

  const events = data?.data ?? [];
  const meta = data?.meta;

  function handleSearch(value: string) {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  }

  function handlePageChange(page: number) {
    setParams((prev) => ({ ...prev, page }));
  }

  function handlePageSizeChange(size: number) {
    setParams((prev) => ({ ...prev, per_page: size, page: 1 }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daftar Event</h1>
          <p className="text-muted-foreground">
            Kelola event distribusi hewan kurban
          </p>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href="/events/new">
              <Plus className="mr-2 size-4" />
              Buat Event
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Event</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari event..."
                className="pl-9"
                value={params.search ?? ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Belum ada event"
              description={!canEdit && mounted ? 'Belum ada event yang tersedia' : 'Buat event baru untuk mulai mengelola distribusi kurban'}
              actionLabel={!canEdit && mounted ? undefined : 'Buat Event'}
              onAction={!canEdit && mounted ? undefined : () => router.push('/events/new')}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Event</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Kupon</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/events/${event.id}`}
                            className="hover:underline"
                          >
                            {event.name}
                          </Link>
                        </TableCell>
                        <TableCell>{formatDate(event.event_date)}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={event.status}
                            label={EVENT_STATUS_LABELS[event.status]}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-muted-foreground">
                            {formatNumber(event.distributed)}
                          </span>
                          {' / '}
                          {formatNumber(event.total_coupons)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link href={`/events/${event.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <Link href={`/events/${event.id}/edit`}>
                                  <Pencil className="size-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta && (
                <div className="mt-4">
                  <DataTablePagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
