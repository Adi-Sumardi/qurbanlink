<?php

namespace Tests\Unit\Models;

use App\Enums\DonorSubmissionStatus;
use App\Models\Animal;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Tenant;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class DonorTest extends TestCase
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

        $this->assertInstanceOf(Tenant::class, $donor->tenant);
        $this->assertEquals($this->tenant->id, $donor->tenant->id);
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

        $this->assertInstanceOf(Event::class, $donor->event);
        $this->assertEquals($event->id, $donor->event->id);
    }

    public function test_has_many_animals(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        Animal::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'donor_id' => $donor->id,
        ]);

        $animals = $donor->animals;

        $this->assertInstanceOf(Collection::class, $animals);
        $this->assertCount(1, $animals);
    }

    public function test_submission_status_cast_to_enum(): void
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $donor = Donor::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'submission_status' => 'pending',
        ]);

        $this->assertInstanceOf(DonorSubmissionStatus::class, $donor->submission_status);
        $this->assertEquals(DonorSubmissionStatus::Pending, $donor->submission_status);
    }
}
