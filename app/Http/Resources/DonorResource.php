<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonorResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'nik' => $this->nik,
            'submission_status' => $this->submission_status,
            'notes' => $this->notes,
            'animals' => AnimalResource::collection($this->whenLoaded('animals')),
            'animals_count' => $this->whenCounted('animals'),
            'created_at' => $this->created_at,
        ];
    }
}
