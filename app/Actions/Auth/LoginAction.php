<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginAction
{
    public function execute(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        // Update last login info
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        // Create token with 7-day expiry, named with user agent for traceability
        $deviceName = substr(request()->userAgent() ?? 'unknown', 0, 100);
        $token = $user->createToken($deviceName, ['*'], now()->addDays(7))->plainTextToken;

        // Load relations
        $user->load(['tenant', 'roles', 'permissions']);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
