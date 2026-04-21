<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'tenant_id' => null,
            'name' => 'Super Admin',
            'email' => 'admin@qurbanlink.id',
            'password' => 'password',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $admin->assignRole('super_admin');
    }
}
