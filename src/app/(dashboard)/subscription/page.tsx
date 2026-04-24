'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CreditCard,
  Loader2,
  Check,
  X,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  TrendingUp,
  Receipt,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  PlayCircle,
  Plus,
  Minus,
  Ticket,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { subscriptionService } from '@/services/subscription.service';
import type { SubscriptionPlanInfo } from '@/services/subscription.service';
import { usePayment } from '@/hooks/use-payment';
import { useMidtransSnap } from '@/hooks/use-midtrans';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import {
  SUBSCRIPTION_PLAN_LABELS,
  PAYMENT_STATUS_LABELS,
} from '@/lib/constants';
import { StatusBadge } from '@/components/common/status-badge';
import { PaymentStatus } from '@/types/enums';
import type { Payment } from '@/types';

/* ─── Constants ───────────────────────────────────────────────── */

const FEATURE_LABELS: Record<string, string> = {
  qr_code: 'QR Code Scan',
  manual_scan: 'Manual Scan',
  live_dashboard: 'Live Dashboard',
  export_pdf: 'Export PDF',
  export_excel: 'Export Excel',
  priority_support: 'Priority Support',
};

const HIDDEN_FEATURES = new Set(['custom_branding', 'email_notifications', 'api_access']);

const PAYMENT_STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  paid: 'default',
  pending: 'secondary',
  failed: 'destructive',
  expired: 'outline',
  refunded: 'outline',
};

const PLAN_HIGHLIGHT: Record<string, boolean> = {
  professional: true,
};

const PLAN_GRADIENT: Record<string, string> = {
  free: 'from-slate-400 to-slate-500',
  starter: 'from-blue-500 to-blue-600',
  professional: 'from-[#004532] to-[#065f46]',
  enterprise: 'from-purple-600 to-purple-700',
};

/* ─── Component ───────────────────────────────────────────────── */

