<?php

namespace Tests\Unit\Models;

use App\Models\DistributionLocation;
use App\Models\Event;
use App\Models\Scan;
use App\Models\Coupon;
use App\Models\Recipient;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class DistributionLocationTest extends TestCase
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

        $location = DistributionLocation::factory()->create([
            'event_id' => $event->id,
        ]);

        $this->assertInstanceOf(Event::class, $location->event);
        $this->assertEquals($event->id, $location->event->id);
    }

    public function test_has_many_scans(): void
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

        Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
            'location_id' => $location->id,
        ]);

        $scans = $location->scans;

        $this->assertInstanceOf(Collection::class, $scans);
        $this->assertCount(1, $scans);
    }

    public function test_is_active_cast_to_boolean(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $location = DistributionLocation::factory()->create([
            'event_id' => $event->id,
            'is_active' => 1,
        ]);

        $this->assertIsBool($location->is_active);
        $this->assertTrue($location->is_active);
    }
}
