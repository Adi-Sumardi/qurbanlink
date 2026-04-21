<?php

namespace Tests\Unit\Models;

use App\Enums\CouponStatus;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class CouponTest extends TestCase
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

        $this->assertInstanceOf(Event::class, $coupon->event);
        $this->assertEquals($event->id, $coupon->event->id);
    }

    public function test_belongs_to_recipient(): void
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

        $this->assertInstanceOf(Recipient::class, $coupon->recipient);
        $this->assertEquals($recipient->id, $coupon->recipient->id);
    }

    public function test_has_many_scans(): void
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

        Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $scans = $coupon->scans;

        $this->assertInstanceOf(Collection::class, $scans);
        $this->assertCount(1, $scans);
    }

    public function test_status_cast_to_coupon_status_enum(): void
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
            'status' => 'generated',
        ]);

        $this->assertInstanceOf(CouponStatus::class, $coupon->status);
        $this->assertEquals(CouponStatus::Generated, $coupon->status);
    }
}
