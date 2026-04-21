<?php

namespace Tests\Feature\Api\V1;

use App\Enums\EventStatus;
use App\Models\DistributionLocation;
use App\Models\Event;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

class EventTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Reset static tenant scope between tests
        TenantScope::removeTenant();
    }

    // ---------------------------------------------------------------
    // Index
    // ---------------------------------------------------------------

    public function test_index_returns_paginated(): void
    {
        $this->actingAsTenantAdmin();

        Event::factory()->count(3)->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson($this->apiUrl('events'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }

    // ---------------------------------------------------------------
    // Store
    // ---------------------------------------------------------------

    public function test_store_creates_draft_event(): void
    {
        $this->actingAsTenantAdmin();

        $payload = [
            'name' => 'Kurban 2026',
            'event_date' => '2026-06-15',
        ];

        $response = $this->postJson($this->apiUrl('events'), $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('events', [
            'tenant_id' => $this->tenant->id,
            'name' => 'Kurban 2026',
            'status' => 'draft',
        ]);
    }

    public function test_store_validation_errors(): void
    {
        $this->actingAsTenantAdmin();

        $response = $this->postJson($this->apiUrl('events'), []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'event_date']);
    }

    // ---------------------------------------------------------------
    // Show
    // ---------------------------------------------------------------

    public function test_show_with_locations(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        DistributionLocation::factory()->count(2)->create([
            'event_id' => $event->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Update
    // ---------------------------------------------------------------

    public function test_update_event_fields(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'name' => 'Old Name',
        ]);

        $response = $this->putJson($this->apiUrl("events/{$event->id}"), [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'name' => 'New Name',
        ]);
    }

    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    public function test_destroy_draft_event(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'status' => EventStatus::Draft,
        ]);

        $response = $this->deleteJson($this->apiUrl("events/{$event->id}"));

        $response->assertStatus(204);

        $this->assertSoftDeleted('events', ['id' => $event->id]);
    }

    public function test_destroy_non_draft_returns_422(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->active()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson($this->apiUrl("events/{$event->id}"));

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    // ---------------------------------------------------------------
    // Activate
    // ---------------------------------------------------------------

    public function test_activate_draft_to_active(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'status' => EventStatus::Draft,
        ]);

        $response = $this->patchJson($this->apiUrl("events/{$event->id}/activate"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'status' => 'active',
        ]);
    }

    public function test_activate_non_draft_returns_422(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->active()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->patchJson($this->apiUrl("events/{$event->id}/activate"));

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    // ---------------------------------------------------------------
    // Complete
    // ---------------------------------------------------------------

    public function test_complete_active_to_completed(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->active()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->patchJson($this->apiUrl("events/{$event->id}/complete"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'status' => 'completed',
        ]);
    }

    // ---------------------------------------------------------------
    // Tenant Isolation
    // ---------------------------------------------------------------

    public function test_tenant_isolation(): void
    {
        $this->actingAsTenantAdmin();

        // Create an event belonging to this tenant
        Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
            'name' => 'My Event',
        ]);

        // Create a second tenant with its own event
        $otherTenant = Tenant::factory()->create();
        $otherUser = User::factory()->create(['tenant_id' => $otherTenant->id]);
        Subscription::factory()->create(['tenant_id' => $otherTenant->id]);

        // Remove the tenant scope to create an event for the other tenant
        TenantScope::removeTenant();
        $otherEvent = Event::factory()->create([
            'tenant_id' => $otherTenant->id,
            'created_by' => $otherUser->id,
            'name' => 'Other Tenant Event',
        ]);

        // Re-set the tenant scope for the request
        TenantScope::setTenant($this->tenant);

        // The first user should not see the other tenant's events
        $response = $this->getJson($this->apiUrl('events'));

        $response->assertStatus(200);

        $eventNames = collect($response->json('data'))->pluck('name')->toArray();
        $this->assertContains('My Event', $eventNames);
        $this->assertNotContains('Other Tenant Event', $eventNames);

        // Also cannot access the other event directly
        $showResponse = $this->getJson($this->apiUrl("events/{$otherEvent->id}"));
        $showResponse->assertStatus(404);
    }
}
