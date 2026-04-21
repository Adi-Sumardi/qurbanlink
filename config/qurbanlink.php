<?php

return [

    'name' => env('APP_NAME', 'QurbanLink'),

    'qr' => [
        'hmac_secret' => env('QRCODE_HMAC_SECRET', 'change-this-in-production'),
        'payload_version' => 1,
        'error_correction' => 'M', // L, M, Q, H
        'size' => 300, // pixels
    ],

    'coupon' => [
        'prefix' => env('COUPON_PREFIX', 'QRB'),
        'expires_after_days' => 30,
    ],

    'scan' => [
        'offline_sync_max_age_hours' => 48,
        'duplicate_scan_window_seconds' => 5,
    ],

    'subscription' => [
        'grace_period_days' => 7,
        'payment_expiry_hours' => 24,
        'moota' => [
            'webhook_secret' => env('MOOTA_WEBHOOK_SECRET'),
            'api_token' => env('MOOTA_API_TOKEN'),
            'bank_id' => env('MOOTA_BANK_ID'),
        ],
    ],

    'pagination' => [
        'default_per_page' => 15,
        'max_per_page' => 100,
    ],

];
