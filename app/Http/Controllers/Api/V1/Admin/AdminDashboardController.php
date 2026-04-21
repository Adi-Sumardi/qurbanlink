<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
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
        $totalTenants = Tenant::count();
        $totalUsers = User::count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $revenue = Payment::where('status', 'paid')->sum('amount');

        return $this->success([
            'total_tenants' => $totalTenants,
            'total_users' => $totalUsers,
            'active_subscriptions' => $activeSubscriptions,
            'revenue' => $revenue,
        ], 'Admin dashboard stats retrieved successfully.');
    }
}
