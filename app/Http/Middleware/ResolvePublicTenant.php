<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Scopes\TenantScope;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolvePublicTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenantSlug = $request->route('tenantSlug');
        $tenant = Tenant::where('slug', $tenantSlug)
            ->where('is_active', true)
            ->first();

        if (!$tenant) {
            abort(404, 'Organisasi tidak ditemukan');
        }

        app()->instance('current_tenant', $tenant);
        TenantScope::setTenant($tenant);

        return $next($request);
    }
}
