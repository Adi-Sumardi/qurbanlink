<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Scan\ProcessScanAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScanResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    public function __construct(
        private ProcessScanAction $processScan,
    ) {}

    /**
     * Scan a coupon via QR payload.
     */
    public function scan(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'qr_payload' => ['required', 'string'],
            'location_id' => ['nullable', 'uuid'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'device_info' => ['nullable', 'string', 'max:500'],
        ]);

        $result = $this->processScan->execute($event, $request->user(), [
            'method' => 'qr',
            'qr_payload' => $request->input('qr_payload'),
            'location_id' => $request->input('location_id'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'device_info' => $request->input('device_info'),
        ]);

        $scan = $result['scan'];

        return $this->success(new ScanResource($scan), 'Scan processed successfully.');
    }

    /**
     * Manual scan via coupon number.
     */
    public function manualScan(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'coupon_number' => ['required', 'string', 'max:20'],
            'location_id' => ['nullable', 'uuid'],
        ]);

        $result = $this->processScan->execute($event, $request->user(), [
            'method' => 'manual',
            'coupon_number' => strtoupper($request->input('coupon_number')),
            'location_id' => $request->input('location_id'),
        ]);

        $scan = $result['scan'];

        return $this->success(new ScanResource($scan), 'Manual scan processed successfully.');
    }

    /**
     * List scans for an event, paginated with coupon, scanner, and location.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        $query = $event->scans()->with(['coupon.recipient', 'scanner', 'location']);

        if ($request->has('scan_result')) {
            $query->where('scan_result', $request->input('scan_result'));
        }

        $scans = $query->latest('scanned_at')->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(ScanResource::collection($scans)->response()->getData(true), 'Scans retrieved successfully.');
    }

    /**
     * Sync offline scans.
     */
    public function sync(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'scans' => ['required', 'array', 'min:1'],
            'scans.*.qr_payload' => ['required', 'string'],
            'scans.*.scanned_at' => ['required', 'date'],
            'scans.*.latitude' => ['nullable', 'numeric'],
            'scans.*.longitude' => ['nullable', 'numeric'],
            'scans.*.device_info' => ['nullable', 'string'],
        ]);

        $synced = 0;
        $errors = [];

        foreach ($request->input('scans') as $i => $scanData) {
            try {
                $this->processScan->execute($event, $request->user(), [
                    'method' => 'qr',
                    'qr_payload' => $scanData['qr_payload'],
                    'latitude' => $scanData['latitude'] ?? null,
                    'longitude' => $scanData['longitude'] ?? null,
                    'device_info' => $scanData['device_info'] ?? null,
                ]);
                $synced++;
            } catch (\Throwable $e) {
                $errors[] = "Scan #{$i}: {$e->getMessage()}";
            }
        }

        return $this->success([
            'synced' => $synced,
            'errors' => $errors,
        ], "{$synced} scan(s) synced successfully.");
    }
}
