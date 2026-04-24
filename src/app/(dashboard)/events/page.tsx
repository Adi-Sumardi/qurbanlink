'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Calendar,
  Eye,
  Pencil,
  Plus,
} from 'lucide-react';
import { motion as m } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/status-badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { formatDate, formatNumber } from '@/lib/format';
import { EVENT_STATUS_LABELS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { QueryParams } from '@/types';

export default function EventsPage() {
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
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
            Manajemen Event
          </p>
          <h1 className="font-headline text-2xl font-extrabold text-[#191c1e] md:text-3xl">
            Daftar Event Distribusi
          </h1>
          <p className="mt-1 text-sm text-[#3f4944]">
            Kelola event distribusi kurban dan pantau progresnya
          </p>
        </div>
        {canEdit && (
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#004532] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95 whitespace-nowrap"
          >
            <Plus className="size-4" />
            Buat Event
          </Link>
        )}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white editorial-shadow overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-col gap-3 border-b border-[rgba(190,201,194,0.2)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="font-headline font-bold text-[#191c1e]">Semua Event</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
            <input
              placeholder="Cari event..."
              className="w-full rounded-xl bg-[#f2f4f6] py-2.5 pl-9 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
              value={params.search ?? ''}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl p-3">
                  <Skeleton className="size-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#a6f2d1] mb-4">
                <Calendar className="size-8 text-[#004532]" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#191c1e]">Belum Ada Event</h3>
              <p className="mt-2 max-w-xs text-sm text-[#3f4944]">
                {!canEdit && mounted
                  ? 'Belum ada event yang tersedia saat ini'
                  : 'Buat event distribusi kurban pertama Anda untuk memulai'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="mb-2 grid grid-cols-[1fr_140px_120px_100px_80px] items-center gap-4 px-3">
                  {['NAMA EVENT', 'TANGGAL', 'STATUS', 'KUPON', 'AKSI'].map((h) => (
                    <p key={h} className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/50">
                      {h}
                    </p>
                  ))}
                </div>
                <div className="space-y-1">
                  {events.map((event, i) => (
                    <m.div
                      key={event.id}
                      className="grid grid-cols-[1fr_140px_120px_100px_80px] items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-[#f2f4f6]"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a6f2d1]">
                          <Calendar className="size-5 text-[#004532]" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/events/${event.id}`}
                            className="block truncate text-sm font-semibold text-[#191c1e] hover:text-[#004532] hover:underline"
                          >
                            {event.name}
                          </Link>
                          <p className="truncate text-xs text-[#3f4944]/50">
                            {event.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#3f4944]">{formatDate(event.event_date)}</p>
                      <div>
                        <StatusBadge status={event.status} label={EVENT_STATUS_LABELS[event.status]} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#191c1e]">{formatNumber(event.distributed)}</span>
                        <span className="text-sm text-[#3f4944]/50"> / {formatNumber(event.total_coupons)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/events/${event.id}`}
                          className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-[#eceef0] hover:text-[#004532]"
                        >
                          <Eye className="size-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-[#eceef0] hover:text-[#004532]"
                          >
                            <Pencil className="size-4" />
                          </Link>
                        )}
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>

              {/* Mobile Card List */}
              <div className="space-y-3 md:hidden">
                {events.map((event, i) => (
                  <m.div
                    key={event.id}
                    className="rounded-xl border border-[rgba(190,201,194,0.3)] p-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a6f2d1]">
                          <Calendar className="size-5 text-[#004532]" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/events/${event.id}`}
                            className="block truncate text-sm font-semibold text-[#191c1e] hover:underline"
                          >
                            {event.name}
                          </Link>
                          <p className="text-xs text-[#3f4944]/50">{formatDate(event.event_date)}</p>
                        </div>
                      </div>
                      <StatusBadge status={event.status} label={EVENT_STATUS_LABELS[event.status]} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#3f4944]/60">
                        Kupon: <span className="font-semibold text-[#191c1e]">{formatNumber(event.distributed)}</span> / {formatNumber(event.total_coupons)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/events/${event.id}`}
                          className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-[#eceef0] hover:text-[#004532]"
                        >
                          <Eye className="size-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-[#eceef0] hover:text-[#004532]"
                          >
                            <Pencil className="size-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>

              {/* Pagination */}
              {meta && (
                <div className="mt-4 pt-4 border-t border-[rgba(190,201,194,0.2)]">
                  <DataTablePagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
