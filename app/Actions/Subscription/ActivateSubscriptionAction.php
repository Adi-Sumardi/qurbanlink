<?php

namespace App\Actions\Subscription;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\Subscription;

class ActivateSubscriptionAction
{
    public function execute(Payment $payment): Subscription
    {
        $payment->update([
            'status' => PaymentStatus::Paid,
            'paid_at' => now(),
        ]);

        $subscription = $payment->subscription;

        $startsAt = now();
        $expiresAt = $subscription->billing_cycle === 'yearly'
            ? $startsAt->copy()->addYear()
            : $startsAt->copy()->addMonth();

        $subscription->update([
            'status' => SubscriptionStatus::Active,
            'starts_at' => $startsAt,
            'expires_at' => $expiresAt,
            'grace_ends_at' => $expiresAt->copy()->addDays(config('qurbanlink.subscription.grace_period_days', 7)),
        ]);

        // Deactivate other subscriptions for this tenant
        Subscription::where('tenant_id', $subscription->tenant_id)
            ->where('id', '!=', $subscription->id)
            ->where('status', SubscriptionStatus::Active)
            ->update(['status' => SubscriptionStatus::Expired]);

        return $subscription->fresh();
    }
}
