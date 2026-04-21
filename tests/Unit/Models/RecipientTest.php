<?php

namespace Tests\Unit\Models;

use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Tenant;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class RecipientTest extends TestCase
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

    public function test_belongs_to_tenant(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $this->assertInstanceOf(Tenant::class, $recipient->tenant);
        $this->assertEquals($this->tenant->id, $recipient->tenant->id);
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

        $this->assertInstanceOf(Event::class, $recipient->event);
        $this->assertEquals($event->id, $recipient->event->id);
    }

    public function test_has_many_coupons(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $coupons = $recipient->coupons;

        $this->assertInstanceOf(Collection::class, $coupons);
        $this->assertCount(1, $coupons);
    }
}
