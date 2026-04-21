<?php

namespace Tests;

use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $user;

    protected function setupTenant(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $this->tenant = Tenant::factory()->create();

        $this->user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
        $this->user->assignRole('tenant_admin');

        Subscription::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);
    }

    protected function actingAsTenantAdmin(): static
    {
        $this->setupTenant();

        return $this->actingAs($this->user, 'sanctum');
    }

    protected function actingAsSuperAdmin(): static
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        $admin = User::factory()->create(['tenant_id' => $tenant->id]);
        $admin->assignRole('super_admin');

        $this->tenant = $tenant;
        $this->user = $admin;

        return $this->actingAs($admin, 'sanctum');
    }

    protected function apiUrl(string $path): string
    {
        return '/api/v1/' . ltrim($path, '/');
    }
}
