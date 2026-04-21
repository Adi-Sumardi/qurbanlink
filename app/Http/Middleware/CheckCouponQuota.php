<?php

namespace App\Http\Middleware;

use App\Models\Plan;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCouponQuota
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->has('current_tenant')) {
            return $next($request);
        }

        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;

        if (!$subscription) {
            abort(403, 'Tidak ada subscription aktif.');
        }

        $planSlug = $subscription->plan instanceof \BackedEnum
            ? $subscription->plan->value
            : $subscription->plan;

        $plan = Plan::where('slug', $planSlug)->first();

        // coupon_quota = 0 means unlimited
        $quota = $plan?->coupon_quota ?? null;

        if ($quota !== null && $quota > 0 && $subscription->coupon_used >= $quota) {
            abort(403, 'Kuota kupon habis. Silakan upgrade paket atau beli kuota tambahan.');
        }

        return $next($request);
    }
}
