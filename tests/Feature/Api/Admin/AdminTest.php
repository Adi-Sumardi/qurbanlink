<?php

namespace Tests\Feature\Api\Admin;

use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

class AdminTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    // ---------------------------------------------------------------
    // Dashboard
    // ---------------------------------------------------------------

    public function test_admin_dashboard(): void
    {
        $this->actingAsSuperAdmin();

        $response = $this->getJson($this->apiUrl('admin/dashboard'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'total_tenants',
                    'total_users',
                    'active_subscriptions',
                    'revenue',
                ],
            ]);
    }

    // ---------------------------------------------------------------
    // Tenant list
    // ---------------------------------------------------------------

    public function test_tenant_list(): void
    {
        $this->actingAsSuperAdmin();

        // Create some extra tenants
        Tenant::factory()->count(3)->create();

        $response = $this->getJson($this->apiUrl('admin/tenants'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta',
            ]);
    }

    // ---------------------------------------------------------------
    // Suspend tenant
    // ---------------------------------------------------------------

    public function test_suspend_tenant(): void
    {
        $this->actingAsSuperAdmin();

        $tenant = Tenant::factory()->create(['is_active' => true]);

        $response = $this->patchJson($this->apiUrl("admin/tenants/{$tenant->id}/suspend"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $tenant->refresh();
        $this->assertFalse($tenant->is_active);
        $this->assertNotNull($tenant->suspended_at);
    }

    // ---------------------------------------------------------------
    // Unsuspend tenant
    // ---------------------------------------------------------------

    public function test_unsuspend_tenant(): void
    {
        $this->actingAsSuperAdmin();

        $tenant = Tenant::factory()->suspended()->create();

        $response = $this->patchJson($this->apiUrl("admin/tenants/{$tenant->id}/unsuspend"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $tenant->refresh();
        $this->assertTrue($tenant->is_active);
        $this->assertNull($tenant->suspended_at);
    }

    // ---------------------------------------------------------------
    // Non-admin forbidden
    // ---------------------------------------------------------------

    public function test_non_admin_forbidden(): void
    {
        $this->actingAsTenantAdmin();

        $response = $this->getJson($this->apiUrl('admin/dashboard'));

        $response->assertStatus(403);
    }
}
