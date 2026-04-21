<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TenantFactory extends Factory
{
    protected $model = Tenant::class;

    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(4),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'is_active' => true,
            'settings' => [
                'timezone' => 'Asia/Jakarta',
                'locale' => 'id',
                'coupon_prefix' => 'QRB',
            ],
        ];
    }

    public function suspended(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
            'suspended_at' => now(),
        ]);
    }
}
