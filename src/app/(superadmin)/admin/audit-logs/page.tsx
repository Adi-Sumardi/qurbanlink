'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Loader2,
  Trash2,
  RefreshCw,
  Search,
  Shield,
  ServerCrash,
  Globe,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { adminService } from '@/services/admin.service';
import type { ErrorLogEntry, ErrorStats } from '@/services/admin.service';
import { formatDateTime, formatRelativeTime } from '@/lib/format';
import type { QueryParams } from '@/types';

const STATUS_COLOR: Record<number, string> = {
  404: 'bg-amber-100 text-amber-700 border-amber-200',
  500: 'bg-red-100 text-red-700 border-red-200',
  422: 'bg-orange-100 text-orange-700 border-orange-200',
  400: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

function statusColor(code: number | null) {
  if (!code) return 'bg-slate-100 text-slate-600 border-slate-200';
  if (STATUS_COLOR[code]) return STATUS_COLOR[code];
  if (code >= 500) return 'bg-red-100 text-red-700 border-red-200';
  if (code >= 400) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function StatCard({ title, value, icon: Icon, color, sub }: {
  title: string; value: number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-lg ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/70">{title}</p>
          <p className="mt-1 text-3xl font-extrabold">{value.toLocaleString()}</p>
          {sub && <p className="mt-0.5 text-xs text-white/70">{sub}</p>}
        </div>
        <div className="rounded-xl bg-white/20 p-2.5">
          <Icon className="size-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function ErrorRow({ log, onDelete }: { log: ErrorLogEntry; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-[#f2f4f6] hover:bg-[#fafbfa] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 pr-3">
          <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusColor(log.status_code)}`}>
            {log.status_code ?? '?'}
          </span>
        </td>
        <td className="py-3 pr-3">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-slate-600">
            {log.method ?? '-'}
          </span>
        </td>
        <td className="max-w-xs py-3 pr-3">
          <p className="truncate text-sm font-medium text-[#191c1e]">{log.route ?? log.url ?? '-'}</p>
          <p className="truncate text-[11px] text-muted-foreground">{log.url ?? ''}</p>
        </td>
        <td className="py-3 pr-3">
          <p className="max-w-[200px] truncate text-sm text-[#191c1e]">{log.message}</p>
          <p className="text-[11px] text-muted-foreground">{log.exception_class?.split('\\').pop() ?? '-'}</p>
        </td>
        <td className="py-3 pr-3 text-xs text-muted-foreground whitespace-nowrap">
          {log.occurred_at ? formatRelativeTime(log.occurred_at) : '-'}
        </td>
        <td className="py-3 pr-3">
          <span className="text-xs text-muted-foreground">{log.ip_address ?? '-'}</span>
        </td>
        <td className="py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}
              title="Hapus"
            >
              <Trash2 className="size-3.5" />
            </button>
            {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-[#f2f4f6] bg-[#f8faf9]">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid gap-4 text-xs sm:grid-cols-2">
              {/* Stack trace */}
              {log.stack_trace && (
                <div className="sm:col-span-2">
                  <p className="mb-1.5 font-black uppercase tracking-widest text-muted-foreground">Stack Trace</p>
                  <pre className="max-h-48 overflow-auto rounded-lg bg-[#1e1e1e] p-3 text-[11px] text-green-400 leading-relaxed">
                    {log.stack_trace}
                  </pre>
                </div>
              )}
              {/* Request data */}
              {log.request_data && Object.keys(log.request_data).length > 0 && (
                <div>
                  <p className="mb-1.5 font-black uppercase tracking-widest text-muted-foreground">Request Data</p>
                  <pre className="rounded-lg bg-slate-100 p-3 text-[11px] leading-relaxed overflow-auto max-h-32">
                    {JSON.stringify(log.request_data, null, 2)}
                  </pre>
                </div>
              )}
              {/* Meta info */}
              <div className="space-y-2">
                <p className="font-black uppercase tracking-widest text-muted-foreground">Info</p>
                <div className="space-y-1">
                  {[
                    ['Waktu', log.occurred_at ? formatDateTime(log.occurred_at) : '-'],
                    ['User', log.user?.name ?? log.user_id ?? 'Guest'],
                    ['IP', log.ip_address ?? '-'],
                    ['Browser', log.user_agent ? log.user_agent.substring(0, 80) + '...' : '-'],
                    ['Environment', log.environment],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="w-24 shrink-0 font-semibold text-muted-foreground">{k}</span>
                      <span className="text-[#191c1e] break-all">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminAuditLogsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 25, search: '' });
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['admin', 'error-stats'],
    queryFn: () => adminService.getErrorStats(),
    refetchInterval: 30_000,
  });

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'error-logs', params, filterStatus],
    queryFn: () => adminService.getErrorLogs({
      ...params,
      ...(filterStatus ? { status_code: filterStatus } : {}),
    }),
    refetchInterval: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteErrorLog(id),
    onSuccess: () => {
      toast.success('Error log dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin', 'error-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'error-stats'] });
      setDeleteId(null);
    },
    onError: () => toast.error('Gagal menghapus'),
  });

  const clearMutation = useMutation({
    mutationFn: () => adminService.clearErrorLogs(),
    onSuccess: () => {
      toast.success('Semua error log dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin', 'error-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'error-stats'] });
      setClearConfirm(false);
    },
    onError: () => toast.error('Gagal menghapus semua log'),
  });

  const stats = statsData?.data as ErrorStats | undefined;
  const logs = (data?.data ?? []) as ErrorLogEntry[];

  const STATUS_FILTERS = [
    { label: 'Semua', value: '' },
    { label: '5xx Server', value: '500' },
    { label: '404 Not Found', value: '404' },
    { label: '422 Validation', value: '422' },
    { label: '400 Bad Request', value: '400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Superadmin</p>
          <h1 className="text-3xl font-extrabold text-[#191c1e]">Error Monitoring</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Pantau error dan exception yang terjadi di seluruh platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { refetch(); queryClient.invalidateQueries({ queryKey: ['admin', 'error-stats'] }); }}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-xl border border-[#004532]/20 bg-white px-3 py-2 text-xs font-semibold text-[#004532] shadow-sm transition hover:bg-[#f0fbf4] disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setClearConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
          >
            <Trash2 className="size-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      {loadingStats ? (
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      ) : stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Error" value={stats.total} icon={AlertTriangle} color="bg-gradient-to-br from-slate-700 to-slate-500" />
          <StatCard title="Error Hari Ini" value={stats.today} icon={Shield} color="bg-gradient-to-br from-blue-600 to-blue-400" sub="24 jam terakhir" />
          <StatCard title="Server Error (5xx)" value={stats.errors_500} icon={ServerCrash} color="bg-gradient-to-br from-red-600 to-red-400" />
          <StatCard title="Not Found (404)" value={stats.errors_404} icon={Globe} color="bg-gradient-to-br from-amber-500 to-orange-400" />
        </div>
      )}

      {/* Top routes + Status breakdown */}
      {stats && (stats.top_routes.length > 0 || stats.by_status.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Top error routes */}
          <div className="rounded-2xl border border-[#004532]/10 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-[#191c1e]">Top Error Routes</h3>
            <div className="space-y-2">
              {stats.top_routes.map((r, i) => {
                const max = stats.top_routes[0]?.total || 1;
                return (
                  <div key={r.route}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-mono text-[#191c1e] truncate max-w-[200px]">{r.route}</span>
                      <span className="font-bold text-red-600 ml-2">{r.total}×</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-red-100">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${(r.total / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By status code */}
          <div className="rounded-2xl border border-[#004532]/10 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-[#191c1e]">Error by Status</h3>
            <div className="space-y-2">
              {stats.by_status.map((s) => (
                <div key={s.status_code} className="flex items-center justify-between rounded-xl bg-[#f8faf9] px-3 py-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusColor(s.status_code)}`}>
                    {s.status_code}
                  </span>
                  <span className="font-semibold text-[#191c1e]">{s.total} error</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Table */}
      <div className="rounded-2xl border border-[#004532]/10 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#f2f4f6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari error, URL, route..."
              className="pl-9 text-sm"
              value={params.search ?? ''}
              onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  filterStatus === f.value
                    ? 'bg-[#004532] text-white'
                    : 'bg-[#f2f4f6] text-[#3f4944] hover:bg-[#e0e8e4]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Shield className="size-12 text-green-400/60" />
            <p className="mt-3 font-semibold text-[#191c1e]">Tidak ada error ditemukan</p>
            <p className="mt-1 text-sm text-muted-foreground">Aplikasi berjalan dengan baik 🎉</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f2f4f6]">
                    {['Status', 'Method', 'Route / URL', 'Pesan Error', 'Waktu', 'IP', ''].map((h) => (
                      <th key={h} className="px-0 pb-3 pt-4 pl-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground first:pl-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <ErrorRow key={log.id} log={log} onDelete={setDeleteId} />
                  ))}
                </tbody>
              </table>
            </div>
            {data?.meta && (
              <div className="border-t border-[#f2f4f6] px-5 py-4">
                <DataTablePagination
                  meta={data.meta}
                  onPageChange={(page) => setParams((p) => ({ ...p, page }))}
                  onPageSizeChange={(per_page) => setParams((p) => ({ ...p, per_page, page: 1 }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete single confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Error Log"
        description="Hapus entri error log ini?"
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      {/* Clear all confirm */}
      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Hapus Semua Error Log"
        description="Tindakan ini akan menghapus SEMUA error log secara permanen dan tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus Semua"
        variant="destructive"
        onConfirm={() => clearMutation.mutate()}
        loading={clearMutation.isPending}
      />
    </div>
  );
}
