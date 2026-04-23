<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://app.tawzii.id',
        env('FRONTEND_URL'),
    ]),

    // Wildcard patterns (regex) — covers Cloudflare Tunnel and ngrok subdomains
    'allowed_origins_patterns' => [
        '#^https://[a-zA-Z0-9\-]+\.trycloudflare\.com$#',
        '#^https?://[a-zA-Z0-9\-]+\.ngrok-free\.app$#',
        '#^https?://[a-zA-Z0-9\-]+\.ngrok\.io$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
