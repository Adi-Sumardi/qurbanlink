<?php

namespace App\Actions\Subscription;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Services\MootaPaymentService;
use Illuminate\Support\Facades\DB;

class SubscribeAction
{
    public function __construct(
        private MootaPaymentService $paymentService,
    ) {}

    public function execute(Tenant $tenant, string $plan, string $billingCycle = 'monthly'): array
    {
        $planConfig = config("plans.{$plan}");

        if (! $planConfig) {
            throw new \InvalidArgumentException("Plan '{$plan}' not found.");
        }

        $price = $billingCycle === 'yearly' ? $planConfig['price_yearly'] : $planConfig['price_monthly'];

        return DB::transaction(function () use ($tenant, $plan, $billingCycle, $price, $planConfig) {
            // Create pending subscription
            $subscription = Subscription::create([
                'tenant_id' => $tenant->id,
                'plan' => SubscriptionPlan::from($plan),
                'status' => $price > 0 ? SubscriptionStatus::Suspended : SubscriptionStatus::Active,
                'coupon_quota' => $planConfig['coupon_quota'] ?? 100,
                'coupon_used' => 0,
                'price' => $price,
                'billing_cycle' => $billingCycle,
                'starts_at' => $price > 0 ? null : now(),
                'expires_at' => $price > 0 ? null : ($billingCycle === 'yearly' ? now()->addYear() : now()->addMonth()),
            ]);

            $payment = null;

            if ($price > 0) {
                // Generate unique amount for Moota matching
                $uniqueAmount = $this->paymentService->generateUniqueAmount($price);

                $payment = Payment::create([
                    'tenant_id' => $tenant->id,
                    'subscription_id' => $subscription->id,
                    'payment_type' => PaymentType::Subscription,
                    'amount' => $uniqueAmount,
                    'currency' => 'IDR',
                    'status' => PaymentStatus::Pending,
                    'invoice_number' => $this->paymentService->generateInvoiceNumber(),
                    'expired_at' => now()->addHours(config('qurbanlink.subscription.payment_expiry_hours', 24)),
                    'metadata' => [
                        'original_price' => $price,
                        'plan' => $plan,
                        'billing_cycle' => $billingCycle,
                    ],
                ]);
            }

            return [
                'subscription' => $subscription,
                'payment' => $payment,
            ];
        });
    }
}
