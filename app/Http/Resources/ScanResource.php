<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ScanResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'scan_method' => $this->scan_method,
            'scan_result' => $this->scan_result,
            'device_info' => $this->device_info,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'scanned_at' => $this->scanned_at,
            'synced_at' => $this->synced_at,
            'scanned_by' => new UserResource($this->whenLoaded('scanner')),
            'coupon' => new CouponResource($this->whenLoaded('coupon')),
            'location' => new DistributionLocationResource($this->whenLoaded('location')),
        ];
    }
}
