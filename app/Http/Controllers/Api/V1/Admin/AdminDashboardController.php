<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TenantResource;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Return platform-wide stats.
     */
    public function index(): JsonResponse
    {
        $totalTenants        = Tenant::count();
        $totalUsers          = User::count();
        $totalEvents         = Event::count();
        $activeEvents        = Event::where('status', 'active')->count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $revenue             = Payment::where('status', 'paid')->sum('amount');

        // Breakdown tenant per subscription plan
        $subscriptionBreakdown = Subscription::query()
            ->selectRaw('plan, count(*) as total')
            ->where('status', 'active')
            ->groupBy('plan')
            ->pluck('total', 'plan')
            ->toArray();

        // 5 tenant terbaru
        $recentRegistrations = Tenant::latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'city', 'is_active', 'created_at']);

        // 6 pembayaran terbaru
        $recentPayments = Payment::with('subscription.tenant')
            ->latest()
            ->limit(6)
            ->get(['id', 'subscription_id', 'invoice_number', 'amount', 'status', 'payment_method', 'created_at']);

        return $this->success([
            'total_tenants'          => $totalTenants,
            'total_users'            => $totalUsers,
            'total_events'           => $totalEvents,
            'active_events'          => $activeEvents,
            'active_subscriptions'   => $activeSubscriptions,
            'total_revenue'          => (float) $revenue,
            'subscription_breakdown' => $subscriptionBreakdown,
            'recent_registrations'   => $recentRegistrations,
            'recent_payments'        => $recentPayments,
        ], 'Admin dashboard stats retrieved successfully.');
    }
}
