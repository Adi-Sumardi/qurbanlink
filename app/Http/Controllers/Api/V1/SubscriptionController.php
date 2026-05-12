<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\SubscriptionResource;
use App\Models\Payment;
use App\Models\Plan;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    /**
     * Return all active plans from database.
     */
    public function plans(): JsonResponse
    {
        $plans = Plan::active()->ordered()->get();

        return $this->success($plans, 'Subscription plans retrieved successfully.');
    }

    /**
     * Return current tenant's active subscription.
     */
    public function current(Request $request): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;
        $subscription = $tenant->activeSubscription;

        if (!$subscription) {
            return $this->error('No active subscription found.', 404);
        }

        return $this->success(new SubscriptionResource($subscription), 'Current subscription retrieved successfully.');
    }

    /**
     * Create a Midtrans Snap payment session for upgrading/subscribing to a plan.
     */
    public function subscribe(Request $request, MidtransService $midtrans): JsonResponse
    {
        $validated = $request->validate([
            'plan'          => ['required', 'string', 'exists:plans,slug'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
        ]);

        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;
        $user   = $request->user();

        $plan  = Plan::where('slug', $validated['plan'])->where('is_active', true)->firstOrFail();
        $price = $validated['billing_cycle'] === 'yearly' ? $plan->price_yearly : $plan->price_monthly;

        // Free plan — activate directly without payment
        if ($price === 0) {
            return $this->success([
                'snap_token'   => null,
                'payment_url'  => null,
                'invoice_number' => null,
                'amount'       => 0,
                'is_free'      => true,
            ], 'Paket gratis, tidak perlu pembayaran.');
        }

        // Generate invoice number
        $invoiceNumber = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        // Create pending payment record
        $payment = Payment::create([
            'tenant_id'      => $tenant->id,
            'payment_type'   => PaymentType::Subscription,
            'amount'         => $price,
            'status'         => PaymentStatus::Pending,
            'invoice_number' => $invoiceNumber,
            'expired_at'     => now()->addHours(24),
            'metadata'       => [
                'plan'          => $plan->slug,
                'billing_cycle' => $validated['billing_cycle'],
                'plan_name'     => $plan->name,
                'coupon_quota'  => $plan->coupon_quota,
            ],
        ]);

        // Create Midtrans Snap token
        try {
            $snapResult = $midtrans->createSnapToken([
                'order_id'      => $invoiceNumber,
                'amount'        => (int) $price,
                'first_name'    => $user->name,
                'email'         => $user->email,
                'plan_name'     => $plan->name,
                'billing_cycle' => $validated['billing_cycle'] === 'yearly' ? 'Tahunan' : 'Bulanan',
            ]);

            // Store snap token in payment record
            $payment->update([
                'snap_token'        => $snapResult->token ?? null,
                'snap_redirect_url' => $snapResult->redirect_url ?? null,
                'midtrans_order_id' => $invoiceNumber,
            ]);

            return $this->success([
                'snap_token'     => $snapResult->token,
                'payment_url'    => $snapResult->redirect_url,
                'invoice_number' => $invoiceNumber,
                'amount'         => $price,
                'is_free'        => false,
            ], 'Sesi pembayaran berhasil dibuat.');
        } catch (\Exception $e) {
            // Clean up failed payment record
            $payment->delete();

            \Log::error('Midtrans Snap error', [
                'error'   => $e->getMessage(),
                'tenant'  => $tenant->id,
                'plan'    => $plan->slug,
            ]);

            return $this->error('Gagal membuat sesi pembayaran Midtrans. ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle Midtrans payment notification (webhook).
     */
    public function notification(Request $request, MidtransService $midtrans): JsonResponse
    {
        try {
            $notification = $midtrans->parseNotification();

            $orderId       = $notification->order_id;
            $statusCode    = $notification->status_code;
            $grossAmount   = $notification->gross_amount;
            $signature     = $request->input('signature_key', '');

            // Validate signature
            if (!$midtrans->isSignatureValid($orderId, $statusCode, $grossAmount, $signature)) {
                return $this->error('Invalid signature.', 403);
            }

            $payment = Payment::where('invoice_number', $orderId)
                ->orWhere('midtrans_order_id', $orderId)
                ->first();

            if (!$payment) {
                return $this->error('Payment not found.', 404);
            }

            $transactionStatus = $notification->transaction_status;
            $fraudStatus       = $notification->fraud_status ?? null;

            // Map Midtrans status to our status
            if ($transactionStatus === 'capture') {
                $newStatus = ($fraudStatus === 'accept') ? PaymentStatus::Paid : PaymentStatus::Failed;
            } elseif ($transactionStatus === 'settlement') {
                $newStatus = PaymentStatus::Paid;
            } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
                $newStatus = PaymentStatus::Failed;
            } elseif ($transactionStatus === 'pending') {
                $newStatus = PaymentStatus::Pending;
            } else {
                $newStatus = PaymentStatus::Pending;
            }

            $updateData = [
                'status'         => $newStatus,
                'payment_method' => $notification->payment_type ?? null,
            ];

            if ($newStatus === PaymentStatus::Paid) {
                $updateData['paid_at'] = now();
            }

            $payment->update($updateData);

            // Activate subscription on successful payment
            if ($newStatus === PaymentStatus::Paid) {
                $this->activateSubscription($payment);
            }

            return $this->success(null, 'OK');
        } catch (\Exception $e) {
            \Log::error('Midtrans notification error', ['error' => $e->getMessage()]);
            return $this->error('Notification processing failed.', 500);
        }
    }

    /**
     * Check payment status by invoice number.
     */
    public function paymentStatus(Request $request): JsonResponse
    {
        $invoiceNumber = $request->query('invoice');

        if (!$invoiceNumber) {
            return $this->error('Invoice number required.', 422);
        }

        $tenant  = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;
        $payment = Payment::where('invoice_number', $invoiceNumber)
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$payment) {
            return $this->error('Payment not found.', 404);
        }

        return $this->success([
            'invoice_number' => $payment->invoice_number,
            'status'         => $payment->status,
            'amount'         => $payment->amount,
            'paid_at'        => $payment->paid_at,
            'metadata'       => $payment->metadata,
        ], 'Payment status retrieved.');
    }

    /**
     * Get single payment detail for invoice print.
     */
    public function paymentDetail(Request $request, Payment $payment): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;

        if ($payment->tenant_id !== $tenant->id) {
            return $this->error('Payment not found.', 404);
        }

        return $this->success($payment, 'Payment detail retrieved.');
    }

    /**
     * Re-activate subscription for a paid payment that was not activated (e.g. webhook failure).
     */
    public function syncSubscription(Request $request): JsonResponse
    {
        try {
            $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()?->tenant;

            if (!$tenant) {
                return $this->error('Tenant tidak ditemukan.', 404);
            }

            $payment = Payment::where('tenant_id', $tenant->id)
                ->where('status', PaymentStatus::Paid)
                ->whereNull('subscription_id')
                ->where('payment_type', PaymentType::Subscription)
                ->latest('paid_at')
                ->first();

            if (!$payment) {
                return $this->error('Tidak ada pembayaran yang perlu disinkronkan.', 404);
            }

            Log::info('syncSubscription: starting activation', [
                'tenant_id'  => $tenant->id,
                'payment_id' => $payment->id,
                'invoice'    => $payment->invoice_number,
                'metadata'   => $payment->metadata,
            ]);

            $this->activateSubscription($payment);

            $subscription = $tenant->fresh()?->activeSubscription;

            if (!$subscription) {
                Log::warning('syncSubscription: activation returned no active subscription', [
                    'tenant_id'  => $tenant->id,
                    'payment_id' => $payment->id,
                ]);
                return $this->error('Gagal mengaktifkan langganan. Cek metadata payment atau hubungi support.', 422);
            }

            return $this->success(new SubscriptionResource($subscription), 'Langganan berhasil diaktifkan.');
        } catch (\Throwable $e) {
            Log::error('syncSubscription: exception', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile() . ':' . $e->getLine(),
                'trace'   => $e->getTraceAsString(),
            ]);
            return $this->error('Terjadi kesalahan saat sinkronisasi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Resume a pending payment — generate a new Snap token using the same invoice number.
     */
    public function resumePayment(Request $request, Payment $payment, MidtransService $midtrans): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;

        // Security: payment must belong to current tenant
        if ($payment->tenant_id !== $tenant->id) {
            return $this->error('Payment not found.', 404);
        }

        if ($payment->status !== PaymentStatus::Pending) {
            return $this->error('Only pending payments can be resumed.', 422);
        }

        if ($payment->expired_at && now()->isAfter($payment->expired_at)) {
            return $this->error('This payment has expired. Please create a new payment.', 422);
        }

        $user = $request->user();
        $meta = $payment->metadata ?? [];

        // Ensure we have an order_id — legacy payments may not have invoice_number
        $orderId = $payment->midtrans_order_id
            ?? $payment->invoice_number
            ?? ('INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)));

        // Persist order_id and invoice_number if they were missing
        $updateData = [];
        if (!$payment->midtrans_order_id) $updateData['midtrans_order_id'] = $orderId;
        if (!$payment->invoice_number)    $updateData['invoice_number']    = $orderId;
        if ($updateData) $payment->update($updateData);

        try {
            $snapResult = $midtrans->createSnapToken([
                'order_id'      => $orderId,
                'amount'        => (int) $payment->amount,
                'first_name'    => $user->name,
                'email'         => $user->email,
                'plan_name'     => $meta['plan_name'] ?? 'Langganan',
                'billing_cycle' => ($meta['billing_cycle'] ?? 'monthly') === 'yearly' ? 'Tahunan' : 'Bulanan',
            ]);

            $payment->update([
                'snap_token'        => $snapResult->token ?? null,
                'snap_redirect_url' => $snapResult->redirect_url ?? null,
            ]);

            return $this->success([
                'snap_token'     => $snapResult->token,
                'payment_url'    => $snapResult->redirect_url,
                'invoice_number' => $payment->invoice_number,
                'amount'         => $payment->amount,
                'is_free'        => false,
            ], 'Payment session resumed successfully.');
        } catch (\Exception $e) {
            \Log::error('Midtrans resume payment error', [
                'error'      => $e->getMessage(),
                'payment_id' => $payment->id,
            ]);

            return $this->error('Gagal membuat ulang sesi pembayaran. ' . $e->getMessage(), 500);
        }
    }

    /**
     * List payments for current tenant.
     */
    public function payments(Request $request): JsonResponse
    {
        $tenant   = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;
        $payments = $tenant->payments()->latest()->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(
            PaymentResource::collection($payments)->response()->getData(true),
            'Payments retrieved successfully.'
        );
    }

    /**
     * Create a Midtrans Snap payment session for coupon top-up.
     * Price: Rp 1.000 per coupon, minimum 10, multiples of 10.
     */
    public function couponTopup(Request $request, MidtransService $midtrans): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:10', 'max:10000', 'multiple_of:10'],
        ]);

        $tenant   = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;
        $user     = $request->user();
        $quantity = (int) $validated['quantity'];
        $amount   = $quantity * 1000;

        $invoiceNumber = 'INV-TOPUP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

        $payment = Payment::create([
            'tenant_id'       => $tenant->id,
            'payment_type'    => PaymentType::AddonCoupon,
            'coupon_quantity' => $quantity,
            'amount'          => $amount,
            'status'          => PaymentStatus::Pending,
            'invoice_number'  => $invoiceNumber,
            'expired_at'      => now()->addHours(24),
            'metadata'        => [
                'coupon_quantity'  => $quantity,
                'price_per_coupon' => 1000,
            ],
        ]);

        try {
            $snapResult = $midtrans->createSnapToken([
                'order_id'      => $invoiceNumber,
                'amount'        => $amount,
                'first_name'    => $user->name,
                'email'         => $user->email,
                'plan_name'     => "Top-up {$quantity} Kupon",
                'billing_cycle' => 'Sekali Bayar',
            ]);

            $payment->update([
                'snap_token'        => $snapResult->token ?? null,
                'snap_redirect_url' => $snapResult->redirect_url ?? null,
                'midtrans_order_id' => $invoiceNumber,
            ]);

            return $this->success([
                'snap_token'     => $snapResult->token,
                'payment_url'    => $snapResult->redirect_url,
                'invoice_number' => $invoiceNumber,
                'amount'         => $amount,
                'quantity'       => $quantity,
                'is_free'        => false,
            ], 'Sesi pembayaran top-up kupon berhasil dibuat.');
        } catch (\Exception $e) {
            $payment->delete();
            \Log::error('Midtrans Snap topup error', ['error' => $e->getMessage(), 'tenant' => $tenant->id]);
            return $this->error('Gagal membuat sesi pembayaran. ' . $e->getMessage(), 500);
        }
    }

    /**
     * Activate or create a subscription after payment success.
     */
    private function activateSubscription(Payment $payment): void
    {
        // Handle coupon top-up — increment quota on active subscription
        if ($payment->payment_type === PaymentType::AddonCoupon) {
            $quantity = $payment->coupon_quantity ?? ($payment->metadata['coupon_quantity'] ?? 0);
            if ($quantity > 0) {
                $subscription = $payment->tenant->activeSubscription;
                if ($subscription) {
                    $subscription->increment('coupon_quota', $quantity);
                    $payment->update(['subscription_id' => $subscription->id]);
                }
            }
            return;
        }

        // metadata is cast to array by Eloquent — no json_decode needed
        $meta         = $payment->metadata ?? [];
        $planSlug     = $meta['plan'] ?? null;
        $billingCycle = $meta['billing_cycle'] ?? 'monthly';
        $couponQuota  = $meta['coupon_quota'] ?? 100;

        if (!$planSlug) {
            \Log::error('activateSubscription: plan slug missing from metadata', [
                'payment_id'  => $payment->id,
                'invoice'     => $payment->invoice_number,
                'metadata_raw'=> $payment->getRawOriginal('metadata'),
            ]);
            return;
        }

        \Log::info('activateSubscription: activating', [
            'payment_id'   => $payment->id,
            'invoice'      => $payment->invoice_number,
            'plan'         => $planSlug,
            'billing_cycle'=> $billingCycle,
        ]);

        $tenant = $payment->tenant;

        // Deactivate any existing active subscription
        $tenant->subscriptions()
            ->whereIn('status', ['active', 'grace'])
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        $expiresAt = $billingCycle === 'yearly'
            ? now()->addYear()
            : now()->addMonth();

        $subscription = $tenant->subscriptions()->create([
            'plan'         => $planSlug,
            'status'       => 'active',
            'price'        => $payment->amount,
            'coupon_quota' => $couponQuota,
            'coupon_used'  => 0,
            'billing_cycle'=> $billingCycle,
            'starts_at'    => now(),
            'expires_at'   => $expiresAt,
        ]);

        // Link payment → subscription
        $payment->update(['subscription_id' => $subscription->id]);
    }
}
