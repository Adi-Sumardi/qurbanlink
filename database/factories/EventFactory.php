<?php

namespace Database\Factories;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'created_by' => User::factory(),
            'name' => 'Kurban ' . fake()->year(),
            'event_date' => fake()->dateTimeBetween('now', '+1 year'),
            'status' => EventStatus::Draft,
            'year' => fake()->year(),
            'total_coupons' => 0,
            'distributed' => 0,
            'settings' => [],
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['status' => EventStatus::Active]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => EventStatus::Completed]);
    }
}
