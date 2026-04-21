<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;

class QrCodeService
{
    private string $hmacSecret;
    private int $payloadVersion;

    public function __construct()
    {
        $this->hmacSecret = config('qurbanlink.qr.hmac_secret');
        $this->payloadVersion = config('qurbanlink.qr.payload_version', 1);
    }

    /**
     * Generate QR payload and signature for a coupon.
     */
    public function generatePayload(string $tenantId, string $eventId, string $couponNumber): array
    {
        $payload = json_encode([
            'v' => $this->payloadVersion,
            't' => $tenantId,
            'e' => $eventId,
            'c' => $couponNumber,
            'n' => time(),
        ], JSON_UNESCAPED_SLASHES);

        $signature = hash_hmac('sha256', $payload, $this->hmacSecret);

        return [
            'payload' => $payload,
            'signature' => $signature,
        ];
    }

    /**
     * Verify a QR payload signature.
     */
    public function verifyPayload(string $payload, string $signature): bool
    {
        $expected = hash_hmac('sha256', $payload, $this->hmacSecret);

        return hash_equals($expected, $signature);
    }

    /**
     * Decode a QR payload.
     */
    public function decodePayload(string $payload): ?array
    {
        $data = json_decode($payload, true);

        if (! $data || ! isset($data['v'], $data['t'], $data['e'], $data['c'])) {
            return null;
        }

        return [
            'version' => $data['v'],
            'tenant_id' => $data['t'],
            'event_id' => $data['e'],
            'coupon_number' => $data['c'],
            'timestamp' => $data['n'] ?? null,
        ];
    }

    /**
     * Generate a unique, unpredictable coupon number with check digit.
     *
     * Format: {PREFIX}-{6 random chars}{1 check char}
     * Example: QRB-K7M3X9P
     *
     * Uses safe charset (no ambiguous 0/O, 1/I/L) = 32 chars.
     * 32^6 = ~1 billion possible combinations per event.
     */
    public function generateCouponNumber(string $prefix, string $eventId): string
    {
        // Safe charset: no 0/O, 1/I/L to avoid read errors on printed coupons
        $charset = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
        $charsetLen = strlen($charset);

        $maxAttempts = 100;
        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            // Generate 6 random characters
            $random = '';
            $bytes = random_bytes(6);
            for ($i = 0; $i < 6; $i++) {
                $random .= $charset[ord($bytes[$i]) % $charsetLen];
            }

            // Calculate check character (weighted sum mod charsetLen)
            $sum = 0;
            for ($i = 0; $i < 6; $i++) {
                $pos = strpos($charset, $random[$i]);
                $sum += $pos * ($i + 1);
            }
            $check = $charset[$sum % $charsetLen];

            $couponNumber = $prefix . '-' . $random . $check;

            // Ensure uniqueness within the event
            $exists = Coupon::where('event_id', $eventId)
                ->where('coupon_number', $couponNumber)
                ->exists();

            if (! $exists) {
                return $couponNumber;
            }
        }

        // Fallback: should never happen with 1B+ combinations
        throw new \RuntimeException('Failed to generate unique coupon number after ' . $maxAttempts . ' attempts.');
    }

    /**
     * Validate a coupon number's check digit.
     */
    public function validateCouponNumber(string $couponNumber): bool
    {
        // Extract the random+check part after the prefix dash
        $parts = explode('-', $couponNumber, 2);
        if (count($parts) !== 2 || strlen($parts[1]) !== 7) {
            return false;
        }

        $charset = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
        $code = strtoupper($parts[1]);
        $random = substr($code, 0, 6);
        $check = substr($code, 6, 1);

        // Verify all characters are in charset
        for ($i = 0; $i < 6; $i++) {
            if (strpos($charset, $random[$i]) === false) {
                return false;
            }
        }

        // Recalculate check character
        $sum = 0;
        for ($i = 0; $i < 6; $i++) {
            $pos = strpos($charset, $random[$i]);
            $sum += $pos * ($i + 1);
        }
        $expected = $charset[$sum % strlen($charset)];

        return $check === $expected;
    }

    /**
     * Generate coupons for recipients in an event.
     */
    public function generateCouponsForRecipients(Event $event, array $recipientIds): array
    {
        $tenant = $event->tenant;
        $prefix = $tenant->settings['coupon_prefix'] ?? config('qurbanlink.coupon.prefix', 'QRB');
        $expiresAfterDays = config('qurbanlink.coupon.expires_after_days', 30);

        $recipients = Recipient::whereIn('id', $recipientIds)
            ->where('event_id', $event->id)
            ->get();

        $coupons = [];

        foreach ($recipients as $recipient) {
            $couponNumber = $this->generateCouponNumber($prefix, $event->id);

            $qrData = $this->generatePayload($tenant->id, $event->id, $couponNumber);

            $coupon = Coupon::create([
                'tenant_id' => $tenant->id,
                'event_id' => $event->id,
                'recipient_id' => $recipient->id,
                'coupon_number' => $couponNumber,
                'qr_payload' => $qrData['payload'],
                'qr_signature' => $qrData['signature'],
                'status' => 'generated',
                'generated_at' => now(),
                'expires_at' => now()->addDays($expiresAfterDays),
            ]);

            $coupons[] = $coupon;
        }

        // Update event coupon count
        $event->increment('total_coupons', count($coupons));

        return $coupons;
    }
}
