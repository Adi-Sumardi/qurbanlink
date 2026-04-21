<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Recipient;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecipientFactory extends Factory
{
    protected $model = Recipient::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'event_id' => Event::factory(),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'category' => fake()->randomElement(['fakir_miskin', 'yatim_piatu', 'janda', 'umum']),
            'portions' => 1,
        ];
    }
}
