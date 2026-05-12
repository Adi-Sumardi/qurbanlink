<?php

namespace Tests\Unit\Models;

use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Collection;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    public function test_belongs_to_tenant(): void
    {
        $this->setupTenant();

        $subscription = Subscription::where('tenant_id', $this->tenant->id)->first();

        $this->assertInstanceOf(Tenant::class, $subscription->tenant);
        $this->assertEquals($this->tenant->id, $subscription->tenant->id);
    }

    public function test_has_many_payments(): void
    {
        $this->setupTenant();

        $subscription = Subscription::where('tenant_id', $this->tenant->id)->first();

        Payment::factory()->create([
            'tenant_id' => $this->tenant->id,
            'subscription_id' => $subscription->id,
        ]);

        $payments = $subscription->payments;

        $this->assertInstanceOf(Collection::class, $payments);
        $this->assertCount(1, $payments);
    }

    public function test_plan_stored_as_string_to_support_dynamic_plans(): void
    {
        $this->setupTenant();

        // Plan is sourced from `plans` DB table (slug column),
        // not enum, so any custom plan slug should work.
        $subscription = Subscription::factory()->create([
            'tenant_id' => $this->tenant->id,
            'plan' => 'uji-coba',
        ]);

        $this->assertIsString($subscription->plan);
        $this->assertEquals('uji-coba', $subscription->plan);
    }

    public function test_status_cast_to_subscription_status_enum(): void
    {
        $this->setupTenant();

        $subscription = Subscription::factory()->create([
            'tenant_id' => $this->tenant->id,
            'status' => 'active',
        ]);

        $this->assertInstanceOf(SubscriptionStatus::class, $subscription->status);
        $this->assertEquals(SubscriptionStatus::Active, $subscription->status);
    }
}
