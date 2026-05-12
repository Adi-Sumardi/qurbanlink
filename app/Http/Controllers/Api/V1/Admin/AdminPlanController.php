<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminPlanController extends Controller
{
    /**
     * List all plans (including inactive).
     */
    public function index(): JsonResponse
    {
        $plans = Plan::ordered()->get();

        return $this->success($plans, 'Plans retrieved successfully.');
    }

    /**
     * Create a new plan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                     => ['required', 'string', 'max:100'],
            'slug'                     => ['required', 'string', 'max:50', 'regex:/^[a-z0-9-]+$/', 'unique:plans,slug'],
            'price_monthly'            => ['required', 'integer', 'min:0'],
            'price_yearly'             => ['required', 'integer', 'min:0'],
            'coupon_quota'             => ['required', 'integer', 'min:0'],
            'max_events_per_year'      => ['nullable', 'integer', 'min:1'],
            'max_users'                => ['nullable', 'integer', 'min:1'],
            'max_recipients_per_event' => ['nullable', 'integer', 'min:1'],
            'features'                 => ['required', 'array'],
            'features.*'               => ['boolean'],
            'is_active'                => ['boolean'],
            'sort_order'               => ['integer', 'min:0'],
        ]);

        $plan = Plan::create($validated);

        return $this->success($plan, 'Plan created successfully.', 201);
    }

    /**
     * Show a single plan.
     */
    public function show(Plan $plan): JsonResponse
    {
        return $this->success($plan, 'Plan retrieved successfully.');
    }

    /**
     * Update an existing plan.
     */
    public function update(Request $request, Plan $plan): JsonResponse
    {
        $validated = $request->validate([
            'name'                     => ['sometimes', 'string', 'max:100'],
            'price_monthly'            => ['sometimes', 'integer', 'min:0'],
            'price_yearly'             => ['sometimes', 'integer', 'min:0'],
            'coupon_quota'             => ['sometimes', 'integer', 'min:0'],
            'max_events_per_year'      => ['nullable', 'integer', 'min:1'],
            'max_users'                => ['nullable', 'integer', 'min:1'],
            'max_recipients_per_event' => ['nullable', 'integer', 'min:1'],
            'features'                 => ['sometimes', 'array'],
            'features.*'               => ['boolean'],
            'is_active'                => ['sometimes', 'boolean'],
            'sort_order'               => ['sometimes', 'integer', 'min:0'],
        ]);

        $plan->update($validated);

        return $this->success($plan->fresh(), 'Plan updated successfully.');
    }

    /**
     * Delete a plan (force). Active subscriptions are migrated to the free plan.
     */
    public function destroy(Plan $plan): JsonResponse
    {
        // Migrate any subscriptions still using this plan to "free"
        $migrated = \App\Models\Subscription::where('plan', $plan->slug)
            ->whereIn('status', ['active', 'grace'])
            ->update(['plan' => 'free', 'status' => 'active']);

        if ($migrated > 0) {
            \Illuminate\Support\Facades\Log::info("Force-deleted plan '{$plan->slug}': migrated {$migrated} subscription(s) to free.");
        }

        $plan->delete();

        return $this->success(null, "Paket '{$plan->name}' berhasil dihapus" . ($migrated > 0 ? " ({$migrated} tenant dipindahkan ke paket Free)." : '.'));
    }
}
