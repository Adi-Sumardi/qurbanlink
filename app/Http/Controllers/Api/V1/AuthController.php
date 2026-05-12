<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\RegisterAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request, RegisterAction $action): JsonResponse
    {
        // ── Layer 4: Rate limiting per IP (3/menit) + per email (1/jam) ──
        $ipKey    = 'register-ip:' . $request->ip();
        $emailKey = 'register-email:' . strtolower((string) $request->input('email'));

        if (RateLimiter::tooManyAttempts($ipKey, 3)) {
            $seconds = RateLimiter::availableIn($ipKey);
            return $this->error("Terlalu banyak percobaan registrasi. Coba lagi dalam {$seconds} detik.", 429);
        }
        if (RateLimiter::tooManyAttempts($emailKey, 1)) {
            return $this->error('Email ini sudah pernah didaftarkan baru-baru ini. Tunggu 1 jam atau gunakan email lain.', 429);
        }
        RateLimiter::hit($ipKey, 60);          // 60 detik = 1 menit
        RateLimiter::hit($emailKey, 3600);     // 3600 detik = 1 jam

        // ── Layer 1: Honeypot — bot akan isi field tersembunyi ini ──
        if (!empty($request->input('website'))) {
            Log::info('Register honeypot triggered', [
                'ip'    => $request->ip(),
                'email' => $request->input('email'),
            ]);
            return $this->error('Pendaftaran gagal.', 400);
        }

        // ── Layer 2: Minimum-time — bot biasanya submit < 2s setelah form load ──
        $formStartedAt = (int) $request->input('form_started_at', 0);
        if ($formStartedAt > 0) {
            $elapsedMs = (now()->valueOf() - $formStartedAt);
            if ($elapsedMs < 2_000) {
                Log::info('Register submitted too fast (likely bot)', [
                    'ip'         => $request->ip(),
                    'email'      => $request->input('email'),
                    'elapsed_ms' => $elapsedMs,
                ]);
                return $this->error('Pendaftaran gagal. Mohon ulangi.', 400);
            }
        }

        $data = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'email'             => [
                'required', 'string', 'email:rfc', 'max:255',
                'unique:users,email',
                new \App\Rules\NotDisposableEmail(),
            ],
            'password'          => ['required', 'confirmed', Rules\Password::defaults()],
            'organization_name' => ['required', 'string', 'max:255'],
            'phone'             => ['nullable', 'string', 'max:20'],
            'city'              => ['nullable', 'string', 'max:100'],
            'province'          => ['nullable', 'string', 'max:100'],
            'event_name'        => ['required', 'string', 'max:255'],
            'event_date'        => ['required', 'date', 'after_or_equal:today'],
            'event_description' => ['nullable', 'string', 'max:1000'],
        ]);

        $result = $action->execute($data);
        $result['user']->sendEmailVerificationNotification();

        $token = $result['user']->createToken('auth-token', ['*'], now()->addDays(7))->plainTextToken;
        $result['user']->load(['tenant', 'roles', 'permissions']);

        return $this->created([
            'user'     => new UserResource($result['user']),
            'token'    => $token,
            'event_id' => $result['event']->id,
        ], 'Registration successful. Please verify your email.');
    }

    public function login(Request $request, LoginAction $action): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Brute-force protection: 5 attempts per minute per IP+email combo
        $key = 'login:' . Str::lower($request->input('email')) . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ["Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik."],
            ]);
        }

        try {
            $result = $action->execute($request->email, $request->password);
            RateLimiter::clear($key); // Reset on success

            return $this->success([
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ]);
        } catch (ValidationException $e) {
            RateLimiter::hit($key, 60);
            throw $e;
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load(['tenant', 'roles', 'permissions']);

        return $this->success(new UserResource($user));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);
        $user->load(['tenant', 'roles', 'permissions']);

        return $this->success(new UserResource($user), 'Profile updated successfully.');
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => $request->input('password'),
        ]);

        return $this->success(null, 'Password changed successfully.');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            $status = Password::sendResetLink($request->only('email'));
        } catch (\Throwable $e) {
            \Log::error('Forgot password error: ' . $e->getMessage());
            return $this->error('Gagal mengirim email: ' . $e->getMessage(), 500);
        }

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(null, 'Password reset link sent to your email.');
        }

        return $this->error(__($status), 422);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => $password])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password has been reset successfully.');
        }

        return $this->error(__($status), 422);
    }

    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = \App\Models\User::findOrFail($id);

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return $this->error('Invalid verification link.', 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->success(null, 'Email verified successfully.');
    }

    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->success(null, 'Email already verified.');
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->success(null, 'Verification email sent.');
    }
}
