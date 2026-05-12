<?php

namespace Tests\Unit\Actions;

use App\Actions\Auth\RegisterAction;
use App\Enums\SubscriptionPlan;
use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

class RegisterActionTest extends TestCase
{
    private RegisterAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->action = new RegisterAction();
    }

    private function validData(array $overrides = []): array
    {
        return array_merge([
            'organization_name' => 'Masjid Al-Ikhlas',
            'name' => 'Admin User',
            'email' => 'admin@masjid.test',
            'password' => 'password123',
            'phone' => '081234567890',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'event_name' => 'Qurban 1446 H',
            'event_date' => '2026-06-17',
            'event_description' => 'Distribusi qurban tahunan',
        ], $overrides);
    }

    public function test_creates_tenant_with_correct_name(): void
    {
        $result = $this->action->execute($this->validData());

        $this->assertInstanceOf(Tenant::class, $result['tenant']);
        $this->assertEquals('Masjid Al-Ikhlas', $result['tenant']->name);
        $this->assertStringStartsWith('masjid-al-ikhlas-', $result['tenant']->slug);
    }

    public function test_creates_user_with_tenant_admin_role(): void
    {
        $result = $this->action->execute($this->validData());

        $user = $result['user'];

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Admin User', $user->name);
        $this->assertEquals('admin@masjid.test', $user->email);
        $this->assertTrue($user->hasRole('tenant_admin'));
    }

    public function test_creates_free_subscription_with_quota(): void
    {
        $result = $this->action->execute($this->validData());

        $subscription = Subscription::where('tenant_id', $result['tenant']->id)->first();

        $this->assertNotNull($subscription);
        $this->assertEquals('free', $subscription->plan);
        $this->assertEquals(SubscriptionStatus::Active, $subscription->status);
        $this->assertEquals(100, $subscription->coupon_quota);
        $this->assertEquals(0, $subscription->coupon_used);
    }

    public function test_all_three_models_exist_in_database(): void
    {
        $result = $this->action->execute($this->validData());

        $this->assertDatabaseHas('tenants', [
            'id' => $result['tenant']->id,
            'name' => 'Masjid Al-Ikhlas',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $result['user']->id,
            'email' => 'admin@masjid.test',
            'tenant_id' => $result['tenant']->id,
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'tenant_id' => $result['tenant']->id,
            'plan' => 'free',
            'status' => 'active',
        ]);
    }

    public function test_user_belongs_to_created_tenant(): void
    {
        $result = $this->action->execute($this->validData());

        $this->assertEquals($result['tenant']->id, $result['user']->tenant_id);
    }
}
