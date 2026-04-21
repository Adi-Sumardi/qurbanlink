<?php

namespace App\Http\Middleware;

use App\Models\Plan;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeature
{
    public function handle(Request $request, Closure $next, string $feature): Response
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

        if (!$plan || !($plan->features[$feature] ?? false)) {
            abort(403, "Fitur '{$feature}' tidak tersedia pada paket Anda. Silakan upgrade.");
        }

        return $next($request);
    }
}
