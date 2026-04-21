<?php

namespace Tests\Feature\Api\V1;

use App\Models\Donor;
use App\Models\Event;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Tests\TestCase;

class DonorTest extends TestCase
{
    private Event $event;

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
    // Index
    // ---------------------------------------------------------------

    public function test_index_returns_paginated_donors(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        Donor::factory()->count(3)->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/donors"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta',
            ]);
    }

    // ---------------------------------------------------------------
    // Store
    // ---------------------------------------------------------------

    public function test_store_creates_donor(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $payload = [
            'name' => 'Donor Baru',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka 1',
        ];

        $response = $this->postJson($this->apiUrl("events/{$event->id}/donors"), $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('donors', [
            'event_id' => $event->id,
            'name' => 'Donor Baru',
            'tenant_id' => $this->tenant->id,
        ]);
    }

    // ---------------------------------------------------------------
    // Show
    // ---------------------------------------------------------------

    public function test_show_returns_donor(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/donors/{$donor->id}"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------

    public function test_update_donor(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'name' => 'Old Donor',
        ]);

        $response = $this->putJson($this->apiUrl("events/{$event->id}/donors/{$donor->id}"), [
            'name' => 'Updated Donor',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('donors', [
            'id' => $donor->id,
            'name' => 'Updated Donor',
        ]);
    }

    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    public function test_destroy_donor(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $response = $this->deleteJson($this->apiUrl("events/{$event->id}/donors/{$donor->id}"));

        $response->assertStatus(204);

        $this->assertSoftDeleted('donors', ['id' => $donor->id]);
    }

    // ---------------------------------------------------------------
    // Tenant Isolation
    // ---------------------------------------------------------------

    public function test_tenant_isolation(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'name' => 'My Donor',
        ]);

        // Create another tenant's event and donor
        $otherTenant = Tenant::factory()->create();
        $otherUser = User::factory()->create(['tenant_id' => $otherTenant->id]);
        Subscription::factory()->create(['tenant_id' => $otherTenant->id]);

        TenantScope::removeTenant();
        $otherEvent = Event::factory()->create([
            'tenant_id' => $otherTenant->id,
            'created_by' => $otherUser->id,
        ]);
        $otherDonor = Donor::factory()->create([
            'tenant_id' => $otherTenant->id,
            'event_id' => $otherEvent->id,
            'name' => 'Other Donor',
        ]);
        TenantScope::setTenant($this->tenant);

        // Cannot access another tenant's event's donors
        $response = $this->getJson($this->apiUrl("events/{$otherEvent->id}/donors"));

        // The event itself should not be found because of tenant scoping
        $response->assertStatus(404);
    }
}
