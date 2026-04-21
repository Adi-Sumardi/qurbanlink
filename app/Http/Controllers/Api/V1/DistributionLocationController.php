<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DistributionLocationResource;
use App\Models\DistributionLocation;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DistributionLocationController extends Controller
{
    /**
     * List locations for an event.
     */
    public function index(Event $event): JsonResponse
    {
        $locations = $event->distributionLocations()->get();

        return $this->success(DistributionLocationResource::collection($locations), 'Distribution locations retrieved successfully.');
    }

    /**
     * Create a location under an event.
     */
    public function store(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $location = $event->distributionLocations()->create($validated);

        return $this->created(new DistributionLocationResource($location), 'Distribution location created successfully.');
    }

    /**
     * Show a single location.
     */
    public function show(Event $event, DistributionLocation $location): JsonResponse
    {
        return $this->success(new DistributionLocationResource($location), 'Distribution location retrieved successfully.');
    }

    /**
     * Update a location.
     */
    public function update(Request $request, Event $event, DistributionLocation $location): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $location->update($validated);

        return $this->success(new DistributionLocationResource($location->fresh()), 'Distribution location updated successfully.');
    }

    /**
     * Delete a location.
     */
    public function destroy(Event $event, DistributionLocation $location): JsonResponse
    {
        $location->delete();

        return $this->noContent();
    }
}
