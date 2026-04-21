<?php

namespace Tests\Unit\Actions;

use App\Actions\Scan\ProcessScanAction;
use App\Enums\CouponStatus;
use App\Enums\ScanMethod;
use App\Enums\ScanResult;
use App\Events\CouponScanned;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use App\Scopes\TenantScope;
use App\Services\QrCodeService;
use Illuminate\Support\Facades\Event as EventFacade;
use Tests\TestCase;

class ProcessScanActionTest extends TestCase
{
    private ProcessScanAction $action;
    private QrCodeService $qrCodeService;
    private Event $event;

    protected function setUp(): void
    {
        parent::setUp();

        config(['qurbanlink.qr.hmac_secret' => 'test-secret-key']);
        config(['qurbanlink.qr.payload_version' => 1]);

        $this->setupTenant();
        TenantScope::setTenant($this->tenant);

        $this->qrCodeService = new QrCodeService();
        $this->action = new ProcessScanAction($this->qrCodeService);

        $this->event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'total_coupons' => 1,
            'distributed' => 0,
        ]);
    }

    protected function tearDown(): void
    {
        TenantScope::removeTenant();
        parent::tearDown();
    }

    private function createCouponWithQr(
        CouponStatus $status = CouponStatus::Generated,
        ?string $couponNumber = null
    ): Coupon {
        $couponNumber = $couponNumber ?? 'QRB-000001';

        $qrData = $this->qrCodeService->generatePayload(
            $this->tenant->id,
            $this->event->id,
            $couponNumber
        );

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        return Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
            'recipient_id' => $recipient->id,
            'coupon_number' => $couponNumber,
            'qr_payload' => $qrData['payload'],
            'qr_signature' => $qrData['signature'],
            'status' => $status,
            'expires_at' => now()->addDays(30),
        ]);
    }

    public function test_qr_scan_success_claims_coupon_and_increments_distributed(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr();

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        $this->assertEquals(ScanResult::Success, $result['result']);

        $coupon->refresh();
        $this->assertEquals(CouponStatus::Claimed, $coupon->status);
        $this->assertNotNull($coupon->claimed_at);

        $this->event->refresh();
        $this->assertEquals(1, $this->event->distributed);
    }

    public function test_qr_scan_already_claimed_coupon(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr(CouponStatus::Claimed);

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        $this->assertEquals(ScanResult::AlreadyClaimed, $result['result']);

        $this->event->refresh();
        $this->assertEquals(0, $this->event->distributed);
    }

    public function test_qr_scan_voided_coupon(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr(CouponStatus::Voided);

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        $this->assertEquals(ScanResult::Voided, $result['result']);

        $this->event->refresh();
        $this->assertEquals(0, $this->event->distributed);
    }

    public function test_qr_scan_expired_coupon(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr(CouponStatus::Expired);

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        $this->assertEquals(ScanResult::Expired, $result['result']);

        $this->event->refresh();
        $this->assertEquals(0, $this->event->distributed);
    }

    public function test_qr_scan_invalid_payload(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => 'completely-invalid-payload',
        ]);

        $this->assertEquals(ScanResult::Invalid, $result['result']);
    }

    public function test_manual_scan_success(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr(CouponStatus::Generated, 'QRB-000010');

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'manual',
            'coupon_number' => 'QRB-000010',
        ]);

        $this->assertEquals(ScanResult::Success, $result['result']);

        $coupon->refresh();
        $this->assertEquals(CouponStatus::Claimed, $coupon->status);

        $this->event->refresh();
        $this->assertEquals(1, $this->event->distributed);
    }

    public function test_manual_scan_invalid_coupon_number(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'manual',
            'coupon_number' => 'NONEXISTENT-000001',
        ]);

        $this->assertEquals(ScanResult::Invalid, $result['result']);
    }

    public function test_creates_scan_record_in_database(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr();

        $result = $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        $this->assertArrayHasKey('scan', $result);
        $this->assertInstanceOf(Scan::class, $result['scan']);

        $this->assertDatabaseHas('scans', [
            'event_id' => $this->event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
            'scan_method' => ScanMethod::Qr->value,
            'scan_result' => ScanResult::Success->value,
        ]);
    }

    public function test_broadcasts_coupon_scanned_event(): void
    {
        EventFacade::fake([CouponScanned::class]);

        $coupon = $this->createCouponWithQr();

        $this->action->execute($this->event, $this->user, [
            'method' => 'qr',
            'qr_payload' => $coupon->qr_payload,
        ]);

        EventFacade::assertDispatched(CouponScanned::class);
    }
}
