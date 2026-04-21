<?php

namespace Tests\Unit\Models;

use App\Enums\EventStatus;
use App\Models\Animal;
use App\Models\Coupon;
use App\Models\DistributionLocation;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use App\Models\Tenant;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class EventTest extends TestCase
{
    private Event $event;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupTenant();
        TenantScope::setTenant($this->tenant);

        $this->event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);
    }

    protected function tearDown(): void
    {
        TenantScope::removeTenant();
        parent::tearDown();
    }

    public function test_belongs_to_tenant(): void
    {
        $tenant = $this->event->tenant;

        $this->assertInstanceOf(Tenant::class, $tenant);
        $this->assertEquals($this->tenant->id, $tenant->id);
    }

    public function test_has_many_distribution_locations(): void
    {
        DistributionLocation::factory()->create([
            'event_id' => $this->event->id,
        ]);

        $locations = $this->event->distributionLocations;

        $this->assertInstanceOf(Collection::class, $locations);
        $this->assertCount(1, $locations);
    }

    public function test_has_many_donors(): void
    {
        Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        $donors = $this->event->donors;

        $this->assertInstanceOf(Collection::class, $donors);
        $this->assertCount(1, $donors);
    }

    public function test_has_many_animals(): void
    {
        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
            'donor_id' => $donor->id,
        ]);

        $animals = $this->event->animals;

        $this->assertInstanceOf(Collection::class, $animals);
        $this->assertCount(1, $animals);
    }

    public function test_has_many_recipients(): void
    {
        Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        $recipients = $this->event->recipients;

        $this->assertInstanceOf(Collection::class, $recipients);
        $this->assertCount(1, $recipients);
    }

    public function test_has_many_coupons(): void
    {
        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
            'recipient_id' => $recipient->id,
        ]);

        $coupons = $this->event->coupons;

        $this->assertInstanceOf(Collection::class, $coupons);
        $this->assertCount(1, $coupons);
    }

    public function test_has_many_scans(): void
    {
        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
            'recipient_id' => $recipient->id,
        ]);

        Scan::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $this->event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $scans = $this->event->scans;

        $this->assertInstanceOf(Collection::class, $scans);
        $this->assertCount(1, $scans);
    }

    public function test_status_cast_to_event_status_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'status' => 'active',
        ]);

        $this->assertInstanceOf(EventStatus::class, $event->status);
        $this->assertEquals(EventStatus::Active, $event->status);
    }
}
