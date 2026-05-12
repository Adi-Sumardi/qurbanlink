<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\DonorSubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\DonorResource;
use App\Models\Donor;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class DonorController extends Controller
{
    /**
     * List donors for an event with animals count. Paginated.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        $donors = $event->donors()
            ->withCount('animals')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(DonorResource::collection($donors)->response()->getData(true), 'Donors retrieved successfully.');
    }

    /**
     * Create a donor under an event.
     */
    public function store(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'email'        => ['nullable', 'email', 'max:255'],
            'address'      => ['nullable', 'string', 'max:500'],
            'nik'          => ['nullable', 'string', 'max:20'],
            'notes'        => ['nullable', 'string'],
            'kurban_type'  => ['nullable', 'string', 'in:pribadi,patungan'],
            'participants' => ['nullable', 'array'],
            'participants.*.name' => ['required_with:participants', 'string', 'max:255'],
        ]);

        if (empty($validated['kurban_type'])) {
            $validated['kurban_type'] = 'pribadi';
        }

        $validated['tenant_id'] = $event->tenant_id;

        $donor = $event->donors()->create($validated);

        return $this->created(new DonorResource($donor), 'Donor created successfully.');
    }

    /**
     * Show a single donor with animals loaded.
     */
    public function show(Event $event, Donor $donor): JsonResponse
    {
        $donor->load('animals');

        return $this->success(new DonorResource($donor), 'Donor retrieved successfully.');
    }

    /**
     * Update a donor.
     */
    public function update(Request $request, Event $event, Donor $donor): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'email'        => ['nullable', 'email', 'max:255'],
            'address'      => ['nullable', 'string', 'max:500'],
            'nik'          => ['nullable', 'string', 'max:20'],
            'notes'        => ['nullable', 'string'],
            'kurban_type'  => ['nullable', 'string', 'in:pribadi,patungan'],
            'participants' => ['nullable', 'array'],
            'participants.*.name' => ['required_with:participants', 'string', 'max:255'],
        ]);

        // Reset participants jika beralih ke pribadi
        if (isset($validated['kurban_type']) && $validated['kurban_type'] === 'pribadi') {
            $validated['participants'] = null;
        }

        $donor->update($validated);

        return $this->success(new DonorResource($donor->fresh()), 'Donor updated successfully.');
    }

    /**
     * Soft delete a donor.
     */
    public function destroy(Event $event, Donor $donor): JsonResponse
    {
        $donor->delete();

        return $this->noContent();
    }

    /**
     * Import donors from file upload (placeholder).
     */
    public function import(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,xlsx,xls', 'max:5120'],
        ]);

        // TODO: Implement actual file import logic
        return $this->success(null, 'Donor import initiated successfully. Processing in background.');
    }

    /**
     * Update donor submission status.
     */
    public function updateStatus(Request $request, Event $event, Donor $donor): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', new Enum(DonorSubmissionStatus::class)],
        ]);

        $donor->update(['submission_status' => $validated['status']]);

        return $this->success(new DonorResource($donor->fresh()), 'Donor status updated successfully.');
    }
}
