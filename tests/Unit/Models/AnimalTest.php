<?php

namespace Tests\Unit\Models;

use App\Enums\AnimalStatus;
use App\Enums\AnimalType;
use App\Models\Animal;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Tenant;
use App\Scopes\TenantScope;
use Tests\TestCase;

class AnimalTest extends TestCase
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

    public function test_belongs_to_tenant(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $this->assertInstanceOf(Tenant::class, $animal->tenant);
        $this->assertEquals($this->tenant->id, $animal->tenant->id);
    }

    public function test_belongs_to_event(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $this->assertInstanceOf(Event::class, $animal->event);
        $this->assertEquals($event->id, $animal->event->id);
    }

    public function test_belongs_to_donor(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $this->assertInstanceOf(Donor::class, $animal->donor);
        $this->assertEquals($donor->id, $animal->donor->id);
    }

    public function test_type_cast_to_animal_type_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
            'type' => 'sapi',
        ]);

        $this->assertInstanceOf(AnimalType::class, $animal->type);
        $this->assertEquals(AnimalType::Sapi, $animal->type);
    }

    public function test_status_cast_to_animal_status_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $animal = Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
            'status' => 'registered',
        ]);

        $this->assertInstanceOf(AnimalStatus::class, $animal->status);
        $this->assertEquals(AnimalStatus::Registered, $animal->status);
    }
}
