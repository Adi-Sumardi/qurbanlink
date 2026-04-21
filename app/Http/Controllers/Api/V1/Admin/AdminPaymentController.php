<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class AdminPaymentController extends Controller
{
    /**
     * Manually activate a payment and its related subscription.
     */
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
