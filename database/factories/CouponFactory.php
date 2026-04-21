<?php

namespace Database\Factories;

use App\Enums\CouponStatus;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'event_id' => Event::factory(),
            'recipient_id' => Recipient::factory(),
            'coupon_number' => 'QRB-' . str_pad(fake()->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
            'qr_payload' => json_encode(['v' => 1, 'c' => fake()->uuid()]),
            'qr_signature' => fake()->sha256(),
            'status' => CouponStatus::Generated,
            'generated_at' => now(),
            'expires_at' => now()->addDays(30),
        ];
    }

    public function claimed(): static
    {
        return $this->state(fn () => [
            'status' => CouponStatus::Claimed,
            'claimed_at' => now(),
        ]);
    }

    public function voided(): static
    {
        return $this->state(fn () => [
            'status' => CouponStatus::Voided,
            'voided_at' => now(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'status' => CouponStatus::Expired,
            'expires_at' => now()->subDay(),
        ]);
    }
}
