<?php

namespace Database\Factories;

use App\Models\DistributionLocation;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class DistributionLocationFactory extends Factory
{
    protected $model = DistributionLocation::class;

    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'name' => fake()->company() . ' Hall',
            'address' => fake()->address(),
            'latitude' => fake()->latitude(-8, -6),
            'longitude' => fake()->longitude(106, 112),
            'is_active' => true,
        ];
    }
}
