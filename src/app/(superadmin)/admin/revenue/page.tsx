'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  Loader2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminService } from '@/services/admin.service';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import type { Payment } from '@/types';

// Dummy revenue data while backend endpoint grows
function useRevenueData() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: () => adminService.getPayments(),
  });

  return { dashboard, payments, isLoading: isLoading || loadingPayments };
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  paid: 'Lunas',
  pending: 'Menunggu',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
};

const PAYMENT_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default',
  pending: 'secondary',
  failed: 'destructive',
  expired: 'outline',
};

export default function AdminRevenuePage() {
  const { dashboard, payments, isLoading } = useRevenueData();
  const [period] = useState('Semua Waktu');

  const stats = dashboard?.data as Record<string, number> | undefined;
  const paymentList: Payment[] = (payments?.data ?? []) as Payment[];

  const totalRevenue = stats?.total_revenue ?? 0;
  const paidPayments = paymentList.filter((p) => p.status === 'paid');
  const pendingPayments = paymentList.filter((p) => p.status === 'pending');
  const totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  const summaryCards = [
    {
      title: 'Total Pendapatan',
      value: formatCurrency(totalRevenue || totalPaidAmount),
      sub: period,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+12%',
      up: true,
    },
    {
      title: 'Pembayaran Berhasil',
      value: formatNumber(paidPayments.length),
      sub: 'transaksi lunas',
      icon: CreditCard,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+8%',
      up: true,
    },
    {
      title: 'Menunggu Konfirmasi',
      value: formatNumber(pendingPayments.length),
      sub: 'perlu tindakan',
      icon: Receipt,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: pendingPayments.length > 0 ? `${pendingPayments.length} pending` : 'Bersih',
      up: false,
    },
    {
      title: 'Tenant Berlangganan',
      value: formatNumber(stats?.active_subscriptions ?? 0),
      sub: 'langganan aktif',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: '+3%',
      up: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Penghasilan SaaS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan pendapatan platform dan riwayat pembayaran tenant
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          {period}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    card.up ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {card.up ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {card.trend}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart — built from payment data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-emerald-600" />
            Grafik Pendapatan Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            // Group paid payments by month (last 12 months)
            const months: Record<string, number> = {};
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              months[key] = 0;
            }
            paidPayments.forEach((p) => {
              const d = new Date(p.paid_at ?? p.created_at ?? '');
              if (isNaN(d.getTime())) return;
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              if (key in months) months[key] += Number(p.amount) || 0;
            });

            const entries = Object.entries(months);
            const maxVal = Math.max(...entries.map(([, v]) => v), 1);
            const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

            return (
              <div className="space-y-2">
                <div className="flex items-end gap-1 overflow-x-auto pb-1" style={{ height: 160 }}>
                  {entries.map(([key, val]) => {
                    const [, m] = key.split('-');
                    const pct = (val / maxVal) * 100;
                    return (
                      <div key={key} className="group flex flex-1 min-w-[28px] flex-col items-center gap-1 relative">
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex whitespace-nowrap rounded bg-[#191c1e] px-2 py-1 text-[10px] text-white shadow z-10">
                          {formatCurrency(val)}
                        </div>
                        <div
                          className={`w-full rounded-t transition-all duration-500 ${val > 0 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-muted'}`}
                          style={{ height: `${Math.max(pct, val > 0 ? 4 : 0)}%`, minHeight: val > 0 ? 4 : 0 }}
                        />
                        <span className="text-[9px] text-muted-foreground">{MONTH_SHORT[parseInt(m) - 1]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>12 bulan terakhir</span>
                  <span className="font-semibold text-emerald-600">
                    Total: {formatCurrency(paidPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0))}
                  </span>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="size-4" />
            Riwayat Pembayaran Tenant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {paymentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Receipt className="size-10 opacity-20" />
              <p className="text-sm">Belum ada riwayat pembayaran</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Invoice</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Kedaluwarsa</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentList.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">
                        {payment.invoice_number}
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {payment.payment_type}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            PAYMENT_STATUS_VARIANT[payment.status] ?? 'outline'
                          }
                        >
                          {PAYMENT_STATUS_LABEL[payment.status] ?? payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paid_at ? formatDate(payment.paid_at) : '-'}
                      </TableCell>
                      <TableCell>
                        {payment.expired_at ? formatDate(payment.expired_at) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.invoice_url ? (
                          <a
                            href={payment.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Lihat
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
