<?php

namespace App\Http\Resources;

use App\Enums\PaymentStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        // Support both PHP enum object and raw string value
        $statusValue = $this->status instanceof \BackedEnum
            ? $this->status->value
            : (string) $this->status;

        $paymentTypeValue = $this->payment_type instanceof \BackedEnum
            ? $this->payment_type->value
            : (string) $this->payment_type;

        $isPending = $statusValue === PaymentStatus::Pending->value;

        return [
            'id'                => $this->id,
            'payment_type'      => $paymentTypeValue,
            'amount'            => (float) $this->amount,
            'currency'          => $this->currency ?? 'IDR',
            'status'            => $statusValue,
            'payment_method'    => $this->payment_method,
            'invoice_number'    => $this->invoice_number,
            'invoice_url'       => $this->invoice_url,
            'paid_at'           => $this->paid_at?->toIso8601String(),
            'expired_at'        => $this->expired_at?->toIso8601String(),
            'created_at'        => $this->created_at?->toIso8601String(),
            // Only expose Snap fields for pending payments (allows frontend to resume)
            'snap_token'        => $isPending ? $this->snap_token : null,
            'snap_redirect_url' => $isPending ? $this->snap_redirect_url : null,
        ];
    }
}
