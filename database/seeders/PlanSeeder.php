<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'                     => 'Uji Coba',
                'slug'                     => 'free',
                'price_monthly'            => 0,
                'price_yearly'             => 0,
                'coupon_quota'             => 100,
                'max_events_per_year'      => 1,
                'max_users'                => 3,
                'max_recipients_per_event' => 100,
                'features'                 => [
                    'qr_code'             => true,
                    'manual_scan'         => true,
                    'live_dashboard'      => false,
                    'export_pdf'          => false,
                    'export_excel'        => false,
                    'custom_branding'     => false,
                    'email_notifications' => false,
                    'api_access'          => false,
                    'priority_support'    => false,
                ],
                'is_active'  => true,
                'sort_order' => 1,
            ],
            [
                'name'                     => 'Mushola',
                'slug'                     => 'starter',
                'price_monthly'            => 99000,
                'price_yearly'             => 999000,
                'coupon_quota'             => 500,
                'max_events_per_year'      => 3,
                'max_users'                => 5,
                'max_recipients_per_event' => 500,
                'features'                 => [
                    'qr_code'             => true,
                    'manual_scan'         => true,
                    'live_dashboard'      => true,
                    'export_pdf'          => true,
                    'export_excel'        => false,
                    'custom_branding'     => false,
                    'email_notifications' => true,
                    'api_access'          => false,
                    'priority_support'    => false,
                ],
                'is_active'  => true,
                'sort_order' => 2,
            ],
            [
                'name'                     => 'Masjid',
                'slug'                     => 'professional',
                'price_monthly'            => 249000,
                'price_yearly'             => 2499000,
                'coupon_quota'             => 2000,
                'max_events_per_year'      => null,
                'max_users'                => 20,
                'max_recipients_per_event' => null,
                'features'                 => [
                    'qr_code'             => true,
                    'manual_scan'         => true,
                    'live_dashboard'      => true,
                    'export_pdf'          => true,
                    'export_excel'        => true,
                    'custom_branding'     => true,
                    'email_notifications' => true,
                    'api_access'          => true,
                    'priority_support'    => false,
                ],
                'is_active'  => true,
                'sort_order' => 3,
            ],
            [
                'name'                     => 'Enterprise',
                'slug'                     => 'enterprise',
                'price_monthly'            => 0,
                'price_yearly'             => 0,
                'coupon_quota'             => 0, // 0 = unlimited
                'max_events_per_year'      => null,
                'max_users'                => null,
                'max_recipients_per_event' => null,
                'features'                 => [
                    'qr_code'             => true,
                    'manual_scan'         => true,
                    'live_dashboard'      => true,
                    'export_pdf'          => true,
                    'export_excel'        => true,
                    'custom_branding'     => true,
                    'email_notifications' => true,
                    'api_access'          => true,
                    'priority_support'    => true,
                ],
                'is_active'  => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }
    }
}
