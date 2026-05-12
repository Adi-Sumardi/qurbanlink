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

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak terdaftar. Pastikan Anda menggunakan email yang benar.'],
            ]);
        }

        if (! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Kata sandi salah. Silakan coba lagi atau gunakan Lupa Kata Sandi.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda telah dinonaktifkan. Hubungi administrator untuk bantuan.'],
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
