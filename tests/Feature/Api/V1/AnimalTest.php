<?php

namespace Tests\Feature\Api\V1;

use App\Models\Animal;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Tests\TestCase;

class AnimalTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    private function createEventWithDonor(): array
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        return [$event, $donor];
    }

    // ---------------------------------------------------------------
    // Index
    // ---------------------------------------------------------------

    public function test_index_returns_paginated_animals(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $donor] = $this->createEventWithDonor();

        Animal::factory()->count(3)->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/animals"));

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

    public function test_store_creates_animal(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $donor] = $this->createEventWithDonor();

        $payload = [
            'type' => 'sapi',
            'weight' => 350.50,
            'estimated_portions' => 70,
            'donor_id' => $donor->id,
        ];

        $response = $this->postJson($this->apiUrl("events/{$event->id}/animals"), $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('animals', [
            'event_id' => $event->id,
            'tenant_id' => $this->tenant->id,
            'type' => 'sapi',
            'donor_id' => $donor->id,
        ]);
    }

    // ---------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------

    public function test_update_animal(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $donor] = $this->createEventWithDonor();

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
            'type' => 'sapi',
        ]);

        $response = $this->putJson($this->apiUrl("events/{$event->id}/animals/{$animal->id}"), [
            'type' => 'kambing',
            'weight' => 45.00,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('animals', [
            'id' => $animal->id,
            'type' => 'kambing',
        ]);
    }

    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    public function test_destroy_animal(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $donor] = $this->createEventWithDonor();

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $response = $this->deleteJson($this->apiUrl("events/{$event->id}/animals/{$animal->id}"));

        $response->assertStatus(204);

        $this->assertSoftDeleted('animals', ['id' => $animal->id]);
    }

    // ---------------------------------------------------------------
    // Tenant Isolation
    // ---------------------------------------------------------------

    public function test_tenant_isolation(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $donor] = $this->createEventWithDonor();

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

        // Cannot access another tenant's event's animals
        $response = $this->getJson($this->apiUrl("events/{$otherEvent->id}/animals"));
        $response->assertStatus(404);
    }
}
