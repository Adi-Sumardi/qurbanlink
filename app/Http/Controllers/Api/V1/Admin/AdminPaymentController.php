<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::with(['tenant', 'subscription'])
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => PaymentResource::collection($payments),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'last_page'    => $payments->lastPage(),
                'per_page'     => $payments->perPage(),
                'total'        => $payments->total(),
            ],
        ]);
    }

    public function manualActivation(Payment $payment): JsonResponse
    {
        $payment->update([
            'status' => PaymentStatus::Paid,
            'paid_at' => now(),
        ]);

        $subscription = $payment->subscription;
        if ($subscription) {
            $subscription->update([
                'status' => SubscriptionStatus::Active,
                'starts_at' => now(),
            ]);
        }

        return $this->success(new PaymentResource($payment->fresh()->load('subscription')), 'Payment manually activated successfully.');
    }
}
