<?php

namespace Tests\Unit\Services;

use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Scopes\TenantScope;
use App\Services\QrCodeService;
use Tests\TestCase;

class QrCodeServiceTest extends TestCase
{
    private QrCodeService $service;

    protected function setUp(): void
    {
        parent::setUp();

        config(['qurbanlink.qr.hmac_secret' => 'test-secret-key']);
        config(['qurbanlink.qr.payload_version' => 1]);
        config(['qurbanlink.coupon.prefix' => 'QRB']);
        config(['qurbanlink.coupon.number_length' => 6]);
        config(['qurbanlink.coupon.expires_after_days' => 30]);

        $this->service = new QrCodeService();
    }

    public function test_generate_payload_returns_payload_and_signature(): void
    {
        $result = $this->service->generatePayload('tenant-123', 'event-456', 'QRB-000001');

        $this->assertArrayHasKey('payload', $result);
        $this->assertArrayHasKey('signature', $result);
        $this->assertIsString($result['payload']);
        $this->assertIsString($result['signature']);
    }

    public function test_verify_payload_returns_true_for_valid_signature(): void
    {
        $result = $this->service->generatePayload('tenant-123', 'event-456', 'QRB-000001');

        $isValid = $this->service->verifyPayload($result['payload'], $result['signature']);

        $this->assertTrue($isValid);
    }

    public function test_verify_payload_returns_false_for_tampered_payload(): void
    {
        $result = $this->service->generatePayload('tenant-123', 'event-456', 'QRB-000001');

        $tamperedPayload = str_replace('tenant-123', 'tenant-999', $result['payload']);
        $isValid = $this->service->verifyPayload($tamperedPayload, $result['signature']);

        $this->assertFalse($isValid);
    }

    public function test_verify_payload_returns_false_for_tampered_signature(): void
    {
        $result = $this->service->generatePayload('tenant-123', 'event-456', 'QRB-000001');

        $isValid = $this->service->verifyPayload($result['payload'], 'invalid-signature');

        $this->assertFalse($isValid);
    }

    public function test_decode_payload_returns_decoded_data_for_valid_json(): void
    {
        $result = $this->service->generatePayload('tenant-123', 'event-456', 'QRB-000001');

        $decoded = $this->service->decodePayload($result['payload']);

        $this->assertIsArray($decoded);
        $this->assertEquals(1, $decoded['version']);
        $this->assertEquals('tenant-123', $decoded['tenant_id']);
        $this->assertEquals('event-456', $decoded['event_id']);
        $this->assertEquals('QRB-000001', $decoded['coupon_number']);
        $this->assertArrayHasKey('timestamp', $decoded);
    }

    public function test_decode_payload_returns_null_for_invalid_json(): void
    {
        $decoded = $this->service->decodePayload('not-valid-json');

        $this->assertNull($decoded);
    }

    public function test_decode_payload_returns_null_for_missing_fields(): void
    {
        $incompletePayload = json_encode(['v' => 1, 't' => 'tenant-123']);

        $decoded = $this->service->decodePayload($incompletePayload);

        $this->assertNull($decoded);
    }

    public function test_generate_coupons_for_recipients_creates_correct_count(): void
    {
        $this->setupTenant();
        TenantScope::setTenant($this->tenant);

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'total_coupons' => 0,
        ]);

        $recipient1 = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'portions' => 2,
        ]);

        $recipient2 = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'portions' => 3,
        ]);

        $coupons = $this->service->generateCouponsForRecipients(
            $event,
            [$recipient1->id, $recipient2->id]
        );

        // 1 coupon per recipient regardless of portions
        $this->assertCount(2, $coupons);

        // Verify coupons exist in DB
        $this->assertEquals(2, Coupon::where('event_id', $event->id)->count());

        TenantScope::removeTenant();
    }

    public function test_generate_coupons_for_recipients_increments_total_coupons(): void
    {
        $this->setupTenant();
        TenantScope::setTenant($this->tenant);

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'total_coupons' => 0,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'portions' => 3,
        ]);

        $this->service->generateCouponsForRecipients($event, [$recipient->id]);

        $event->refresh();
        // 1 coupon per recipient regardless of portions
        $this->assertEquals(1, $event->total_coupons);

        TenantScope::removeTenant();
    }
}
