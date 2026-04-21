<?php

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use Illuminate\Support\Facades\Schedule;

// Check expired subscriptions daily
Schedule::call(function () {
    Subscription::where('status', SubscriptionStatus::Active)
        ->whereNotNull('expires_at')
        ->where('expires_at', '<', now())
        ->where(function ($q) {
            $q->whereNull('grace_ends_at')
                ->orWhere('grace_ends_at', '<', now());
        })
        ->update(['status' => SubscriptionStatus::Expired]);
})->daily()->name('check-expired-subscriptions');

// Downgrade expired subscriptions to free plan
Schedule::call(function () {
    $expired = Subscription::where('status', SubscriptionStatus::Expired)
        ->where('updated_at', '<', now()->subDays(1))
        ->with('tenant')
        ->get();

    foreach ($expired as $subscription) {
        // Create a new free subscription for the tenant
        Subscription::create([
            'tenant_id' => $subscription->tenant_id,
            'plan' => 'free',
            'status' => SubscriptionStatus::Active,
            'coupon_quota' => config('plans.free.coupon_quota', 100),
            'coupon_used' => 0,
            'price' => 0,
            'billing_cycle' => 'monthly',
            'starts_at' => now(),
        ]);
    }
})->daily()->name('downgrade-expired-subscriptions');
