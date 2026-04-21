<?php

namespace App\Services;

use App\Enums\CouponStatus;
use App\Enums\ScanResult;
use App\Models\Animal;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getEventStats(Event $event): array
    {
        $totalCoupons = Coupon::where('event_id', $event->id)->count();
        $distributed = Coupon::where('event_id', $event->id)
            ->where('status', CouponStatus::Claimed)
            ->count();
        $remaining = $totalCoupons - $distributed;
        $percentage = $totalCoupons > 0 ? round(($distributed / $totalCoupons) * 100, 1) : 0;

        return [
            'total_coupons' => $totalCoupons,
            'distributed' => $distributed,
            'remaining' => $remaining,
            'percentage' => $percentage,
            'total_recipients' => Recipient::where('event_id', $event->id)->count(),
            'total_animals' => Animal::where('event_id', $event->id)->count(),
            'by_category' => $this->getStatsByCategory($event),
            'by_status' => $this->getStatsByStatus($event),
            'by_hour' => $this->getStatsByHour($event),
        ];
    }

    private function getStatsByCategory(Event $event): array
    {
        return Recipient::where('event_id', $event->id)
            ->select('category', DB::raw('COUNT(*) as total_recipients'), DB::raw('SUM(portions) as total_portions'))
            ->groupBy('category')
            ->get()
            ->map(function ($row) use ($event) {
                $claimed = Coupon::where('event_id', $event->id)
                    ->where('status', CouponStatus::Claimed)
                    ->whereHas('recipient', fn ($q) => $q->where('category', $row->category))
                    ->count();

                return [
                    'category' => $row->category,
                    'total_recipients' => $row->total_recipients,
                    'total_portions' => $row->total_portions,
                    'distributed' => $claimed,
                ];
            })
            ->toArray();
    }

    private function getStatsByStatus(Event $event): array
    {
        return Coupon::where('event_id', $event->id)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    private function getStatsByHour(Event $event): array
    {
        return Scan::where('event_id', $event->id)
            ->where('scan_result', ScanResult::Success)
            ->select(DB::raw("EXTRACT(HOUR FROM scanned_at) as hour"), DB::raw('COUNT(*) as count'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('count', 'hour')
            ->toArray();
    }
}
