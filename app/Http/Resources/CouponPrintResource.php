<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponPrintResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'coupon_number' => $this->coupon_number,
            'qr_payload' => $this->qr_payload,
            'status' => $this->status,
            'expires_at' => $this->expires_at,
            'recipient' => $this->recipient ? [
                'name' => $this->recipient->name,
                'address' => $this->recipient->address,
                'rt_rw' => $this->recipient->rt_rw,
                'kelurahan' => $this->recipient->kelurahan,
                'kecamatan' => $this->recipient->kecamatan,
                'category' => $this->recipient->category,
                'portions' => $this->recipient->portions,
            ] : null,
        ];
    }
}
