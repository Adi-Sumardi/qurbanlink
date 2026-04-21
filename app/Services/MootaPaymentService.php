<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Str;

class MootaPaymentService
{
    /**
     * Generate a unique amount by adding random digits to prevent collision.
     * E.g., Rp99.000 → Rp99.127 (adds random 3-digit suffix)
     */
    public function generateUniqueAmount(float $baseAmount): float
    {
        $suffix = random_int(1, 999);

        $uniqueAmount = $baseAmount + $suffix;

        // Ensure uniqueness against pending payments
        $exists = Payment::where('amount', $uniqueAmount)
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return $this->generateUniqueAmount($baseAmount);
        }

        return $uniqueAmount;
    }

    /**
     * Generate invoice number.
     */
    public function generateInvoiceNumber(): string
    {
        return 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }

    /**
     * Verify Moota webhook signature.
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $secret = config('qurbanlink.subscription.moota.webhook_secret');

        if (! $secret) {
            return false;
        }

        $expected = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }

    /**
     * Match incoming mutation to a pending payment.
     */
    public function matchPayment(float $amount, ?string $mutationId = null): ?Payment
    {
        return Payment::where('status', 'pending')
            ->where('amount', $amount)
            ->where('expired_at', '>', now())
            ->orderBy('created_at', 'asc')
            ->first();
    }
}
