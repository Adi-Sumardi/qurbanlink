'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  Loader2,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { formatNumber, formatCurrency, formatRelativeTime } from '@/lib/format';
import type { Tenant, Payment } from '@/types';

interface AdminDashboard {
  total_tenants: number;
  total_events: number;
  total_users: number;
  total_revenue: number;
  active_subscriptions?: number;
  active_events?: number;
  recent_registrations: Tenant[];
  subscription_breakdown: Record<string, number>;
}

const PLAN_COLORS: Record<string, string> = {
  free:         'bg-slate-100 text-slate-600',
  starter:      'bg-blue-100 text-blue-700',
  professional: 'bg-purple-100 text-purple-700',
  enterprise:   'bg-amber-100 text-amber-700',
};

const PLAN_LABELS: Record<string, string> = {
  free:         'Free',
  starter:      'Starter',
  professional: 'Professional',
  enterprise:   'Enterprise',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid:    'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed:  'bg-red-100 text-red-700',
  expired: 'bg-slate-100 text-slate-500',
};

function StatCard({
  title, value, sub, icon: Icon, gradient, href,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  gradient: string;
  href?: string;
}) {
  const content = (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/70">{title}</p>
          <p className="mt-1 text-3xl font-extrabold leading-none">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {sub && <p className="mt-1 text-xs text-white/70">{sub}</p>}
        </div>
        <div className="rounded-xl bg-white/20 p-2.5">
          <Icon className="size-5 text-white" />
        </div>
      </div>
      {href && (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/80">
          Lihat detail <ArrowRight className="size-3" />
        </div>
      )}
      {/* decorative circle */}
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 60_000,
  });

  const { data: tenantsData } = useQuery({
    queryKey: ['admin', 'tenants', { per_page: 5 }],
    queryFn: () => adminService.getTenants({ per_page: 5, page: 1 }),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['admin', 'payments', { per_page: 6 }],
    queryFn: () => adminService.getPayments({ per_page: 6, page: 1 }),
  });

  const stats = data?.data as AdminDashboard | undefined;
  const recentTenants = (tenantsData?.data ?? []) as Tenant[];
  const recentPayments = (paymentsData?.data ?? []) as Payment[];

  const breakdown = stats?.subscription_breakdown ?? {};
  const breakdownTotal = Object.values(breakdown).reduce((s, v) => s + v, 0) || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Superadmin</p>
          <h1 className="text-3xl font-extrabold text-[#191c1e]">Admin Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Overview seluruh platform Tawzii Digital</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 rounded-xl border border-[#004532]/20 bg-white px-3 py-2 text-xs font-semibold text-[#004532] shadow-sm transition hover:bg-[#f0fbf4] disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenant"
          value={stats?.total_tenants ?? 0}
          sub={`${stats?.active_subscriptions ?? 0} langganan aktif`}
          icon={Building2}
          gradient="bg-gradient-to-br from-[#004532] to-[#006e50]"
          href="/admin/tenants"
        />
        <StatCard
          title="Total Pengguna"
          value={stats?.total_users ?? 0}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-600 to-blue-400"
          href="/admin/tenant-admins"
        />
        <StatCard
          title="Event Aktif"
          value={stats?.active_events ?? stats?.total_events ?? 0}
          icon={Activity}
          gradient="bg-gradient-to-br from-purple-600 to-purple-400"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue ?? 0)}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-amber-500 to-orange-400"
          href="/admin/revenue"
        />
      </div>

      {/* Middle Row: Subscription Breakdown + Recent Payments */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Subscription Breakdown */}
        <div className="rounded-2xl border border-[#004532]/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-[#191c1e]">Breakdown Langganan</h2>
            <Link href="/admin/tenants" className="text-xs font-semibold text-[#004532] hover:underline">
              Lihat semua →
            </Link>
          </div>
          {Object.keys(breakdown).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(breakdown).map(([plan, count]) => {
                const pct = Math.round((count / breakdownTotal) * 100);
                return (
                  <div key={plan}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PLAN_COLORS[plan] ?? 'bg-gray-100 text-gray-600'}`}>
                          {PLAN_LABELS[plan] ?? plan}
                        </span>
                        <span className="font-semibold text-[#191c1e]">{count} tenant</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f2f4f6]">
                      <div
                        className="h-full rounded-full bg-[#004532] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="rounded-2xl border border-[#004532]/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-[#191c1e]">Pembayaran Terbaru</h2>
            <Link href="/admin/revenue" className="text-xs font-semibold text-[#004532] hover:underline">
              Lihat semua →
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada pembayaran</p>
          ) : (
            <div className="space-y-2.5">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-[#f8faf9] px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#004532]/10">
                      <CreditCard className="size-3.5 text-[#004532]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#191c1e]">{p.invoice_number ?? '-'}</p>
                      <p className="text-[10px] text-muted-foreground">{p.created_at ? formatRelativeTime(p.created_at) : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#191c1e]">{formatCurrency(Number(p.amount))}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PAYMENT_STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Tenant Registrations */}
      <div className="rounded-2xl border border-[#004532]/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-[#191c1e]">Registrasi Tenant Terbaru</h2>
          <Link href="/admin/tenants" className="text-xs font-semibold text-[#004532] hover:underline">
            Lihat semua →
          </Link>
        </div>
        {recentTenants.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Belum ada tenant</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#004532]/10">
                  {['Organisasi', 'Email', 'Kota', 'Status', 'Bergabung'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {recentTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8faf9] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#004532] text-[11px] font-bold text-white">
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#191c1e]">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{t.email}</td>
                    <td className="py-3 text-muted-foreground">{t.city ?? '-'}</td>
                    <td className="py-3">
                      {t.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          <CheckCircle2 className="size-3" />Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          <AlertCircle className="size-3" />Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground/50" />
                        {t.created_at ? formatRelativeTime(t.created_at) : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Kelola Tenant',  href: '/admin/tenants',       icon: Building2,  color: 'bg-[#004532]' },
          { label: 'Kelola Revenue', href: '/admin/revenue',        icon: TrendingUp, color: 'bg-blue-600' },
          { label: 'Audit Log',      href: '/admin/audit-logs',     icon: Activity,   color: 'bg-purple-600' },
          { label: 'Kelola Role',    href: '/admin/roles',          icon: Users,      color: 'bg-amber-600' },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-[#004532]/10 bg-white p-4 shadow-sm transition hover:shadow-md hover:scale-[1.01]"
          >
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4 text-white" />
            </div>
            <span className="font-semibold text-[#191c1e]">{label}</span>
            <ArrowRight className="ml-auto size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
