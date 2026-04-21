<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TenantResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    /**
     * Return current tenant profile.
     */
    public function show(Request $request): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;

        return $this->success(new TenantResource($tenant), 'Tenant profile retrieved successfully.');
    }

    /**
     * Update tenant profile.
     */
    public function update(Request $request): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'address' => ['sometimes', 'string', 'max:500'],
            'city' => ['sometimes', 'string', 'max:100'],
            'province' => ['sometimes', 'string', 'max:100'],
            'logo_path' => ['sometimes', 'string', 'max:500'],
        ]);

        $tenant->update($validated);

        return $this->success(new TenantResource($tenant->fresh()), 'Tenant profile updated successfully.');
    }

    /**
     * Update tenant settings (JSONB merge).
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $tenant = app()->has('current_tenant') ? app('current_tenant') : $request->user()->tenant;

        $validated = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        $currentSettings = $tenant->settings ?? [];
        $mergedSettings = array_merge($currentSettings, $validated['settings']);
        $tenant->update(['settings' => $mergedSettings]);

        return $this->success(new TenantResource($tenant->fresh()), 'Tenant settings updated successfully.');
    }
}