function SubscriptionPageInner() {
  const searchParams = useSearchParams();
  const autoPayPlan = searchParams.get('plan');
  const autoOpenRef = useRef(false);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanInfo | null>(null);
  const [resumingId, setResumingId] = useState<string | null>(null);
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupQty, setTopupQty] = useState(10);
  const [topupLoading, setTopupLoading] = useState(false);

  const qc = useQueryClient();
  const { openSnap } = useMidtransSnap();

  const { pay, resumePayment, isBusy, isCreating } = usePayment({
    onClosed: () => {
      // Jika user tutup Snap tanpa bayar, biarkan mereka buka dialog lagi manual
    },
  });

  const handleResume = useCallback(async (payment: Payment) => {
    setResumingId(payment.id);
    try {
      const res = await subscriptionService.resumePayment(payment.id);
      const result = res.data;
      if (result?.snap_token) {
        resumePayment(result.snap_token, result.invoice_number ?? payment.invoice_number, result.payment_url);
      } else if (result?.payment_url) {
        window.open(result.payment_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // toast shown by axios interceptor
    } finally {
      setResumingId(null);
    }
  }, [resumePayment]);

  /* — Queries — */
  const { data: subscriptionRes, isLoading: loadingSub } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrent(),
  });

  const { data: paymentsRes, isLoading: loadingPayments } = useQuery({
    queryKey: ['subscription', 'payments'],
    queryFn: () => subscriptionService.getPayments(),
  });

  const { data: plansRes, isLoading: loadingPlans, isError: plansError } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 5 * 60 * 1000, // cache 5 min
  });



  /* — Derived — */
  const sub = subscriptionRes?.data;

  // Handle semua kemungkinan format API response:
  // 1. plansRes langsung adalah array
  // 2. plansRes.data adalah array (format ApiResponse standar)
  // 3. plansRes.data.data adalah array (paginated / doubly-nested)
  function extractArray<T>(raw: unknown): T[] {
    if (Array.isArray(raw)) return raw as T[];
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r?.data)) return r.data as T[];
    const nested = r?.data as Record<string, unknown> | undefined;
    if (Array.isArray(nested?.data)) return nested!.data as T[];
    return [];
  }

  const payments: Payment[] = extractArray<Payment>(paymentsRes);
  const plans: SubscriptionPlanInfo[] = extractArray<SubscriptionPlanInfo>(plansRes);

  /* — Auto-open plan dialog from URL param — */
  useEffect(() => {
    if (!autoPayPlan || autoOpenRef.current || loadingPlans || plans.length === 0) return;
    const found = plans.find((p) => p.slug === autoPayPlan);
    if (!found) return;
    autoOpenRef.current = true;
    setSelectedPlan(found);
    setShowPlans(true);
  }, [autoPayPlan, loadingPlans, plans]);

  // Paket yang aktif saat ini
  const currentPlanInfo = plans.find((p) => p.slug === sub?.plan);

  // Modal upgrade TIDAK PERNAH menampilkan paket gratis.
  // Jika user punya paket berbayar, tampilkan hanya yang lebih mahal.
  const upgradablePlans = plans.filter((p) => {
    if (p.price_monthly === 0) return false;                              // selalu sembunyikan free
    if (currentPlanInfo && currentPlanInfo.price_monthly > 0) {
      return p.price_monthly > currentPlanInfo.price_monthly;            // hanya tier lebih tinggi
    }
    return true;                                                          // user belum punya paket / paket free → tampilkan semua paid
  });

  // Responsive column count based on actual number of upgradable plans
  const planGridCols =
    upgradablePlans.length === 1 ? 'grid-cols-1' :
    upgradablePlans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    upgradablePlans.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                         'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';


  const quotaUsed = sub ? sub.coupon_used : 0;
  const quotaTotal = sub ? sub.coupon_quota : 1;
  const quotaPct = quotaTotal > 0 ? Math.round((quotaUsed / quotaTotal) * 100) : 0;
  const features = (sub?.plan_details as Record<string, unknown>)?.features as
    | Record<string, boolean>
    | undefined;

  const isExpiringSoon =
    sub?.expires_at &&
    new Date(sub.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  /* — Handlers — */
  function handleSelectPlan(plan: SubscriptionPlanInfo) {
    setSelectedPlan(plan);
  }

  async function handlePay() {
    if (!selectedPlan) return;
    const plan = selectedPlan;

    // Tutup dialog SEBELUM buka Snap agar overlay tidak menghalangi klik Midtrans
    setShowPlans(false);
    setSelectedPlan(null);

    await pay(plan.slug, billingCycle);
  }

  async function handleTopup() {
    setTopupLoading(true);
    try {
      const res = await subscriptionService.couponTopup(topupQty);
      const result = res.data;
      setTopupOpen(false);
      if (result?.snap_token) {
        openSnap(result.snap_token, {
          onSuccess: () => {
            toast.success(`${topupQty} kupon berhasil ditambahkan!`);
            qc.invalidateQueries({ queryKey: ['subscription'] });
          },
          onPending: () => {
            toast.info('Pembayaran top-up sedang diproses.');
            qc.invalidateQueries({ queryKey: ['subscription'] });
          },
          onError: () => toast.error('Pembayaran top-up gagal.'),
          onClose: () => toast.info('Jendela pembayaran ditutup.'),
        });
      } else if (result?.payment_url) {
        window.open(result.payment_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast.error('Gagal membuat sesi pembayaran top-up.');
    } finally {
      setTopupLoading(false);
    }
  }

  function handleDownloadInvoice(payment: Payment) {
    if (payment.invoice_url) {
      window.open(payment.invoice_url, '_blank', 'noopener,noreferrer');
    }
  }

  /* — Yearly discount — */
  const yearlyDiscount = 20; // 20%

  function getPrice(plan: SubscriptionPlanInfo) {
    return billingCycle === 'yearly'
      ? plan.price_yearly
      : plan.price_monthly;
  }

  /* ─── Render ─────────────────────────────────────────────────── */

  if (loadingSub) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
            Billing &amp; Subscription
          </p>
          <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Langganan</h1>
          <p className="mt-1 text-sm text-[#3f4944]">
            Kelola paket langganan dan lihat riwayat pembayaran Anda
          </p>
        </div>
        <Button
          onClick={() => setShowPlans(true)}
          className="btn-gradient gap-2 rounded-full px-6 py-2.5 font-bold shadow-lg shadow-[#004532]/20"
        >
          <Sparkles className="size-4" />
          {sub ? 'Upgrade / Ganti Paket' : 'Pilih Paket'}
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Langganan Hampir Berakhir</AlertTitle>
          <AlertDescription>
            Langganan Anda akan berakhir pada {formatDate(sub!.expires_at)}. Segera perpanjang
            untuk menghindari gangguan layanan.{' '}
            <button
              onClick={() => setShowPlans(true)}
              className="font-semibold underline underline-offset-2"
            >
              Perpanjang sekarang →
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Grace period warning */}
      {sub?.grace_ends_at && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Masa Tenggang Aktif</AlertTitle>
          <AlertDescription>
            Langganan dalam masa tenggang hingga {formatDate(sub.grace_ends_at)}.
            Segera lakukan pembayaran untuk melanjutkan layanan.
          </AlertDescription>
        </Alert>
      )}

      {/* ─── Current Plan Card ─────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#a6f2d1]">
              <CreditCard className="size-5 text-[#004532]" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-[#191c1e]">Paket Langganan Aktif</h2>
              <p className="text-xs text-[#3f4944]/60">Status dan detail paket Anda saat ini</p>
            </div>
          </div>
          {sub && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => setShowPlans(true)}
            >
              <RefreshCw className="size-3.5" />
              Perpanjang / Upgrade
            </Button>
          )}
        </div>

        {!sub ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f2f4f6]">
              <CreditCard className="size-8 text-[#3f4944]/30" />
            </div>
            <div>
              <p className="font-semibold text-[#191c1e]">Belum ada langganan aktif</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilih paket untuk mulai menggunakan semua fitur platform
              </p>
            </div>
            <Button
              onClick={() => setShowPlans(true)}
              className="btn-gradient gap-2 rounded-full px-6 font-bold shadow-lg shadow-[#004532]/20"
            >
              <Sparkles className="size-4" />
              Lihat Paket Tersedia
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan Name & Status */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-[#191c1e]">
                {SUBSCRIPTION_PLAN_LABELS[sub.plan] || sub.plan}
              </span>
              <StatusBadge status={sub.status} />
              <Badge variant="outline" className="text-xs">
                {sub.billing_cycle === 'yearly' ? 'Tahunan' : 'Bulanan'}
              </Badge>
            </div>

            {/* Quick Info Row */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-[#f2f4f6] px-4 py-3">
                <TrendingUp className="size-4 text-[#004532]" />
                <div>
                  <p className="text-xs text-muted-foreground">Harga</p>
                  <p className="font-semibold text-[#191c1e]">
                    {formatCurrency(Number(sub.price))}
                    <span className="text-xs text-muted-foreground">
                      /{sub.billing_cycle === 'yearly' ? 'thn' : 'bln'}
                    </span>
                  </p>
                </div>
              </div>
              {sub.starts_at && (
                <div className="flex items-center gap-3 rounded-xl bg-[#f2f4f6] px-4 py-3">
                  <Calendar className="size-4 text-[#004532]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mulai</p>
                    <p className="font-semibold text-[#191c1e]">{formatDate(sub.starts_at)}</p>
                  </div>
                </div>
              )}
              {sub.expires_at && (
                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                    isExpiringSoon ? 'bg-red-50' : 'bg-[#f2f4f6]'
                  }`}
                >
                  <Clock className={`size-4 ${isExpiringSoon ? 'text-red-500' : 'text-[#004532]'}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">Berakhir</p>
                    <p className={`font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-[#191c1e]'}`}>
                      {formatDate(sub.expires_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Quota */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#3f4944]">Kuota Kupon</span>
                  {sub && sub.plan !== 'free' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 gap-1 px-2 text-[10px] font-semibold text-[#004532] border-[#004532]/30 hover:bg-[#004532]/5"
                      onClick={() => { setTopupQty(10); setTopupOpen(true); }}
                    >
                      <Plus className="size-3" />
                      Top-up
                    </Button>
                  )}
                </div>
                <span className="font-bold text-[#191c1e]">
                  {quotaUsed.toLocaleString('id-ID')} / {quotaTotal.toLocaleString('id-ID')}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    ({quotaPct}% digunakan)
                  </span>
                </span>
              </div>
              <div className="progress-sacred">
                <div style={{ width: `${quotaPct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                Sisa kuota:{' '}
                <span className="font-semibold text-[#004532]">
                  {sub.coupon_remaining.toLocaleString('id-ID')} kupon
                </span>
              </p>
            </div>

            {/* Features */}
            {features && Object.keys(features).length > 0 && (
              <div>
                <Separator className="mb-4" />
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
                  Fitur Paket
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(features).filter(([key]) => !HIDDEN_FEATURES.has(key)).map(([key, enabled]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ${
                        enabled ? 'bg-[#f2f4f6]' : 'opacity-40'
                      }`}
                    >
                      {enabled ? (
                        <div className="flex size-5 items-center justify-center rounded-full bg-[#004532]">
                          <Check className="size-3 text-white" />
                        </div>
                      ) : (
                        <div className="flex size-5 items-center justify-center rounded-full bg-muted">
                          <X className="size-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={enabled ? 'font-medium text-[#191c1e]' : 'text-[#3f4944]/60'}>
                        {FEATURE_LABELS[key] || key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Payment History ────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#a6f2d1]">
            <Receipt className="size-5 text-[#004532]" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-[#191c1e]">Riwayat Pembayaran</h2>
            <p className="text-xs text-[#3f4944]/60">Invoice dan tagihan langganan Anda</p>
          </div>
        </div>

        {loadingPayments ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Receipt className="size-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Belum ada riwayat pembayaran</p>
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
                  <TableHead>Kadaluarsa</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {payment.invoice_number}
                    </TableCell>
                    <TableCell className="capitalize text-sm text-muted-foreground">
                      {payment.payment_type === 'subscription'
                        ? 'Langganan'
                        : payment.payment_type === 'addon_coupon'
                        ? 'Top-up Kupon'
                        : payment.payment_type}
                    </TableCell>
                    <TableCell className="font-semibold text-[#191c1e]">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={PAYMENT_STATUS_VARIANT[payment.status] ?? 'outline'}>
                        {PAYMENT_STATUS_LABELS[payment.status] ?? payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.paid_at ? formatDate(payment.paid_at) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.expired_at ? formatDate(payment.expired_at) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol lanjut bayar: tampil jika status pending (string maupun enum value) */}
                        {(payment.status === PaymentStatus.Pending ||
                          (payment.status as string) === 'pending') && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1.5 bg-[#004532] text-white hover:bg-[#003526]"
                            disabled={resumingId === payment.id || isBusy}
                            onClick={() => handleResume(payment)}
                          >
                            {resumingId === payment.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <PlayCircle className="size-3.5" />
                            )}
                            Lanjutkan
                          </Button>
                        )}
                        {payment.invoice_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-[#004532] hover:text-[#004532]"
                            onClick={() => handleDownloadInvoice(payment)}
                          >
                            <Download className="size-3.5" />
                            Unduh
                            <ExternalLink className="size-3" />
                          </Button>
                        ) : (
                          payment.status !== PaymentStatus.Pending &&
                          (payment.status as string) !== 'pending' && (
                            <span className="text-xs text-muted-foreground">Tidak tersedia</span>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ─── Plan Selection Dialog ──────────────────────────────── */}
      <Dialog open={showPlans} onOpenChange={(open) => { setShowPlans(open); if (!open) setSelectedPlan(null); }}>
        <DialogContent className="flex h-[92vh] max-h-[92vh] w-[95vw] max-w-5xl flex-col gap-0 overflow-hidden p-0">
          {/* Header */}
          <div className="shrink-0 space-y-1 border-b px-6 pb-4 pt-6">
            <DialogTitle className="text-xl font-bold">Pilih Paket Langganan</DialogTitle>
            <DialogDescription>
              Pilih paket yang sesuai kebutuhan organisasi Anda. Bayar via Midtrans — transfer bank, kartu kredit, e-wallet, dan QRIS didukung.
            </DialogDescription>
          </div>

          {/* Billing toggle */}
          <div className="shrink-0 flex justify-center px-6 py-4 border-b bg-muted/20">
            <div className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#004532] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-[#191c1e]'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-[#004532] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-[#191c1e]'
                }`}
              >
                Tahunan
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Hemat {yearlyDiscount}%
                </span>
              </button>
            </div>
          </div>

          {/* Scrollable plan cards */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {loadingPlans ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <Loader2 className="size-7 animate-spin text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Memuat paket tersedia...</p>
              </div>
            ) : plansError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <AlertCircle className="size-10 text-destructive/40" />
                <p className="text-sm font-medium text-destructive">Gagal memuat paket langganan</p>
                <p className="text-xs text-muted-foreground">Pastikan koneksi ke server aktif, lalu coba lagi.</p>
              </div>
            ) : upgradablePlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Sparkles className="size-10 text-[#004532]/30" />
                <p className="text-sm font-semibold text-[#191c1e]">Anda sudah di paket tertinggi</p>
                <p className="text-xs text-muted-foreground">Tidak ada paket upgrade yang tersedia saat ini.</p>
              </div>
            ) : (
              <div className={`grid gap-5 items-stretch ${planGridCols}`}>
                {upgradablePlans.map((plan) => {
                  const isHighlighted = PLAN_HIGHLIGHT[plan.slug];
                  const isSelected = selectedPlan?.slug === plan.slug;
                  const isCurrent = sub?.plan === plan.slug;
                  const price = getPrice(plan);

                  return (
                    <button
                      key={plan.slug}
                      onClick={() => handleSelectPlan(plan)}
                      className={`relative flex h-full flex-col rounded-2xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? 'border-[#004532] ring-2 ring-[#004532]/20 bg-[#004532]/[0.03]'
                          : isHighlighted
                          ? 'border-[#004532]/40 bg-[#004532]/[0.02]'
                          : 'border-border hover:border-[#004532]/40 hover:bg-muted/30'
                      }`}
                    >
                      {/* Popular badge */}
                      {isHighlighted && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#004532] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
                          Populer
                        </span>
                      )}

                      {/* Current plan indicator */}
                      {isCurrent && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <Check className="size-3" />
                          Paket Aktif
                        </span>
                      )}

                      {/* Plan icon */}
                      <div
                        className={`mb-2 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${
                          PLAN_GRADIENT[plan.slug] ?? 'from-gray-400 to-gray-500'
                        }`}
                      >
                        <Zap className="size-4 text-white" />
                      </div>

                      {/* Name */}
                      <h3 className="text-sm font-bold text-[#191c1e]">
                        {SUBSCRIPTION_PLAN_LABELS[plan.slug] || plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-1.5 mb-1 min-w-0">
                        {price === 0 ? (
                          <span className="text-lg font-extrabold text-[#191c1e]">Gratis</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-base font-extrabold text-[#191c1e] break-words leading-tight">
                              {formatCurrency(price)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              per {billingCycle === 'yearly' ? 'tahun' : 'bulan'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Coupon quota */}
                      <p className="text-xs text-muted-foreground mb-3">
                        {formatNumber(plan.coupon_quota)} kupon/periode
                      </p>

                      <Separator className="mb-3" />

                      {/* Features */}
                      <ul className="space-y-1 flex-1">
                        {Object.entries(plan.features).filter(([key]) => !HIDDEN_FEATURES.has(key)).map(([key, enabled]) => (
                          <li
                            key={key}
                            className={`flex items-center gap-1.5 text-xs ${
                              enabled ? 'text-[#3f4944]' : 'text-muted-foreground/40 line-through'
                            }`}
                          >
                            {enabled ? (
                              <Check className="size-3 shrink-0 text-[#004532]" />
                            ) : (
                              <X className="size-3 shrink-0" />
                            )}
                            {FEATURE_LABELS[key] || key}
                          </li>
                        ))}
                      </ul>

                      {/* Select indicator */}
                      {isSelected && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[#004532] py-2 text-xs font-bold text-white">
                          <Check className="size-3.5" />
                          Dipilih
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky CTA Footer */}
          <div className="shrink-0 border-t bg-white px-6 py-4">
            {selectedPlan ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#191c1e]">
                    {SUBSCRIPTION_PLAN_LABELS[selectedPlan.slug] || selectedPlan.name}
                    {' — '}
                    <span className="text-[#004532]">
                      {billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getPrice(selectedPlan) === 0
                      ? 'Gratis selamanya'
                      : `Total tagihan: ${formatCurrency(getPrice(selectedPlan))}`}
                  </p>
                </div>
                <Button
                  onClick={handlePay}
                  disabled={isBusy}
                  className="btn-gradient gap-2 rounded-full px-6 font-bold shadow-lg shadow-[#004532]/20 w-full sm:w-auto"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Membuat sesi...
                    </>
                  ) : isBusy ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4" />
                      Bayar via Midtrans
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Pilih paket di atas untuk melanjutkan pembayaran
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Coupon Top-up Dialog ───────────────────────────────── */}
      <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="size-5 text-[#004532]" />
              Top-up Kupon
            </DialogTitle>
            <DialogDescription>
              Tambah kuota kupon Rp 1.000 per kupon, minimal 10 kupon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Quantity stepper */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full"
                onClick={() => setTopupQty((q) => Math.max(10, q - 10))}
                disabled={topupQty <= 10}
              >
                <Minus className="size-4" />
              </Button>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#191c1e]">{topupQty}</p>
                <p className="text-xs text-muted-foreground">kupon</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full"
                onClick={() => setTopupQty((q) => Math.min(10000, q + 10))}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Quick amount buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {[10, 50, 100, 250, 500].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setTopupQty(qty)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    topupQty === qty
                      ? 'bg-[#004532] text-white'
                      : 'bg-[#f2f4f6] text-[#3f4944] hover:bg-[#eceef0]'
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>

            {/* Price summary */}
            <div className="rounded-xl bg-[#f2f4f6] px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{topupQty} kupon × Rp 1.000</span>
                <span className="font-bold text-[#191c1e]">
                  {(topupQty * 1000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setTopupOpen(false)}>
              Batal
            </Button>
            <Button
              className="flex-1 btn-gradient"
              onClick={handleTopup}
              disabled={topupLoading}
            >
              {topupLoading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              Bayar Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense>
      <SubscriptionPageInner />
    </Suspense>
  );
}
