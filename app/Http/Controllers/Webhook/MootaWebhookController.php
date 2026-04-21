<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MootaWebhookController extends Controller
{
    /**
     * Handle incoming Moota webhook (placeholder).
     */
    public function handle(Request $request): JsonResponse
    {
        // TODO: Validate webhook signature from Moota
        // TODO: Match payment by unique amount (moota_amount)
        // TODO: Update payment status and activate subscription if matched

        return response()->json(['status' => 'ok'], 200);
    }
}
