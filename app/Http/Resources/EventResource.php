<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'tenant_slug' => $this->tenant?->slug,
            'name' => $this->name,
            'description' => $this->description,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'year' => $this->year,
            'status' => $this->status,
            'settings' => $this->settings,
            'total_coupons' => $this->total_coupons,
            'distributed' => $this->distributed,
            'locations' => DistributionLocationResource::collection($this->whenLoaded('locations')),
            'created_by' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
