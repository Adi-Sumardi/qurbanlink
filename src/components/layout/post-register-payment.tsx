'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/use-payment';

/**
 * Reads ?welcome_plan=xxx injected by useRegister after paid-plan registration.
 * Auto-opens Midtrans Snap popup 1.5s after landing on the dashboard.
 * - Payment success  → toast + clear URL param
 * - Cancel / fail    → toast "paket gratis" + clear URL param
 */
function PostRegisterPaymentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const triggered = useRef(false);
  const planSlug = searchParams.get('welcome_plan');

  function clearParam() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('welcome_plan');
    // Replace URL without re-render / scroll jump
    window.history.replaceState({}, '', url.pathname + url.search);
  }

  const { pay } = usePayment({
    onSuccess: () => {
      toast.success('🎉 Pembayaran berhasil! Paket Anda telah diaktifkan.', { duration: 6000 });
      clearParam();
    },
    onFailed: () => {
      toast.info('Pembayaran tidak berhasil. Anda menggunakan paket gratis sementara.', {
        duration: 6000,
      });
      clearParam();
    },
    onClosed: () => {
      toast.info('Pembayaran ditutup. Anda dapat berlangganan kapan saja di menu Langganan.', {
        duration: 6000,
      });
      clearParam();
    },
  });

  useEffect(() => {
    // Only run once, only when there is a plan param
    if (!planSlug || triggered.current) return;
    triggered.current = true;

    // Give dashboard 1.5s to render before popping Snap
    const timer = setTimeout(() => {
      pay(planSlug, 'monthly');
    }, 1500);

    return () => clearTimeout(timer);
  // pay is stable (useCallback), planSlug is a string
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planSlug]);

  return null;
}

export function PostRegisterPayment() {
  return (
    <Suspense fallback={null}>
      <PostRegisterPaymentInner />
    </Suspense>
  );
}
