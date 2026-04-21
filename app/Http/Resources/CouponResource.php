<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'coupon_number' => $this->coupon_number,
            'status' => $this->status,
            'generated_at' => $this->generated_at,
            'claimed_at' => $this->claimed_at,
            'voided_at' => $this->voided_at,
            'void_reason' => $this->void_reason,
            'expires_at' => $this->expires_at,
            'recipient' => new RecipientResource($this->whenLoaded('recipient')),
            'scan' => new ScanResource($this->whenLoaded('successScan')),
            'created_at' => $this->created_at,
        ];
    }
}
