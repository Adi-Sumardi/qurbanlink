<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AnimalResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'breed' => $this->breed,
            'weight' => $this->weight,
            'color' => $this->color,
            'estimated_portions' => $this->estimated_portions,
            'status' => $this->status,
            'slaughtered_at' => $this->slaughtered_at,
            'photo_path' => $this->photo_path,
            'notes' => $this->notes,
            'donor' => new DonorResource($this->whenLoaded('donor')),
            'created_at' => $this->created_at,
        ];
    }
}
