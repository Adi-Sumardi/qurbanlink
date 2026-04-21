<?php

namespace Tests\Feature\Api\V1;

use App\Models\Event;
use App\Models\Recipient;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Tests\TestCase;

class RecipientTest extends TestCase
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
    // Index
    // ---------------------------------------------------------------

    public function test_index_returns_paginated_recipients(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        Recipient::factory()->count(3)->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/recipients"));

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

    public function test_store_creates_recipient(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $payload = [
            'name' => 'Penerima Baru',
            'phone' => '081234567890',
            'address' => 'Jl. Mawar 5',
            'category' => 'fakir_miskin',
            'portions' => 2,
        ];

        $response = $this->postJson($this->apiUrl("events/{$event->id}/recipients"), $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('recipients', [
            'event_id' => $event->id,
            'tenant_id' => $this->tenant->id,
            'name' => 'Penerima Baru',
            'category' => 'fakir_miskin',
        ]);
    }

    // ---------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------

    public function test_update_recipient(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'name' => 'Old Name',
        ]);

        $response = $this->putJson($this->apiUrl("events/{$event->id}/recipients/{$recipient->id}"), [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('recipients', [
            'id' => $recipient->id,
            'name' => 'Updated Name',
        ]);
    }

    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    public function test_destroy_recipient(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $response = $this->deleteJson($this->apiUrl("events/{$event->id}/recipients/{$recipient->id}"));

        $response->assertStatus(204);

        $this->assertSoftDeleted('recipients', ['id' => $recipient->id]);
    }

    // ---------------------------------------------------------------
    // Tenant Isolation
    // ---------------------------------------------------------------

    public function test_tenant_isolation(): void
    {
        $this->actingAsTenantAdmin();
        $event = $this->createEvent();

        // Create another tenant's data
        $otherTenant = Tenant::factory()->create();
        $otherUser = User::factory()->create(['tenant_id' => $otherTenant->id]);
        Subscription::factory()->create(['tenant_id' => $otherTenant->id]);

        TenantScope::removeTenant();
        $otherEvent = Event::factory()->create([
            'tenant_id' => $otherTenant->id,
            'created_by' => $otherUser->id,
        ]);
        TenantScope::setTenant($this->tenant);

        // Cannot access another tenant's event's recipients
        $response = $this->getJson($this->apiUrl("events/{$otherEvent->id}/recipients"));
        $response->assertStatus(404);
    }
}
