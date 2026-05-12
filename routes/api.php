<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — /api/v1
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Public: subscription plans (pricing page — no auth required)
Route::get('/subscriptions/plans', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'plans']);


// Auth routes (no middleware)
Route::prefix('auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\Api\V1\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\V1\AuthController::class, 'login']);
    Route::post('/forgot-password', [\App\Http\Controllers\Api\V1\AuthController::class, 'forgotPassword'])
        ->middleware('throttle:10,1');
    Route::post('/reset-password', [\App\Http\Controllers\Api\V1\AuthController::class, 'resetPassword']);
    Route::get('/verify-email/{id}/{hash}', [\App\Http\Controllers\Api\V1\AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])->name('verification.verify');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [\App\Http\Controllers\Api\V1\AuthController::class, 'logout']);
        Route::get('/me', [\App\Http\Controllers\Api\V1\AuthController::class, 'me']);
        Route::put('/profile', [\App\Http\Controllers\Api\V1\AuthController::class, 'updateProfile']);
        Route::put('/password', [\App\Http\Controllers\Api\V1\AuthController::class, 'changePassword']);
        Route::post('/verify-email/resend', [\App\Http\Controllers\Api\V1\AuthController::class, 'resendVerification'])
            ->middleware('throttle:6,1');
    });
});

// Tenant-scoped routes (authenticated + tenant resolved)
Route::middleware(['auth:sanctum', 'tenant', 'check-subscription'])->group(function () {

    // Tenant profile & settings
    Route::get('/tenant/profile', [\App\Http\Controllers\Api\V1\TenantController::class, 'show'])
        ->middleware('permission:view-tenant-profile');
    Route::put('/tenant/profile', [\App\Http\Controllers\Api\V1\TenantController::class, 'update'])
        ->middleware('permission:edit-tenant-profile');
    Route::put('/tenant/settings', [\App\Http\Controllers\Api\V1\TenantController::class, 'updateSettings'])
        ->middleware('permission:edit-tenant-settings');

    // Events
    Route::apiResource('events', \App\Http\Controllers\Api\V1\EventController::class);
    Route::patch('/events/{event}/activate', [\App\Http\Controllers\Api\V1\EventController::class, 'activate'])
        ->middleware('permission:activate-events');
    Route::patch('/events/{event}/complete', [\App\Http\Controllers\Api\V1\EventController::class, 'complete'])
        ->middleware('permission:complete-events');

    // Distribution Locations (nested under event)
    Route::apiResource('events.locations', \App\Http\Controllers\Api\V1\DistributionLocationController::class)
        ->parameters(['locations' => 'location']);

    // Donors (nested under event)
    Route::apiResource('events.donors', \App\Http\Controllers\Api\V1\DonorController::class);
    Route::post('/events/{event}/donors/import', [\App\Http\Controllers\Api\V1\DonorController::class, 'import'])
        ->middleware('permission:import-donors');
    Route::patch('/events/{event}/donors/{donor}/status', [\App\Http\Controllers\Api\V1\DonorController::class, 'updateStatus']);

    // Animals (nested under event)
    Route::apiResource('events.animals', \App\Http\Controllers\Api\V1\AnimalController::class);
    Route::patch('/events/{event}/animals/{animal}/status', [\App\Http\Controllers\Api\V1\AnimalController::class, 'updateStatus'])
        ->middleware('permission:update-animal-status');

    // Recipients — specific routes MUST come before apiResource to avoid {recipient} wildcard clash
    Route::get('/recipients/template', [\App\Http\Controllers\Api\V1\RecipientController::class, 'template']);
    Route::get('/events/{event}/recipients/export', [\App\Http\Controllers\Api\V1\RecipientController::class, 'export'])
        ->middleware('permission:export-recipients');
    Route::post('/events/{event}/recipients/import', [\App\Http\Controllers\Api\V1\RecipientController::class, 'import'])
        ->middleware('permission:import-recipients');
    Route::post('/events/{event}/recipients/check-duplicates', [\App\Http\Controllers\Api\V1\RecipientController::class, 'checkDuplicates']);
    Route::apiResource('events.recipients', \App\Http\Controllers\Api\V1\RecipientController::class);

    // Coupons (nested under event)
    Route::get('/events/{event}/coupons', [\App\Http\Controllers\Api\V1\CouponController::class, 'index'])
        ->middleware('permission:view-coupons');
    Route::post('/events/{event}/coupons/generate', [\App\Http\Controllers\Api\V1\CouponController::class, 'generate'])
        ->middleware(['permission:generate-coupons', 'check-coupon-quota']);
    Route::get('/events/{event}/coupons/print', [\App\Http\Controllers\Api\V1\CouponController::class, 'print'])
        ->middleware('permission:print-coupons');
    Route::patch('/events/{event}/coupons/{coupon}/void', [\App\Http\Controllers\Api\V1\CouponController::class, 'void'])
        ->middleware('permission:void-coupons');
    Route::post('/events/{event}/coupons/{coupon}/regenerate', [\App\Http\Controllers\Api\V1\CouponController::class, 'regenerate'])
        ->middleware('permission:regenerate-coupons');

    // Scan operations
    Route::post('/events/{event}/scan', [\App\Http\Controllers\Api\V1\ScanController::class, 'scan'])
        ->middleware('permission:scan-coupons');
    Route::post('/events/{event}/scan/manual', [\App\Http\Controllers\Api\V1\ScanController::class, 'manualScan'])
        ->middleware('permission:manual-scan');
    Route::get('/events/{event}/scans', [\App\Http\Controllers\Api\V1\ScanController::class, 'index'])
        ->middleware('permission:view-scan-history');
    Route::post('/events/{event}/scans/sync', [\App\Http\Controllers\Api\V1\ScanController::class, 'sync'])
        ->middleware('permission:sync-offline-scans');

    // Dashboard & Reports
    Route::get('/events/{event}/dashboard/stats', [\App\Http\Controllers\Api\V1\DashboardController::class, 'stats'])
        ->middleware('permission:view-dashboard');
    Route::get('/events/{event}/dashboard/live-feed', [\App\Http\Controllers\Api\V1\DashboardController::class, 'liveFeed'])
        ->middleware('permission:view-live-dashboard');
    Route::get('/events/{event}/reports/distribution', [\App\Http\Controllers\Api\V1\ReportController::class, 'distribution'])
        ->middleware('permission:view-reports');
    Route::get('/events/{event}/reports/unclaimed', [\App\Http\Controllers\Api\V1\ReportController::class, 'unclaimed'])
        ->middleware('permission:view-reports');
    Route::get('/events/{event}/reports/per-animal', [\App\Http\Controllers\Api\V1\ReportController::class, 'perAnimal'])
        ->middleware('permission:view-reports');
    Route::get('/events/{event}/reports/export', [\App\Http\Controllers\Api\V1\ReportController::class, 'export'])
        ->middleware('permission:export-reports');

    // User management
    Route::apiResource('users', \App\Http\Controllers\Api\V1\UserController::class)
        ->middleware('permission:manage-tenant-users');
    Route::patch('/users/{user}/role', [\App\Http\Controllers\Api\V1\UserController::class, 'assignRole'])
        ->middleware('permission:assign-roles');

    // Subscription & Payments
    Route::get('/subscriptions/current', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'current']);
    Route::post('/subscriptions/subscribe', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'subscribe']);
    Route::post('/subscriptions/topup-coupon', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'couponTopup']);
    Route::get('/subscriptions/payments', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'payments']);
    Route::get('/subscriptions/payment-status', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'paymentStatus']);
    Route::post('/subscriptions/payments/{payment}/resume', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'resumePayment']);
    Route::post('/subscriptions/payments/{payment}/cancel', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'cancelPayment']);
    Route::post('/subscriptions/sync', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'syncSubscription']);
    Route::get('/subscriptions/payments/{payment}', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'paymentDetail']);
});

