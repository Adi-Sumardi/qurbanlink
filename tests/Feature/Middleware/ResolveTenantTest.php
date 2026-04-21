<?php

namespace Tests\Feature\Middleware;

use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

class ResolveTenantTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    // ---------------------------------------------------------------
    // Resolves tenant from authenticated user
    // ---------------------------------------------------------------

    public function test_resolves_tenant_from_authenticated_user(): void
    {
        $this->actingAsTenantAdmin();

        // Hit a tenant-scoped route; if middleware works, we get 200
        $response = $this->getJson($this->apiUrl('events'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Rejects unauthenticated request
    // ---------------------------------------------------------------

    public function test_rejects_unauthenticated_request(): void
    {
        $response = $this->getJson($this->apiUrl('events'));

        $response->assertStatus(401);
    }

    // ---------------------------------------------------------------
    // Rejects suspended tenant
    // ---------------------------------------------------------------

    public function test_rejects_suspended_tenant(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->suspended()->create();
        $user = User::factory()->create(['tenant_id' => $tenant->id]);
        $user->assignRole('tenant_admin');
        Subscription::factory()->create(['tenant_id' => $tenant->id]);

        $this->tenant = $tenant;
        $this->user = $user;

        $response = $this->actingAs($user, 'sanctum')
            ->getJson($this->apiUrl('events'));

        $response->assertStatus(403);
    }

    // ---------------------------------------------------------------
    // Super admin bypasses tenant check
    // ---------------------------------------------------------------

    public function test_super_admin_bypasses_tenant_check(): void
    {
        $this->actingAsSuperAdmin();

        // Super admin should be able to hit tenant routes without owning a real tenant
        $response = $this->getJson($this->apiUrl('events'));

        // The middleware passes; the response depends on the controller, but should not be 401/403
        $this->assertNotEquals(401, $response->status());
        $this->assertNotEquals(403, $response->status());
    }
}
