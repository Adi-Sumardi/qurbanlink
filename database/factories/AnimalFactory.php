<?php

namespace Database\Factories;

use App\Enums\AnimalStatus;
use App\Enums\AnimalType;
use App\Models\Animal;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'event_id' => Event::factory(),
            'donor_id' => Donor::factory(),
            'type' => fake()->randomElement(AnimalType::cases()),
            'weight' => fake()->randomFloat(2, 50, 500),
            'status' => AnimalStatus::Registered,
            'estimated_portions' => fake()->numberBetween(20, 100),
        ];
    }
}
