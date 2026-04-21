<?php

namespace Tests\Unit\Models;

use App\Models\Tenant;
use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_belongs_to_tenant(): void
    {
        $this->setupTenant();

        $tenant = $this->user->tenant;

        $this->assertInstanceOf(Tenant::class, $tenant);
        $this->assertEquals($this->tenant->id, $tenant->id);
    }

    public function test_password_is_hidden(): void
    {
        $this->setupTenant();

        $array = $this->user->toArray();

        $this->assertArrayNotHasKey('password', $array);
        $this->assertArrayNotHasKey('remember_token', $array);
    }

    public function test_is_active_cast_to_boolean(): void
    {
        $this->setupTenant();

        $user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'is_active' => 1,
        ]);

        $this->assertIsBool($user->is_active);
        $this->assertTrue($user->is_active);
    }

    public function test_has_many_scans(): void
    {
        $this->setupTenant();

        $scans = $this->user->scans;

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $scans);
    }
}
