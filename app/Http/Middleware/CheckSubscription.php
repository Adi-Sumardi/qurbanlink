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

        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;

        if (!$subscription) {
            abort(403, 'Tidak ada subscription aktif. Silakan pilih paket.');
        }

        return $next($request);
    }
}
