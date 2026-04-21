<?php

namespace Database\Seeders;

use App\Enums\EventStatus;
use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Recipient;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoTenantSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo tenant
        $tenant = Tenant::create([
            'name' => 'Masjid Al-Ikhlas',
            'slug' => 'masjid-al-ikhlas',
            'email' => 'admin@masjid-alikhlas.id',
            'phone' => '021-12345678',
            'address' => 'Jl. Raya Masjid No. 1',
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'settings' => [
                'timezone' => 'Asia/Jakarta',
                'locale' => 'id',
                'coupon_prefix' => 'ALI',
                'branding' => [
                    'primary_color' => '#22C55E',
                    'organization_type' => 'masjid',
                ],
            ],
        ]);

        // Create tenant admin user
        $admin = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Admin Masjid',
            'email' => 'admin@demo.qurbanlink.id',
            'password' => 'password',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('tenant_admin');

        // Create operator
        $operator = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Panitia Kurban',
            'email' => 'operator@demo.qurbanlink.id',
            'password' => 'password',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $operator->assignRole('operator');

        // Create viewer
        $viewer = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Pengamat Kurban',
            'email' => 'viewer@demo.qurbanlink.id',
            'password' => 'password',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $viewer->assignRole('viewer');

        // Create free subscription
        Subscription::create([
            'tenant_id' => $tenant->id,
            'plan' => SubscriptionPlan::Free,
            'status' => SubscriptionStatus::Active,
            'coupon_quota' => 100,
            'coupon_used' => 0,
            'price' => 0,
            'billing_cycle' => 'monthly',
            'starts_at' => now(),
        ]);

        // Create demo event
        $event = Event::create([
            'tenant_id' => $tenant->id,
            'name' => 'Idul Adha 1447H',
            'slug' => 'idul-adha-1447h',
            'description' => 'Distribusi daging kurban Idul Adha 1447H Masjid Al-Ikhlas',
            'event_date' => '2026-06-07',
            'start_time' => '08:00',
            'end_time' => '16:00',
            'year' => 2026,
            'status' => EventStatus::Draft,
            'settings' => [
                'categories' => [
                    ['key' => 'fakir', 'label' => 'Fakir', 'quota' => 30],
                    ['key' => 'miskin', 'label' => 'Miskin', 'quota' => 30],
                    ['key' => 'umum', 'label' => 'Umum', 'quota' => 30],
                    ['key' => 'panitia', 'label' => 'Panitia', 'quota' => 10],
                ],
                'portions_per_animal' => ['sapi' => 70, 'kambing' => 7],
            ],
            'created_by' => $admin->id,
        ]);

        // Create demo donors
        $donors = [
            ['name' => 'Bapak Ahmad', 'phone' => '08123456001'],
            ['name' => 'Ibu Fatimah', 'phone' => '08123456002'],
            ['name' => 'Bapak Usman', 'phone' => '08123456003'],
        ];

        foreach ($donors as $donorData) {
            Donor::create([
                'tenant_id' => $tenant->id,
                'event_id' => $event->id,
                'name' => $donorData['name'],
                'phone' => $donorData['phone'],
                'submission_status' => 'pending',
            ]);
        }

        // Create demo recipients
        $categories = ['fakir', 'miskin', 'umum', 'panitia'];
        for ($i = 1; $i <= 20; $i++) {
            Recipient::create([
                'tenant_id' => $tenant->id,
                'event_id' => $event->id,
                'name' => "Penerima Demo {$i}",
                'category' => $categories[($i - 1) % 4],
                'portions' => 1,
                'address' => "Jl. Demo No. {$i}",
                'kelurahan' => 'Kebayoran Baru',
                'kecamatan' => 'Jakarta Selatan',
            ]);
        }
    }
}
