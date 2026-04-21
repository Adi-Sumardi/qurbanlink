<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AnimalStatus;
use App\Enums\AnimalType;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnimalResource;
use App\Models\Animal;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class AnimalController extends Controller
{
    /**
     * List animals for an event with donor loaded. Paginated.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        $animals = $event->animals()
            ->with('donor')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(AnimalResource::collection($animals)->response()->getData(true), 'Animals retrieved successfully.');
    }

    /**
     * Create an animal under an event.
     */
    public function store(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', new Enum(AnimalType::class)],
            'breed' => ['nullable', 'string', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:50'],
            'estimated_portions' => ['nullable', 'integer', 'min:1'],
            'donor_id' => ['nullable', 'exists:donors,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['tenant_id'] = $event->tenant_id;

        $animal = $event->animals()->create($validated);

        return $this->created(new AnimalResource($animal->load('donor')), 'Animal created successfully.');
    }

    /**
     * Show a single animal with donor loaded.
     */
    public function show(Event $event, Animal $animal): JsonResponse
    {
        $animal->load('donor');

        return $this->success(new AnimalResource($animal), 'Animal retrieved successfully.');
    }

    /**
     * Update an animal.
     */
    public function update(Request $request, Event $event, Animal $animal): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['sometimes', new Enum(AnimalType::class)],
            'breed' => ['nullable', 'string', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:50'],
            'estimated_portions' => ['nullable', 'integer', 'min:1'],
            'donor_id' => ['nullable', 'exists:donors,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $animal->update($validated);

        return $this->success(new AnimalResource($animal->fresh()->load('donor')), 'Animal updated successfully.');
    }

    /**
     * Soft delete an animal.
     */
    public function destroy(Event $event, Animal $animal): JsonResponse
    {
        $animal->delete();

        return $this->noContent();
    }

    /**
     * Update animal status.
     */
    public function updateStatus(Request $request, Event $event, Animal $animal): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', new Enum(AnimalStatus::class)],
        ]);

        $animal->update(['status' => $validated['status']]);

        return $this->success(new AnimalResource($animal->fresh()->load('donor')), 'Animal status updated successfully.');
    }
}
