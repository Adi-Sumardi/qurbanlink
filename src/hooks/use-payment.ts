'use client';

import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionService } from '@/services/subscription.service';
import { useMidtransSnap } from '@/hooks/use-midtrans';

export type PaymentStatus = 'idle' | 'creating' | 'pending' | 'success' | 'failed' | 'closed';

export interface UsePaymentOptions {
  /** Called after payment succeeds and subscription is activated */
  onSuccess?: (invoiceNumber: string) => void;
  /** Called when payment is pending (bank transfer, VA, etc.) */
  onPending?: (invoiceNumber: string) => void;
  /** Called when payment fails or is denied */
  onFailed?: (invoiceNumber: string) => void;
  /** Called when user closes Snap popup without completing payment */
  onClosed?: () => void;
  /** Suppress built-in toasts so caller can show its own (used by post-register flow) */
  suppressDefaultToasts?: boolean;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const invoiceRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const { openSnap } = useMidtransSnap();

  // Stabilkan options di ref — caller bisa pass inline object {onClosed: () => {}}
  // tiap render tanpa menyebabkan pay/resumePayment recreate
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const invalidateSubscription = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
  }, [queryClient]);

  const pay = useCallback(
    async (plan: string, billingCycle: 'monthly' | 'yearly') => {
      setStatus('creating');
      setErrorMessage(null);

      try {
        const res = await subscriptionService.createPayment({ plan, billing_cycle: billingCycle });
        const result = res.data;

        // Free plan — no payment needed
        if (result?.is_free) {
          toast.success('Anda berhasil mengaktifkan paket gratis!');
          setStatus('success');
          invalidateSubscription();
          optionsRef.current.onSuccess?.('FREE');
          return;
        }

        const invoiceNumber = result?.invoice_number ?? null;
        invoiceRef.current = invoiceNumber;

        if (result?.snap_token) {
          setStatus('pending');

          openSnap(result.snap_token, {
            onSuccess: () => {
              setStatus('success');
              if (!optionsRef.current.suppressDefaultToasts) {
                toast.success('🎉 Pembayaran berhasil! Langganan Anda telah diperbarui.');
              }
              invalidateSubscription();
              optionsRef.current.onSuccess?.(invoiceNumber ?? '');
            },

            onPending: () => {
              setStatus('pending');
              if (!optionsRef.current.suppressDefaultToasts) {
                toast.info(
                  '⏳ Pembayaran sedang diproses. Kami akan notifikasikan saat dikonfirmasi.',
                  { duration: 6000 }
                );
              }
              invalidateSubscription();
              optionsRef.current.onPending?.(invoiceNumber ?? '');
            },

            onError: (result: unknown) => {
              setStatus('failed');
              const msg =
                typeof result === 'object' && result !== null
                  ? (result as Record<string, string>)?.status_message ?? 'Pembayaran gagal.'
                  : 'Pembayaran gagal.';
              setErrorMessage(msg);
              if (!optionsRef.current.suppressDefaultToasts) {
                toast.error(`❌ ${msg}`);
              }
              optionsRef.current.onFailed?.(invoiceNumber ?? '');
            },

            onClose: () => {
              setStatus('closed');
              if (!optionsRef.current.suppressDefaultToasts) {
                toast.info('Jendela pembayaran ditutup. Lanjutkan kapan saja.');
              }
              optionsRef.current.onClosed?.();
            },
          });
        } else if (result?.payment_url) {
          // Fallback: redirect to Midtrans hosted payment page
          setStatus('pending');
          window.open(result.payment_url, '_blank', 'noopener,noreferrer');
          toast.info('Halaman pembayaran dibuka di tab baru.');
        } else {
          throw new Error('Tidak ada snap_token atau payment_url dari server.');
        }
      } catch (err: unknown) {
        setStatus('failed');
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal membuat sesi pembayaran. Silakan coba lagi.';
        setErrorMessage(msg);
        toast.error(msg);
      }
    },
    [openSnap, invalidateSubscription]
  );

  /** Poll payment status from server (useful after redirect back) */
  const checkStatus = useCallback(async (invoiceNumber: string) => {
    try {
      const res = await subscriptionService.getPaymentStatus(invoiceNumber);
      const data = res.data;

      if (data?.status === 'paid') {
        setStatus('success');
        invalidateSubscription();
        optionsRef.current.onSuccess?.(invoiceNumber);
      } else if (data?.status === 'failed') {
        setStatus('failed');
        optionsRef.current.onFailed?.(invoiceNumber);
      }

      return data?.status ?? null;
    } catch {
      return null;
    }
  }, [invalidateSubscription]);

  /** Re-open Snap for an existing pending payment using its stored snap_token */
  const resumePayment = useCallback(
    (snapToken: string, invoiceNumber: string, redirectUrl?: string | null) => {
      invoiceRef.current = invoiceNumber;

      if (snapToken) {
        setStatus('pending');
        openSnap(snapToken, {
          onSuccess: () => {
            setStatus('success');
            toast.success('🎉 Pembayaran berhasil! Langganan Anda telah diperbarui.');
            invalidateSubscription();
            optionsRef.current.onSuccess?.(invoiceNumber);
          },
          onPending: () => {
            setStatus('pending');
            toast.info('⏳ Pembayaran sedang diproses.', { duration: 6000 });
            invalidateSubscription();
            optionsRef.current.onPending?.(invoiceNumber);
          },
          onError: (result: unknown) => {
            setStatus('failed');
            const msg =
              typeof result === 'object' && result !== null
                ? (result as Record<string, string>)?.status_message ?? 'Pembayaran gagal.'
                : 'Pembayaran gagal.';
            setErrorMessage(msg);
            toast.error(`❌ ${msg}`);
            optionsRef.current.onFailed?.(invoiceNumber);
          },
          onClose: () => {
            setStatus('closed');
            toast.info('Jendela pembayaran ditutup. Lanjutkan kapan saja.');
            optionsRef.current.onClosed?.();
          },
        });
      } else if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
        toast.info('Halaman pembayaran dibuka di tab baru.');
      } else {
        toast.error('Sesi pembayaran telah kadaluarsa. Silakan buat pembayaran baru.');
      }
    },
    [openSnap, invalidateSubscription]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
    invoiceRef.current = null;
  }, []);

  return {
    pay,
    resumePayment,
    checkStatus,
    reset,
    status,
    errorMessage,
    isCreating: status === 'creating',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isFailed: status === 'failed',
    isBusy: status === 'creating' || status === 'pending',
    invoiceNumber: invoiceRef.current,
  };
}
