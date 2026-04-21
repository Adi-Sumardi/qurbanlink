<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\CouponStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScanResource;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;

class PublicDashboardController extends Controller
{
    /**
     * Return public event stats.
     * The tenant is already resolved by public-tenant middleware.
     */
    public function show(string $tenantSlug, string $eventSlug): JsonResponse
    {
        $tenant = Tenant::where('slug', $tenantSlug)->firstOrFail();
        $event = Event::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->where('slug', $eventSlug)
            ->firstOrFail();

        $totalCoupons = $event->coupons()->count();
        $distributed = $event->coupons()->where('status', CouponStatus::Claimed)->count();
        $unclaimed = $totalCoupons - $distributed;
        $percentage = $totalCoupons > 0 ? round(($distributed / $totalCoupons) * 100, 2) : 0;

        // Per-category breakdown with distributed counts
        $byCategory = [];
        $recipients = $event->recipients()
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->get();

        foreach ($recipients as $row) {
            $categoryDistributed = $event->coupons()
                ->where('status', CouponStatus::Claimed)
                ->whereHas('recipient', fn ($q) => $q->where('category', $row->category))
                ->count();

            $byCategory[$row->category] = [
                'total' => (int) $row->total,
                'distributed' => $categoryDistributed,
            ];
        }

        return $this->success([
            'event_name' => $event->name,
            'event_date' => $event->event_date,
            'tenant_name' => $tenant->name,
            'stats' => [
                'total_coupons' => $totalCoupons,
                'total_distributed' => $distributed,
                'total_unclaimed' => $unclaimed,
                'distribution_percentage' => $percentage,
                'by_category' => $byCategory,
            ],
        ], 'Public dashboard stats retrieved successfully.');
    }

    /**
     * Return recent 10 scans for live feed.
     */
    public function feed(string $tenantSlug, string $eventSlug): JsonResponse
    {
        $tenant = Tenant::where('slug', $tenantSlug)->firstOrFail();
        $event = Event::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->where('slug', $eventSlug)
            ->firstOrFail();

        $scans = $event->scans()
            ->with(['coupon.recipient'])
            ->orderBy('scanned_at', 'desc')
            ->limit(10)
            ->get();

        return $this->success(ScanResource::collection($scans), 'Public live feed retrieved successfully.');
    }
}
