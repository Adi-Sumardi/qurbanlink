<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Cloudflare Turnstile token validator.
 *
 * Verifies the captcha token by POSTing to Cloudflare's siteverify endpoint.
 * Skips validation if TURNSTILE_REQUIRED=false (useful for local dev/tests).
 *
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
class TurnstileValid implements ValidationRule
{
    public function __construct(
        private readonly ?Request $request = null
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!config('services.turnstile.required', true)) {
            return;
        }

        $secret = config('services.turnstile.secret_key');
        if (empty($secret)) {
            Log::warning('Turnstile secret key not configured — skipping verification');
            return;
        }

        if (empty($value) || !is_string($value)) {
            $fail('Verifikasi captcha gagal. Silakan refresh halaman.');
            return;
        }

        // Fallback token sent by frontend when the Turnstile widget fails to
        // render due to browser/CSP constraints (Cloudflare internal bug).
        // Fail-open: log the event and skip remote verification.
        // Rate limiting on login/register still protects against brute force.
        if ($value === 'TURNSTILE_WIDGET_ERROR') {
            Log::info('Turnstile fallback token used — widget render failed on client', [
                'ip' => $this->request?->ip() ?? request()->ip(),
            ]);
            return;
        }


        try {
            $response = Http::asForm()->timeout(5)->post(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                [
                    'secret'   => $secret,
                    'response' => $value,
                    'remoteip' => $this->request?->ip() ?? request()->ip(),
                ]
            );

            $data = $response->json();

            if (!($data['success'] ?? false)) {
                Log::warning('Turnstile verification failed', [
                    'errors' => $data['error-codes'] ?? [],
                    'ip'     => $this->request?->ip() ?? request()->ip(),
                ]);
                $fail('Verifikasi captcha gagal. Silakan coba lagi.');
            }
        } catch (\Throwable $e) {
            Log::error('Turnstile API error', ['message' => $e->getMessage()]);
            // Fail-open: kalau Cloudflare API down, jangan blokir user
            // (alternatif: $fail(...) untuk fail-closed)
        }
    }
}
