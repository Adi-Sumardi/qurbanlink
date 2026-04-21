<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->has('current_tenant')) {
            return $next($request);
        }

        // Subscription management routes must always be accessible
        // so users can subscribe/resume even without an active plan
        if ($request->is('api/v1/subscriptions/*') || $request->is('api/v1/subscriptions')) {
            return $next($request);
        }

        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;

        if (!$subscription) {
            abort(403, 'Tidak ada subscription aktif. Silakan pilih paket terlebih dahulu.');
        }

        return $next($request);
    }
}
