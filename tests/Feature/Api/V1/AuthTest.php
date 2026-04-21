<?php

namespace Tests\Feature\Api\V1;

use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthTest extends TestCase
{
    // ---------------------------------------------------------------
    // Registration
    // ---------------------------------------------------------------

    public function test_register_success(): void
    {
        $this->seed(RolePermissionSeeder::class);
        Notification::fake();

        $payload = [
            'name' => 'Ahmad Yusuf',
            'email' => 'ahmad@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'organization_name' => 'Masjid Al-Ikhlas',
            'phone' => '081234567890',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
        ];

        $response = $this->postJson($this->apiUrl('auth/register'), $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['user', 'token'],
            ])
            ->assertJsonPath('success', true);

        // Tenant was created
        $this->assertDatabaseHas('tenants', [
            'name' => 'Masjid Al-Ikhlas',
        ]);

        // User was created
        $this->assertDatabaseHas('users', [
            'email' => 'ahmad@example.com',
            'name' => 'Ahmad Yusuf',
        ]);

        // Subscription was created
        $user = User::where('email', 'ahmad@example.com')->first();
        $this->assertDatabaseHas('subscriptions', [
            'tenant_id' => $user->tenant_id,
            'status' => 'active',
        ]);
    }

    public function test_register_validation_errors(): void
    {
        $response = $this->postJson($this->apiUrl('auth/register'), []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors']);

        // At minimum, name, email, password, organization_name are required
        $response->assertJsonValidationErrors(['name', 'email', 'password', 'organization_name']);
    }

    public function test_register_duplicate_email(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'existing@example.com',
        ]);

        $payload = [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'organization_name' => 'Masjid Baru',
        ];

        $response = $this->postJson($this->apiUrl('auth/register'), $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    // ---------------------------------------------------------------
    // Login
    // ---------------------------------------------------------------

    public function test_login_success(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'login@example.com',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $user->assignRole('tenant_admin');
        Subscription::factory()->create(['tenant_id' => $tenant->id]);

        $response = $this->postJson($this->apiUrl('auth/login'), [
            'email' => 'login@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['user', 'token'],
            ]);
    }

    public function test_login_wrong_password(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'wrong@example.com',
            'password' => Hash::make('CorrectPassword'),
        ]);

        $response = $this->postJson($this->apiUrl('auth/login'), [
            'email' => 'wrong@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422);
    }

    public function test_login_inactive_user(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'inactive@example.com',
            'password' => Hash::make('Password123!'),
            'is_active' => false,
        ]);

        $response = $this->postJson($this->apiUrl('auth/login'), [
            'email' => 'inactive@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422);
    }

    // ---------------------------------------------------------------
    // Logout
    // ---------------------------------------------------------------

    public function test_logout_success(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'logout@example.com',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $user->assignRole('tenant_admin');
        Subscription::factory()->create(['tenant_id' => $tenant->id]);

        // Login first to get a real token
        $loginResponse = $this->postJson($this->apiUrl('auth/login'), [
            'email' => 'logout@example.com',
            'password' => 'Password123!',
        ]);

        $token = $loginResponse->json('data.token');

        // Logout with real token
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson($this->apiUrl('auth/logout'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Me
    // ---------------------------------------------------------------

    public function test_me_authenticated(): void
    {
        $this->actingAsTenantAdmin();

        $response = $this->getJson($this->apiUrl('auth/me'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data',
            ]);
    }

    public function test_me_unauthenticated(): void
    {
        $response = $this->getJson($this->apiUrl('auth/me'));

        $response->assertStatus(401);
    }

    // ---------------------------------------------------------------
    // Forgot Password
    // ---------------------------------------------------------------

    public function test_forgot_password(): void
    {
        Notification::fake();

        $this->seed(RolePermissionSeeder::class);

        $tenant = Tenant::factory()->create();
        User::factory()->create([
            'tenant_id' => $tenant->id,
            'email' => 'forgot@example.com',
        ]);

        $response = $this->postJson($this->apiUrl('auth/forgot-password'), [
            'email' => 'forgot@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ---------------------------------------------------------------
    // Resend Verification
    // ---------------------------------------------------------------

    public function test_resend_verification(): void
    {
        Notification::fake();

        $this->actingAsTenantAdmin();

        // Make the user unverified so the notification is sent
        $this->user->update(['email_verified_at' => null]);

        $response = $this->postJson($this->apiUrl('auth/verify-email/resend'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