// Public live dashboard (no auth, tenant resolved from slug)
Route::middleware('public-tenant')->group(function () {
    Route::get('/live/{tenantSlug}/{eventSlug}', [\App\Http\Controllers\Api\V1\PublicDashboardController::class, 'show']);
    Route::get('/live/{tenantSlug}/{eventSlug}/feed', [\App\Http\Controllers\Api\V1\PublicDashboardController::class, 'feed']);
});

// Super admin routes
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\V1\Admin\AdminDashboardController::class, 'index']);
    Route::apiResource('tenants', \App\Http\Controllers\Api\V1\Admin\AdminTenantController::class)->only(['index', 'show', 'update']);
    Route::patch('/tenants/{tenant}/suspend', [\App\Http\Controllers\Api\V1\Admin\AdminTenantController::class, 'suspend']);
    Route::patch('/tenants/{tenant}/unsuspend', [\App\Http\Controllers\Api\V1\Admin\AdminTenantController::class, 'unsuspend']);
    Route::get('/audit-logs', [\App\Http\Controllers\Api\V1\Admin\AdminAuditController::class, 'index']);
    // Error monitoring
    Route::get('/error-logs',                   [\App\Http\Controllers\Api\V1\Admin\AdminErrorLogController::class, 'index']);
    Route::get('/error-logs/stats',             [\App\Http\Controllers\Api\V1\Admin\AdminErrorLogController::class, 'stats']);
    Route::delete('/error-logs/clear',          [\App\Http\Controllers\Api\V1\Admin\AdminErrorLogController::class, 'clear']);
    Route::delete('/error-logs/{errorLog}',     [\App\Http\Controllers\Api\V1\Admin\AdminErrorLogController::class, 'destroy']);
    Route::apiResource('plans', \App\Http\Controllers\Api\V1\Admin\AdminPlanController::class);
    Route::get('/payments', [\App\Http\Controllers\Api\V1\Admin\AdminPaymentController::class, 'index']);
    Route::post('/payments/{payment}/activate', [\App\Http\Controllers\Api\V1\Admin\AdminPaymentController::class, 'manualActivation']);
    // Role & Permission management
    Route::get('/roles', [\App\Http\Controllers\Api\V1\Admin\AdminRoleController::class, 'roles']);
    Route::get('/permissions', [\App\Http\Controllers\Api\V1\Admin\AdminRoleController::class, 'permissions']);
    Route::post('/roles', [\App\Http\Controllers\Api\V1\Admin\AdminRoleController::class, 'createRole']);
    Route::put('/roles/{role}/permissions', [\App\Http\Controllers\Api\V1\Admin\AdminRoleController::class, 'updateRolePermissions']);
    Route::delete('/roles/{role}', [\App\Http\Controllers\Api\V1\Admin\AdminRoleController::class, 'deleteRole']);
});

// Midtrans payment notification webhook (no auth, signature verified in controller)
Route::post('/webhooks/midtrans', [\App\Http\Controllers\Api\V1\SubscriptionController::class, 'notification']);

// Moota webhook
Route::post('/webhooks/moota', [\App\Http\Controllers\Webhook\MootaWebhookController::class, 'handle']);
