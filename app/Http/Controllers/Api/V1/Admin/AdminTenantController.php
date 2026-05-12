<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTenantController extends Controller
{
    /**
     * List all tenants paginated.
     */
    public function index(Request $request): JsonResponse
    {
        $tenants = Tenant::with('activeSubscription')->latest()->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(TenantResource::collection($tenants)->response()->getData(true), 'Tenants retrieved successfully.');
    }

    /**
     * Show a tenant with subscription.
     */
    public function show(Tenant $tenant): JsonResponse
    {
        $tenant->load('activeSubscription');

        return $this->success(new TenantResource($tenant), 'Tenant retrieved successfully.');
    }

    /**
     * Update a tenant.
     */
    public function update(Request $request, Tenant $tenant): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:tenants,slug,' . $tenant->id],
            'domain' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'settings' => ['nullable', 'array'],
        ]);

        $tenant->update($validated);

        return $this->success(new TenantResource($tenant->fresh()), 'Tenant updated successfully.');
    }

    /**
     * Suspend a tenant.
     */
    public function suspend(Tenant $tenant): JsonResponse
    {
        $tenant->update([
            'suspended_at' => now(),
            'is_active' => false,
        ]);

        return $this->success(new TenantResource($tenant->fresh()), 'Tenant suspended successfully.');
    }

    /**
     * Remove tenant suspension.
     */
    public function unsuspend(Tenant $tenant): JsonResponse
    {
        $tenant->update([
            'suspended_at' => null,
            'is_active'    => true,
        ]);

        return $this->success(new TenantResource($tenant->fresh()), 'Tenant unsuspended successfully.');
    }

    /**
     * Permanently delete a tenant and all its data.
     */
    public function destroy(Tenant $tenant): JsonResponse
    {
        $tenant->delete();

        return $this->noContent();
    }
}
