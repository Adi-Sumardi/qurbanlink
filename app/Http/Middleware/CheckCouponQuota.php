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
            return response()->json([
                'message' => 'Tidak ada subscription aktif.',
                'code' => 'NO_SUBSCRIPTION',
            ], 403);
        }

        $planSlug = $subscription->plan instanceof \BackedEnum
            ? $subscription->plan->value
            : $subscription->plan;

        $plan = Plan::where('slug', $planSlug)->first();

        // coupon_quota = 0 means unlimited
        $quota = $plan?->coupon_quota ?? null;

        if ($quota !== null && $quota > 0 && $subscription->coupon_used >= $quota) {
            return response()->json([
                'message' => 'Kuota kupon habis. Silakan upgrade paket atau beli kuota tambahan.',
                'code' => 'QUOTA_EXCEEDED',
            ], 403);
        }

        return $next($request);
    }
}
