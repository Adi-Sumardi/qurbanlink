<?php

namespace Tests\Unit\Actions;

use App\Actions\Auth\LoginAction;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class LoginActionTest extends TestCase
{
    private LoginAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new LoginAction();
    }

    public function test_successful_login_returns_user_and_token(): void
    {
        $this->setupTenant();

        $user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email' => 'test@example.com',
            'password' => Hash::make('secret123'),
            'is_active' => true,
        ]);

        $result = $this->action->execute('test@example.com', 'secret123');

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertEquals($user->id, $result['user']->id);
        $this->assertIsString($result['token']);
    }

    public function test_wrong_password_throws_validation_exception(): void
    {
        $this->setupTenant();

        User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email' => 'test@example.com',
            'password' => Hash::make('secret123'),
            'is_active' => true,
        ]);

        $this->expectException(ValidationException::class);

        $this->action->execute('test@example.com', 'wrong-password');
    }

    public function test_nonexistent_email_throws_validation_exception(): void
    {
        $this->setupTenant();

        $this->expectException(ValidationException::class);

        $this->action->execute('nonexistent@example.com', 'secret123');
    }

    public function test_inactive_user_throws_validation_exception(): void
    {
        $this->setupTenant();

        User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email' => 'inactive@example.com',
            'password' => Hash::make('secret123'),
            'is_active' => false,
        ]);

        $this->expectException(ValidationException::class);

        $this->action->execute('inactive@example.com', 'secret123');
    }

    public function test_updates_last_login_at_on_successful_login(): void
    {
        $this->setupTenant();

        $user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email' => 'test@example.com',
            'password' => Hash::make('secret123'),
            'is_active' => true,
            'last_login_at' => null,
        ]);

        $this->action->execute('test@example.com', 'secret123');

        $user->refresh();
        $this->assertNotNull($user->last_login_at);
    }
}
