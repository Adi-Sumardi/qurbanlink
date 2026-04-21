<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\CouponStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnimalResource;
use App\Http\Resources\CouponResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Return distribution stats grouped by category with summary.
     */
    public function distribution(Event $event): JsonResponse
    {
        $totalRecipients = $event->recipients()->count();
        $totalCoupons = $event->coupons()->count();
        $totalClaimed = $event->coupons()->where('status', CouponStatus::Claimed)->count();
        $totalUnclaimed = $totalCoupons - $totalClaimed;
        $totalPortions = (int) $event->recipients()->sum('portions');

        // Per-category breakdown
        $recipientStats = $event->recipients()
            ->selectRaw('category, count(*) as total_recipients, sum(portions) as total_portions')
            ->groupBy('category')
            ->get();

        $categories = [];
        foreach ($recipientStats as $row) {
            $claimed = $event->coupons()
                ->where('status', CouponStatus::Claimed)
                ->whereHas('recipient', fn ($q) => $q->where('category', $row->category))
                ->count();
            $total = $event->coupons()
                ->whereHas('recipient', fn ($q) => $q->where('category', $row->category))
                ->count();

            $categories[] = [
                'category' => $row->category,
                'total_recipients' => (int) $row->total_recipients,
                'total_portions' => (int) $row->total_portions,
                'total_coupons' => $total,
                'claimed' => $claimed,
                'unclaimed' => $total - $claimed,
                'percentage' => $total > 0 ? round(($claimed / $total) * 100, 1) : 0,
            ];
        }

        // Hourly distribution for chart
        $hourly = $event->scans()
            ->where('scan_result', 'success')
            ->selectRaw("to_char(scanned_at, 'HH24:00') as hour, count(*) as count")
            ->groupByRaw("to_char(scanned_at, 'HH24:00')")
            ->orderByRaw("to_char(scanned_at, 'HH24:00')")
            ->get()
            ->map(fn ($row) => ['hour' => $row->hour, 'count' => (int) $row->count])
            ->toArray();

        return $this->success([
            'summary' => [
                'total_recipients' => $totalRecipients,
                'total_portions' => $totalPortions,
                'total_coupons' => $totalCoupons,
                'total_claimed' => $totalClaimed,
                'total_unclaimed' => $totalUnclaimed,
                'percentage' => $totalCoupons > 0 ? round(($totalClaimed / $totalCoupons) * 100, 1) : 0,
            ],
            'categories' => $categories,
            'hourly_distribution' => $hourly,
        ], 'Distribution report retrieved successfully.');
    }

    /**
     * Return list of coupons with status 'generated' (not yet claimed).
     */
    public function unclaimed(Event $event): JsonResponse
    {
        $unclaimed = $event->coupons()
            ->where('status', CouponStatus::Generated)
            ->with('recipient')
            ->orderBy('coupon_number')
            ->get();

        return $this->success(CouponResource::collection($unclaimed), 'Unclaimed coupons retrieved successfully.');
    }

    /**
     * Return animals with donor and portion counts.
     */
    public function perAnimal(Event $event): JsonResponse
    {
        $animals = $event->animals()
            ->with('donor')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(AnimalResource::collection($animals), 'Per-animal report retrieved successfully.');
    }

    /**
     * Export report as PDF/Excel (placeholder).
     */
    public function export(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'format' => ['nullable', 'string', 'in:pdf,xlsx,csv'],
            'type' => ['nullable', 'string', 'in:distribution,unclaimed,per_animal'],
        ]);

        // TODO: Implement actual PDF/Excel export logic
        return $this->success(null, 'Report export initiated successfully.');
    }
}
