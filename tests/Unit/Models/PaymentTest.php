<?php

namespace Tests\Unit\Models;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Models\Payment;
use App\Models\Subscription;
use App\Scopes\TenantScope;
use Tests\TestCase;

class PaymentTest extends TestCase
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

    public function test_belongs_to_subscription(): void
    {
        $subscription = Subscription::where('tenant_id', $this->tenant->id)->first();

        $payment = Payment::factory()->create([
            'tenant_id' => $this->tenant->id,
            'subscription_id' => $subscription->id,
        ]);

        $this->assertInstanceOf(Subscription::class, $payment->subscription);
        $this->assertEquals($subscription->id, $payment->subscription->id);
    }

    public function test_payment_type_cast_to_enum(): void
    {
        $subscription = Subscription::where('tenant_id', $this->tenant->id)->first();

        $payment = Payment::factory()->create([
            'tenant_id' => $this->tenant->id,
            'subscription_id' => $subscription->id,
            'payment_type' => 'subscription',
        ]);

        $this->assertInstanceOf(PaymentType::class, $payment->payment_type);
        $this->assertEquals(PaymentType::Subscription, $payment->payment_type);
    }

    public function test_status_cast_to_payment_status_enum(): void
    {
        $subscription = Subscription::where('tenant_id', $this->tenant->id)->first();

        $payment = Payment::factory()->create([
            'tenant_id' => $this->tenant->id,
            'subscription_id' => $subscription->id,
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(PaymentStatus::class, $payment->status);
        $this->assertEquals(PaymentStatus::Pending, $payment->status);
    }
}
