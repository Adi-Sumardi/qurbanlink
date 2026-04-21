<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\CouponStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScanResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return basic event stats.
     */
    public function stats(Event $event): JsonResponse
    {
        $totalRecipients = $event->recipients()->count();
        $totalCoupons = $event->coupons()->count();
        $totalDistributed = $event->coupons()->where('status', CouponStatus::Claimed)->count();
        $totalUnclaimed = $totalCoupons - $totalDistributed;
        $distributionPercentage = $totalCoupons > 0 ? round(($totalDistributed / $totalCoupons) * 100, 2) : 0;

        // by_category: { category: { total, distributed } }
        $byCategory = [];
        $recipientsByCategory = $event->recipients()
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        foreach ($recipientsByCategory as $category => $total) {
            $distributed = $event->coupons()
                ->where('status', CouponStatus::Claimed)
                ->whereHas('recipient', fn ($q) => $q->where('category', $category))
                ->count();
            $byCategory[$category ?: 'umum'] = [
                'total' => (int) $total,
                'distributed' => $distributed,
            ];
        }

        // by_status: { status: count }
        $byStatus = $event->coupons()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // hourly_distribution: [{ hour, count }]
        $hourlyDistribution = $event->scans()
            ->selectRaw("to_char(scanned_at, 'HH24:00') as hour, count(*) as count")
            ->groupByRaw("to_char(scanned_at, 'HH24:00')")
            ->orderByRaw("to_char(scanned_at, 'HH24:00')")
            ->get()
            ->map(fn ($row) => ['hour' => $row->hour, 'count' => (int) $row->count])
            ->toArray();

        return $this->success([
            'total_recipients' => $totalRecipients,
            'total_coupons' => $totalCoupons,
            'total_distributed' => $totalDistributed,
            'total_unclaimed' => $totalUnclaimed,
            'distribution_percentage' => $distributionPercentage,
            'by_category' => (object) $byCategory,
            'by_status' => (object) $byStatus,
            'hourly_distribution' => $hourlyDistribution,
        ], 'Dashboard stats retrieved successfully.');
    }

    /**
     * Return recent 20 scans for live feed.
     */
    public function liveFeed(Event $event): JsonResponse
    {
        $scans = $event->scans()
            ->with(['coupon.recipient'])
            ->orderBy('scanned_at', 'desc')
            ->limit(20)
            ->get();

        return $this->success(ScanResource::collection($scans), 'Live feed retrieved successfully.');
    }
}
