'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/use-payment';
import { subscriptionService } from '@/services/subscription.service';

/**
 * Reads ?welcome_plan=xxx from URL (injected by useRegister after registration).
 * If the plan is paid, auto-opens Midtrans Snap.
 * - Success  → toast + clear param → user stays in dashboard with paid plan
 * - Fail/Cancel → toast "paket gratis" + clear param → free trial continues
 */
function PostRegisterPaymentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const triggered = useRef(false);
  const planSlug = searchParams.get('welcome_plan');

  const { data: plansRes, isLoading } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionService.getPlans(),
    enabled: !!planSlug,
    staleTime: 5 * 60 * 1000,
  });

  /** Remove ?welcome_plan from the URL cleanly without a navigation */
  function clearParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete('welcome_plan');
    router.replace(url.pathname + (url.search || ''), { scroll: false });
  }

  const { pay } = usePayment({
    suppressDefaultToasts: true,
    onSuccess: () => {
      toast.success('🎉 Pembayaran berhasil! Paket Anda telah diaktifkan.');
      clearParam();
    },
    onFailed: () => {
      toast.info('Pembayaran tidak berhasil. Silakan coba lagi dari menu Langganan.', {
        duration: 6000,
      });
      clearParam();
    },
    onClosed: () => {
      toast.info('Anda menggunakan paket gratis sementara. Berlangganan kapan saja di menu Langganan.', {
        duration: 6000,
      });
      clearParam();
    },
  });

  useEffect(() => {
    if (!planSlug || triggered.current || isLoading) return;
    if (!plansRes) return;

    // Extract plans array from various response shapes
    const raw = plansRes as unknown;
    let plans: Array<{ slug: string; price_monthly: number }> = [];
    if (Array.isArray(raw)) plans = raw;
    else {
      const r = raw as Record<string, unknown>;
      if (Array.isArray(r?.data)) plans = r.data as typeof plans;
      else {
        const nested = r?.data as Record<string, unknown> | undefined;
        if (Array.isArray(nested?.data)) plans = nested!.data as typeof plans;
      }
    }

    const found = plans.find((p) => p.slug === planSlug);
    if (!found) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[PostRegisterPayment] Plan slug "${planSlug}" not found. Available:`,
          plans.map((p) => p.slug),
        );
      }
      clearParam();
      return;
    }
    if (found.price_monthly === 0) {
      // Free plan — nothing to pay
      clearParam();
      return;
    }

    triggered.current = true;

    // Small delay so dashboard renders fully before Snap pops up
    const timer = setTimeout(() => {
      pay(found.slug, 'monthly');
    }, 1200);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planSlug, isLoading, plansRes]);

  return null;
}

export function PostRegisterPayment() {
  return (
    <Suspense fallback={null}>
      <PostRegisterPaymentInner />
    </Suspense>
  );
}
