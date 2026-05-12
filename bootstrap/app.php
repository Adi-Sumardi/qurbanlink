<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'tenant'            => \App\Http\Middleware\ResolveTenant::class,
            'public-tenant'     => \App\Http\Middleware\ResolvePublicTenant::class,
            'check-subscription'=> \App\Http\Middleware\CheckSubscription::class,
            'check-feature'     => \App\Http\Middleware\CheckFeature::class,
            'check-coupon-quota'=> \App\Http\Middleware\CheckCouponQuota::class,
            'role'              => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission'        => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission'=> \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'security.headers'  => \App\Http\Middleware\SecurityHeaders::class,
            'sanitize'          => \App\Http\Middleware\SanitizeInput::class,
        ]);

        // CORS must run before any other middleware so preflight OPTIONS requests are handled
        $middleware->prependToGroup('api', \Illuminate\Http\Middleware\HandleCors::class);

        // Apply globally to all API requests
        $middleware->appendToGroup('api', [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\SanitizeInput::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function ($request) {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        });

        $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have the required permissions.',
                ], 403);
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found.',
                ], 404);
            }
        });

        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        // Log all API errors to error_logs table for monitoring
        $exceptions->report(function (\Throwable $e) {
            try {
                $request    = request();
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                // Skip validation errors and auth errors from being stored
                if ($e instanceof \Illuminate\Validation\ValidationException) return false;
                if ($statusCode === 401 || $statusCode === 403) return false;

                \App\Models\ErrorLog::create([
                    'method'          => $request->method(),
                    'url'             => $request->fullUrl(),
                    'route'           => optional($request->route())->getName() ?? $request->path(),
                    'status_code'     => $statusCode,
                    'exception_class' => get_class($e),
                    'message'         => $e->getMessage(),
                    'stack_trace'     => $e->getTraceAsString(),
                    'request_data'    => $request->except(['password', 'password_confirmation', 'current_password']),
                    'ip_address'      => $request->ip(),
                    'user_agent'      => $request->userAgent(),
                    'user_id'         => auth()->id(),
                    'environment'     => app()->environment(),
                    'occurred_at'     => now(),
                ]);
            } catch (\Throwable) {
                // Silently fail — never let logging break the app
            }
        });
    })->create();
