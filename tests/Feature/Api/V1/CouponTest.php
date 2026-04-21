<?php

namespace Tests\Feature\Api\V1;

use App\Enums\CouponStatus;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Scopes\TenantScope;
use Tests\TestCase;

class CouponTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TenantScope::removeTenant();
    }

    private function createEventWithCoupons(int $count = 3, ?CouponStatus $status = null): array
    {
        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        $factory = Coupon::factory()->count($count);

        if ($status === CouponStatus::Voided) {
            $factory = $factory->voided();
        } elseif ($status === CouponStatus::Claimed) {
            $factory = $factory->claimed();
        }

        $coupons = $factory->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        return [$event, $recipient, $coupons];
    }

    // ---------------------------------------------------------------
    // Index
    // ---------------------------------------------------------------

    public function test_index_returns_paginated_coupons(): void
    {
        $this->actingAsTenantAdmin();
        [$event] = $this->createEventWithCoupons(3);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/coupons"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
                'meta',
            ]);
    }

    // ---------------------------------------------------------------
    // Index with status filter
    // ---------------------------------------------------------------

    public function test_index_filter_by_status(): void
    {
        $this->actingAsTenantAdmin();

        $event = Event::factory()->create([
            'tenant_id' => $this->tenant->id,
            'created_by' => $this->user->id,
        ]);

        $recipient = Recipient::factory()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
        ]);

        // Create 2 generated and 1 voided coupon
        Coupon::factory()->count(2)->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
            'status' => CouponStatus::Generated,
        ]);

        Coupon::factory()->voided()->create([
            'tenant_id' => $this->tenant->id,
            'event_id' => $event->id,
            'recipient_id' => $recipient->id,
        ]);

        $response = $this->getJson($this->apiUrl("events/{$event->id}/coupons?status=generated"));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Only the generated coupons should be returned
        $this->assertCount(2, $response->json('data'));
    }

    // ---------------------------------------------------------------
    // Void
    // ---------------------------------------------------------------

    public function test_void_coupon(): void
    {
        $this->actingAsTenantAdmin();
        [$event, $recipient, $coupons] = $this->createEventWithCoupons(1);
        $coupon = $coupons->first();

        $response = $this->patchJson($this->apiUrl("events/{$event->id}/coupons/{$coupon->id}/void"), [
            'void_reason' => 'Coupon rusak',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('coupons', [
            'id' => $coupon->id,
            'status' => 'voided',
        ]);
    }
}
