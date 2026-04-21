<?php

namespace Database\Factories;

use App\Enums\DonorSubmissionStatus;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonorFactory extends Factory
{
    protected $model = Donor::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'event_id' => Event::factory(),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'submission_status' => DonorSubmissionStatus::Pending,
        ];
    }
}
