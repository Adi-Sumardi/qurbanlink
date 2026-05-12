'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import type { ApiResponse, Payment } from '@/types';

export default function PrintInvoicePage() {
  const { paymentId } = useParams<{ paymentId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['payment-detail', paymentId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Payment>>(`/subscriptions/payments/${paymentId}`);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setTimeout(() => window.print(), 600);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Invoice tidak ditemukan.</p>
      </div>
    );
  }

  const payment = data;
  const meta = payment.metadata as Record<string, string> | null;
  const planName = meta?.plan_name ?? '-';
  const billingCycle = meta?.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan';
  const paymentTypeLabel =
    payment.payment_type === 'subscription'
      ? 'Langganan'
      : payment.payment_type === 'addon_coupon'
      ? 'Top-up Kupon'
      : payment.payment_type;

  return (
    <div className="min-h-screen bg-white p-10 font-sans text-gray-800 print:p-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#004532]">Tawzii Digital</h1>
          <p className="text-sm text-gray-500">by adilabs.id · tawzii.id</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400">Invoice</p>
          <p className="font-mono text-lg font-bold text-gray-800">{payment.invoice_number}</p>
          <p className="text-sm text-gray-500">
            {payment.paid_at ? formatDate(payment.paid_at) : formatDate(payment.created_at ?? null)}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mb-8">
        <span
          className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${
            payment.status === 'paid'
              ? 'bg-green-100 text-green-700'
              : payment.status === 'pending'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {payment.status === 'paid' ? 'Lunas' : payment.status === 'pending' ? 'Menunggu' : 'Gagal'}
        </span>
      </div>

      {/* Detail */}
      <table className="mb-8 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Deskripsi</th>
            <th className="border border-gray-200 px-4 py-2 text-right font-semibold">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-200 px-4 py-3">
              <p className="font-medium">{paymentTypeLabel}</p>
              {meta && (
                <p className="text-xs text-gray-500">
                  {planName} · {billingCycle}
                </p>
              )}
            </td>
            <td className="border border-gray-200 px-4 py-3 text-right font-semibold">
              {formatCurrency(payment.amount)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td className="border border-gray-200 px-4 py-2 font-bold">Total</td>
            <td className="border border-gray-200 px-4 py-2 text-right font-bold text-[#004532]">
              {formatCurrency(payment.amount)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Tanggal & Metode */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Metode Pembayaran</p>
          <p className="mt-1 capitalize">{payment.payment_method ?? '-'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Berlaku Hingga</p>
          <p className="mt-1">{payment.expired_at ? formatDate(payment.expired_at) : '-'}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-6 text-center text-xs text-gray-400">
        Dokumen ini diterbitkan secara otomatis oleh sistem Tawzii Digital · tawzii.id
      </div>
    </div>
  );
}
