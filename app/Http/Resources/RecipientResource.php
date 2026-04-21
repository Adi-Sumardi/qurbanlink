<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RecipientResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'nik' => $this->nik,
            'phone' => $this->phone,
            'address' => $this->address,
            'rt_rw' => $this->rt_rw,
            'kelurahan' => $this->kelurahan,
            'kecamatan' => $this->kecamatan,
            'category' => $this->category,
            'portions' => $this->portions,
            'notes' => $this->notes,
            'coupons' => CouponResource::collection($this->whenLoaded('coupons')),
            'created_at' => $this->created_at,
        ];
    }
}
