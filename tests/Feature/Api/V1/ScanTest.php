<?php

namespace Tests\Feature\Api\V1;

use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Scan;
use App\Scopes\TenantScope;
use Tests\TestCase;

class ScanTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    private function createEvent(): Event
    {
        return Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);
    }

    // ---------------------------------------------------------------
    // Scan - validates qr_payload required
    // ---------------------------------------------------------------

    public function test_scan_validates_qr_payload_required(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $response = $this->postJson($this->apiUrl("events/{$event->id}/scan"), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['qr_payload']);
    }

    // ---------------------------------------------------------------
    // Manual scan - validates coupon_number required
    // ---------------------------------------------------------------

    public function test_manual_scan_validates_coupon_number(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $response = $this->postJson($this->apiUrl("events/{$event->id}/scan/manual"), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['coupon_number']);
    }

    // ---------------------------------------------------------------
    // Index - returns scans
    // ---------------------------------------------------------------

    public function test_index_returns_scans(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $coupon = Coupon::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        Scan::factory()->count(2)->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'coupon_id' => $coupon->id,
            'scanned_by' => $this->user->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/scans"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta',
            ]);
    }

    // ---------------------------------------------------------------
    // Sync - validates scans array
    // ---------------------------------------------------------------

    public function test_sync_validates_array(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $response = $this->postJson($this->apiUrl("events/{$event->id}/scans/sync"), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['scans']);
    }
}
