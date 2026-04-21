<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sanitizes all incoming string inputs:
 * - Trims whitespace
 * - Converts empty strings to null
 * - Strips null bytes (prevent injection)
 */
class SanitizeInput
{
    private array $except = ['password', 'password_confirmation', 'current_password'];

    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();
        $request->replace($this->sanitize($input));

        return $next($request);
    }

    private function sanitize(array $input): array
    {
        foreach ($input as $key => $value) {
            if (in_array($key, $this->except, true)) {
                continue;
            }

            if (is_array($value)) {
                $input[$key] = $this->sanitize($value);
            } elseif (is_string($value)) {
                $trimmed = trim(str_replace("\0", '', $value));
                $input[$key] = $trimmed === '' ? null : $trimmed;
            }
        }

        return $input;
    }
}
