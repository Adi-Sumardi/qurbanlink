'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useCallback } from 'react';
import { couponService } from '@/services/coupon.service';
import { CouponCard } from '@/components/coupons/coupon-card';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';

export default function CouponPrintPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [renderedCount, setRenderedCount] = useState(0);
  const hasPrinted = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['coupons-print', eventId],
    queryFn: () => couponService.printData(eventId),
  });

  const totalCoupons = data?.data?.coupons?.length ?? 0;

  const handleQrReady = useCallback(() => {
    setRenderedCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (totalCoupons > 0 && renderedCount >= totalCoupons && !hasPrinted.current) {
      hasPrinted.current = true;
      setTimeout(() => window.print(), 500);
    }
  }, [renderedCount, totalCoupons]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-3">
        <Loader2 className="size-6 animate-spin text-green-700" />
        <span className="text-muted-foreground">Memuat data kupon...</span>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <p className="font-semibold text-red-600">Gagal memuat data kupon</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Pastikan kupon sudah di-generate.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-md bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const { event, tenant, coupons } = data.data;

  return (
    <div className="print-page">
      {/* Screen-only toolbar */}
      <div className="no-print print-toolbar">
        <button
          onClick={() => router.push(`/events/${eventId}/coupons`)}
          className="print-toolbar-btn-outline"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </button>
        <div className="print-toolbar-info">
          <h1 className="text-lg font-bold">{event.name}</h1>
          <p className="text-sm text-gray-500">
            {coupons.length} kupon siap cetak
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print-toolbar-btn-primary"
        >
          <Printer className="size-4" />
          Cetak Sekarang
        </button>
      </div>

      {/* Printable coupon grid */}
      <div className="print-sheet">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            event={event}
            tenant={tenant}
            onReady={handleQrReady}
          />
        ))}
      </div>
    </div>
  );
}
