<?php

namespace App\Actions\Auth;

use App\Enums\EventStatus;
use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Event;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegisterAction
{
    public function execute(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // Create tenant
            $tenant = Tenant::create([
                'name' => $data['organization_name'],
                'slug' => Str::slug($data['organization_name']) . '-' . Str::random(4),
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'city' => $data['city'] ?? null,
                'province' => $data['province'] ?? null,
                'settings' => [
                    'timezone' => 'Asia/Jakarta',
                    'locale' => 'id',
                    'coupon_prefix' => 'QRB',
                ],
            ]);

            // Create user
            $user = User::create([
                'tenant_id' => $tenant->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => true,
            ]);

            // Assign tenant_admin role
            $user->assignRole('tenant_admin');

            // Create free subscription
            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan' => SubscriptionPlan::Free,
                'status' => SubscriptionStatus::Active,
                'coupon_quota' => config('plans.free.coupon_quota', 100),
                'coupon_used' => 0,
                'price' => 0,
                'billing_cycle' => 'monthly',
                'starts_at' => now(),
                'expires_at' => null,
            ]);

            // Create the initial event chosen during registration
            $event = Event::create([
                'tenant_id'   => $tenant->id,
                'created_by'  => $user->id,
                'name'        => $data['event_name'],
                'description' => $data['event_description'] ?? null,
                'event_date'  => $data['event_date'],
                'year'        => date('Y', strtotime($data['event_date'])),
                'status'      => EventStatus::Draft,
                'total_coupons' => 0,
                'distributed'   => 0,
            ]);

            return [
                'tenant' => $tenant,
                'user'   => $user,
                'event'  => $event,
            ];
        });
    }
}
