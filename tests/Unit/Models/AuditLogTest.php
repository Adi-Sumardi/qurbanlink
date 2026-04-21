<?php

namespace Tests\Unit\Models;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->setupTenant();
        TenantScope::setTenant($this->tenant);
    }

    protected function tearDown(): void
    {
        TenantScope::removeTenant();
        parent::tearDown();
    }

    public function test_morph_to_auditable(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $auditLog = AuditLog::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'auditable_type' => Event::class,
            'auditable_id' => $event->id,
            'action' => 'created',
            'old_values' => null,
            'new_values' => ['name' => $event->name],
            'created_at' => now(),
        ]);

        $this->assertInstanceOf(Event::class, $auditLog->auditable);
        $this->assertEquals($event->id, $auditLog->auditable->id);
    }

    public function test_old_values_cast_to_array(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $auditLog = AuditLog::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'auditable_type' => Event::class,
            'auditable_id' => $event->id,
            'action' => 'updated',
            'old_values' => ['name' => 'Old Name'],
            'new_values' => ['name' => 'New Name'],
            'created_at' => now(),
        ]);

        $this->assertIsArray($auditLog->old_values);
        $this->assertEquals('Old Name', $auditLog->old_values['name']);
    }

    public function test_new_values_cast_to_array(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $auditLog = AuditLog::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'auditable_type' => Event::class,
            'auditable_id' => $event->id,
            'action' => 'updated',
            'old_values' => ['name' => 'Old Name'],
            'new_values' => ['name' => 'New Name'],
            'created_at' => now(),
        ]);

        $this->assertIsArray($auditLog->new_values);
        $this->assertEquals('New Name', $auditLog->new_values['name']);
    }

    public function test_belongs_to_tenant(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $auditLog = AuditLog::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'auditable_type' => Event::class,
            'auditable_id' => $event->id,
            'action' => 'created',
            'old_values' => null,
            'new_values' => ['name' => $event->name],
            'created_at' => now(),
        ]);

        $this->assertInstanceOf(Tenant::class, $auditLog->tenant);
        $this->assertEquals($this->tenant->id, $auditLog->tenant->id);
    }

    public function test_belongs_to_user(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $auditLog = AuditLog::create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'auditable_type' => Event::class,
            'auditable_id' => $event->id,
            'action' => 'created',
            'old_values' => null,
            'new_values' => ['name' => $event->name],
            'created_at' => now(),
        ]);

        $this->assertInstanceOf(User::class, $auditLog->user);
        $this->assertEquals($this->user->id, $auditLog->user->id);
    }
}
