<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$clientKey    = config('midtrans.client_key');
        Config::$isProduction = config('midtrans.is_production', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    /**
     * Create a Snap payment token.
     *
     * @param  array{
     *   order_id: string,
     *   amount: int,
     *   first_name: string,
     *   email: string,
     *   plan_name: string,
     *   billing_cycle: string,
     * } $params
     */
    public function createSnapToken(array $params): object
    {
        $payload = [
            'transaction_details' => [
                'order_id'     => $params['order_id'],
                'gross_amount' => $params['amount'],
            ],
            'item_details' => [
                [
                    'id'       => $params['order_id'],
                    'price'    => $params['amount'],
                    'quantity' => 1,
                    'name'     => "Langganan {$params['plan_name']} ({$params['billing_cycle']})",
                ],
            ],
            'customer_details' => [
                'first_name' => $params['first_name'],
                'email'      => $params['email'],
            ],
            'callbacks' => [
                'finish' => config('app.frontend_url') . '/subscription?payment=finish',
            ],
            'expiry' => [
                'unit'     => 'hours',
                'duration' => 24,
            ],
            'enabled_payments' => [
                'credit_card', 'bank_transfer', 'bca_va', 'bni_va', 'bri_va',
                'mandiri_va', 'permata_va', 'gopay', 'shopeepay', 'qris',
            ],
        ];

        return Snap::createTransaction($payload);
    }

    /**
     * Verify and parse an incoming Midtrans notification.
     */
    public function parseNotification(): Notification
    {
        return new Notification();
    }

    /**
     * Returns true if the notification signature is valid.
     */
    public function isSignatureValid(string $orderId, string $statusCode, string $grossAmount, string $serverSignature): bool
    {
        $expected = hash('sha512', $orderId . $statusCode . $grossAmount . Config::$serverKey);
        return hash_equals($expected, $serverSignature);
    }
}
