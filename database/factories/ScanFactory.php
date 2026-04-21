<?php

namespace Database\Factories;

use App\Enums\ScanMethod;
use App\Enums\ScanResult;
use App\Models\Coupon;
use App\Models\Event;
use App\Models\Scan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScanFactory extends Factory
{
    protected $model = Scan::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'event_id' => Event::factory(),
            'coupon_id' => Coupon::factory(),
            'scanned_by' => User::factory(),
            'scan_method' => ScanMethod::Qr,
            'scan_result' => ScanResult::Success,
            'scanned_at' => now(),
        ];
    }
}
