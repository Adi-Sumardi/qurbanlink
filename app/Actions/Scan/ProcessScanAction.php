<?php

namespace App\Actions\Scan;

use App\Enums\CouponStatus;
use App\Enums\ScanMethod;
use App\Enums\ScanResult;
use App\Events\CouponScanned;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Scan;
use App\Models\User;
use App\Services\QrCodeService;

class ProcessScanAction
{
    public function __construct(
        private QrCodeService $qrCodeService,
    ) {}

    /**
     * Process a QR code scan.
     */
    public function execute(Event $event, User $scanner, array $data): array
    {
        $method = ScanMethod::from($data['method'] ?? 'qr');

        // Find coupon by QR payload or manual coupon number
        if ($method === ScanMethod::Qr) {
            return $this->processQrScan($event, $scanner, $data);
        }

        return $this->processManualScan($event, $scanner, $data);
    }

    private function processQrScan(Event $event, User $scanner, array $data): array
    {
        $payload = $data['qr_payload'];
        $decoded = $this->qrCodeService->decodePayload($payload);

        if (! $decoded) {
            return $this->recordScan($event, $scanner, null, ScanMethod::Qr, ScanResult::Invalid, $data);
        }

        // Find coupon by signature from the payload
        $coupon = Coupon::where('event_id', $event->id)
            ->where('coupon_number', $decoded['coupon_number'])
            ->first();

        if (! $coupon) {
            return $this->recordScan($event, $scanner, null, ScanMethod::Qr, ScanResult::Invalid, $data);
        }

        // Verify HMAC signature
        if (! $this->qrCodeService->verifyPayload($payload, $coupon->qr_signature)) {
            return $this->recordScan($event, $scanner, $coupon, ScanMethod::Qr, ScanResult::Invalid, $data);
        }

        return $this->validateAndRecord($event, $scanner, $coupon, ScanMethod::Qr, $data);
    }

    private function processManualScan(Event $event, User $scanner, array $data): array
    {
        // Validate check digit before hitting the database
        if (! $this->qrCodeService->validateCouponNumber($data['coupon_number'])) {
            return $this->recordScan($event, $scanner, null, ScanMethod::Manual, ScanResult::Invalid, $data);
        }

        $coupon = Coupon::where('event_id', $event->id)
            ->where('coupon_number', strtoupper($data['coupon_number']))
            ->first();

        if (! $coupon) {
            return $this->recordScan($event, $scanner, null, ScanMethod::Manual, ScanResult::Invalid, $data);
        }

        return $this->validateAndRecord($event, $scanner, $coupon, ScanMethod::Manual, $data);
    }

    private function validateAndRecord(Event $event, User $scanner, Coupon $coupon, ScanMethod $method, array $data): array
    {
        // Check coupon status
        $result = match ($coupon->status) {
            CouponStatus::Claimed => ScanResult::AlreadyClaimed,
            CouponStatus::Voided => ScanResult::Voided,
            CouponStatus::Expired => ScanResult::Expired,
            CouponStatus::Generated => ScanResult::Success,
        };

        // Check expiry
        if ($result === ScanResult::Success && $coupon->expires_at && $coupon->expires_at->isPast()) {
            $coupon->update(['status' => CouponStatus::Expired]);
            $result = ScanResult::Expired;
        }

        // If success, mark coupon as claimed
        if ($result === ScanResult::Success) {
            $coupon->update([
                'status' => CouponStatus::Claimed,
                'claimed_at' => now(),
            ]);
            $event->increment('distributed');
        }

        return $this->recordScan($event, $scanner, $coupon, $method, $result, $data);
    }

    private function recordScan(Event $event, User $scanner, ?Coupon $coupon, ScanMethod $method, ScanResult $result, array $data): array
    {
        $scan = Scan::create([
            'tenant_id' => $event->tenant_id,
            'event_id' => $event->id,
            'coupon_id' => $coupon?->id,
            'location_id' => $data['location_id'] ?? null,
            'scanned_by' => $scanner->id,
            'scan_method' => $method,
            'scan_result' => $result,
            'device_info' => $data['device_info'] ?? null,
            'ip_address' => request()->ip(),
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'scanned_at' => now(),
        ]);

        // Load relations for response
        $scan->load(['coupon.recipient', 'scanner', 'location']);

        // Broadcast to live dashboard
        if ($coupon) {
            broadcast(new CouponScanned($scan))->toOthers();
        }

        return [
            'scan' => $scan,
            'result' => $result,
            'recipient' => $coupon?->recipient,
        ];
    }
}
