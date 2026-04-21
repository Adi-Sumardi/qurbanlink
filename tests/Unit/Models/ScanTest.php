<?php

namespace Tests\Unit\Models;

use App\Enums\ScanMethod;
use App\Enums\ScanResult;
use App\Models\Coupon;
use App\Models\DistributionLocation;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use App\Models\User;
use App\Scopes\TenantScope;
use Tests\TestCase;

class ScanTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->setupTenant();
        TenantScope::setTenant($this->tenant);
    }

    protected function tearDown(): void
    {
        TenantScope::removeTenant();
        parent::tearDown();
    }

    public function test_belongs_to_event(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $this->assertInstanceOf(Event::class, $scan->event);
        $this->assertEquals($event->id, $scan->event->id);
    }

    public function test_belongs_to_coupon(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $this->assertInstanceOf(Coupon::class, $scan->coupon);
        $this->assertEquals($coupon->id, $scan->coupon->id);
    }

    public function test_belongs_to_scanner(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $this->assertInstanceOf(User::class, $scan->scanner);
        $this->assertEquals($this->user->id, $scan->scanner->id);
    }

    public function test_belongs_to_location(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $location = DistributionLocation::factory()->create([
            'event_id' => $event->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
            'location_id' => $location->id,
        ]);

        $this->assertInstanceOf(DistributionLocation::class, $scan->location);
        $this->assertEquals($location->id, $scan->location->id);
    }

    public function test_scan_method_cast_to_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
            'scan_method' => 'qr',
        ]);

        $this->assertInstanceOf(ScanMethod::class, $scan->scan_method);
        $this->assertEquals(ScanMethod::Qr, $scan->scan_method);
    }

    public function test_scan_result_cast_to_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $scan = Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
            'scan_result' => 'success',
        ]);

        $this->assertInstanceOf(ScanResult::class, $scan->scan_result);
        $this->assertEquals(ScanResult::Success, $scan->scan_result);
    }
}
