<?php

namespace Tests\Feature\Middleware;

use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

class CheckSubscriptionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    // ---------------------------------------------------------------
    // Passes with active subscription
    // ---------------------------------------------------------------

    public function test_passes_with_active_subscription(): void
    {
        $this->actingAsTenantAdmin();

        // actingAsTenantAdmin() creates a subscription, so this should pass
        $response = $this->getJson($this->apiUrl('events'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Rejects without subscription
    // ---------------------------------------------------------------

    public function test_rejects_without_subscription(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $user->assignRole('tenant_admin');

        // Deliberately do NOT create a subscription for this tenant
        $this->tenant = $tenant;
        $this->user = $user;

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->apiUrl('events'));

        $response->assertStatus(403);
    }
}
