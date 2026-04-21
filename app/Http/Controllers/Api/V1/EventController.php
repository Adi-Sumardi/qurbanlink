<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * List events for current tenant, paginated.
     */
    public function index(Request $request): JsonResponse
    {
        $events = Event::withCount('distributionLocations')
            ->latest('event_date')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(EventResource::collection($events)->response()->getData(true), 'Events retrieved successfully.');
    }

    /**
     * Create a new event.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'settings' => ['nullable', 'array'],
        ]);

        $validated['tenant_id'] = app()->has('current_tenant') ? app('current_tenant')->id : $request->user()->tenant_id;
        $validated['created_by'] = $request->user()->id;
        $validated['year'] = Carbon::parse($validated['event_date'])->year;
        $validated['status'] = EventStatus::Draft;

        $event = Event::create($validated);

        return $this->created(new EventResource($event), 'Event created successfully.');
    }

    /**
     * Show a single event with locations loaded.
     */
    public function show(Event $event): JsonResponse
    {
        $event->load('distributionLocations');

        return $this->success(new EventResource($event), 'Event retrieved successfully.');
    }

    /**
     * Update an event.
     */
    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'event_date' => ['sometimes', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'settings' => ['nullable', 'array'],
        ]);

        if (isset($validated['event_date'])) {
            $validated['year'] = Carbon::parse($validated['event_date'])->year;
        }

        $event->update($validated);

        return $this->success(new EventResource($event->fresh()), 'Event updated successfully.');
    }

    /**
     * Soft delete an event. Only if status is 'draft'.
     */
    public function destroy(Event $event): JsonResponse
    {
        if ($event->status !== EventStatus::Draft) {
            return $this->error('Only draft events can be deleted.', 422);
        }

        $event->delete();

        return $this->noContent();
    }

    /**
     * Set event status to 'active'. Only if currently 'draft'.
     */
    public function activate(Event $event): JsonResponse
    {
        if ($event->status !== EventStatus::Draft) {
            return $this->error('Only draft events can be activated.', 422);
        }

        $event->update(['status' => EventStatus::Active]);

        return $this->success(new EventResource($event->fresh()), 'Event activated successfully.');
    }

    /**
     * Set event status to 'completed'. Only if 'active' or 'ongoing'.
     */
    public function complete(Event $event): JsonResponse
    {
        if (!in_array($event->status, [EventStatus::Active, EventStatus::Ongoing])) {
            return $this->error('Only active or ongoing events can be completed.', 422);
        }

        $event->update(['status' => EventStatus::Completed]);

        return $this->success(new EventResource($event->fresh()), 'Event completed successfully.');
    }
}
