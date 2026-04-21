<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class TenantTest extends TestCase
{
    public function test_has_many_users(): void
    {
        $this->setupTenant();

        $users = $this->tenant->users;

        $this->assertInstanceOf(Collection::class, $users);
        $this->assertTrue($users->contains($this->user));
    }

    public function test_has_many_events(): void
    {
        $this->setupTenant();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $events = $this->tenant->events;

        $this->assertInstanceOf(Collection::class, $events);
        $this->assertTrue($events->contains($event));
    }

    public function test_has_many_subscriptions(): void
    {
        $this->setupTenant();

        $subscriptions = $this->tenant->subscriptions;

        $this->assertInstanceOf(Collection::class, $subscriptions);
        $this->assertGreaterThanOrEqual(1, $subscriptions->count());
    }

    public function test_settings_cast_to_array(): void
    {
        $this->setupTenant();

        $tenant = Tenant::factory()->create([
            'settings' => ['timezone' => 'Asia/Jakarta', 'locale' => 'id'],
        ]);

        $this->assertIsArray($tenant->settings);
        $this->assertEquals('Asia/Jakarta', $tenant->settings['timezone']);
    }

    public function test_is_active_cast_to_boolean(): void
    {
        $this->setupTenant();

        $tenant = Tenant::factory()->create(['is_active' => 1]);

        $this->assertIsBool($tenant->is_active);
        $this->assertTrue($tenant->is_active);
    }
}
