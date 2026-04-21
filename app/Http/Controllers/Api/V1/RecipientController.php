<?php

namespace App\Http\Controllers\Api\V1;

use App\Exports\RecipientsExport;
use App\Exports\RecipientsTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\RecipientResource;
use App\Imports\RecipientsImport;
use App\Models\Event;
use App\Models\Recipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RecipientController extends Controller
{
    /**
     * List recipients for an event with coupons count. Paginated. Filter by category.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        $query = $event->recipients()->withCount('coupons');

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $recipients = $query->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(RecipientResource::collection($recipients)->response()->getData(true), 'Recipients retrieved successfully.');
    }

    /**
     * Create a recipient under an event.
     */
    public function store(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'rt_rw' => ['nullable', 'string', 'max:20'],
            'kelurahan' => ['nullable', 'string', 'max:100'],
            'kecamatan' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'portions' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['tenant_id'] = $event->tenant_id;

        $recipient = $event->recipients()->create($validated);

        return $this->created(new RecipientResource($recipient), 'Recipient created successfully.');
    }

    /**
     * Show a single recipient with coupons loaded.
     */
    public function show(Event $event, Recipient $recipient): JsonResponse
    {
        $recipient->load('coupons');

        return $this->success(new RecipientResource($recipient), 'Recipient retrieved successfully.');
    }

    /**
     * Update a recipient.
     */
    public function update(Request $request, Event $event, Recipient $recipient): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'rt_rw' => ['nullable', 'string', 'max:20'],
            'kelurahan' => ['nullable', 'string', 'max:100'],
            'kecamatan' => ['nullable', 'string', 'max:100'],
            'category' => ['sometimes', 'string', 'max:50'],
            'portions' => ['nullable', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        $recipient->update($validated);

        return $this->success(new RecipientResource($recipient->fresh()), 'Recipient updated successfully.');
    }

    /**
     * Soft delete a recipient.
     */
    public function destroy(Event $event, Recipient $recipient): JsonResponse
    {
        $recipient->delete();

        return $this->noContent();
    }

    /**
     * Import recipients from CSV/Excel file.
     */
    public function import(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,xlsx,xls', 'max:5120'],
        ]);

        $import = new RecipientsImport($event);
        Excel::import($import, $request->file('file'));

        $errorCount = count($import->errors());

        return $this->success([
            'imported' => $import->imported,
            'errors'   => collect($import->errors())->map(fn($e) => $e->getMessage())->values()->toArray(),
        ], "{$import->imported} penerima berhasil diimpor.");
    }

    /**
     * Export recipients as Excel file.
     */
    public function export(Event $event): BinaryFileResponse
    {
        $filename = 'penerima-' . str($event->name)->slug() . '-' . now()->format('Ymd') . '.xlsx';

        return Excel::download(new RecipientsExport($event), $filename);
    }

    /**
     * Download blank import template.
     */
    public function template(): BinaryFileResponse
    {
        return Excel::download(new RecipientsTemplateExport(), 'template-import-penerima.xlsx');
    }

    /**
     * Check for duplicate recipients within an event by name and NIK.
     */
    public function checkDuplicates(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
        ]);

        $query = $event->recipients()->where('name', $validated['name']);

        if (!empty($validated['nik'])) {
            $query->orWhere(function ($q) use ($event, $validated) {
                $q->where('event_id', $event->id)
                  ->where('nik', $validated['nik']);
            });
        }

        $duplicates = $query->get();

        return $this->success([
            'has_duplicates' => $duplicates->isNotEmpty(),
            'duplicates' => RecipientResource::collection($duplicates),
        ], 'Duplicate check completed.');
    }
}
