<?php

namespace App\Http\Middleware;

use App\Scopes\TenantScope;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (!$tenant) {
            abort(404, 'Tenant not found');
        }

        if (!$tenant->is_active) {
            abort(403, 'Organisasi Anda sedang dinonaktifkan. Hubungi admin.');
        }

        app()->instance('current_tenant', $tenant);
        TenantScope::setTenant($tenant);

        return $next($request);
    }
}
