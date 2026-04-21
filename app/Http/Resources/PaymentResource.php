<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        $isPending = $this->status?->value === 'pending' || $this->status === 'pending';

        return [
            'id'               => $this->id,
            'payment_type'     => $this->payment_type,
            'amount'           => $this->amount,
            'currency'         => $this->currency,
            'status'           => $this->status,
            'payment_method'   => $this->payment_method,
            'invoice_number'   => $this->invoice_number,
            'invoice_url'      => $this->invoice_url,
            'paid_at'          => $this->paid_at,
            'expired_at'       => $this->expired_at,
            'created_at'       => $this->created_at,
            // Only expose snap fields for pending payments that haven't expired
            'snap_token'       => $isPending ? $this->snap_token : null,
            'snap_redirect_url'=> $isPending ? $this->snap_redirect_url : null,
        ];
    }
}
