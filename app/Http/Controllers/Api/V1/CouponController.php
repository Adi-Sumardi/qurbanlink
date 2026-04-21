<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\CouponStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\CouponPrintResource;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Models\Event;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * List coupons for an event, paginated with recipient. Filter by status.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        $query = $event->coupons()->with('recipient');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $coupons = $query->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(CouponResource::collection($coupons)->response()->getData(true), 'Coupons retrieved successfully.');
    }

    /**
     * Generate coupons for recipients.
     */
    public function generate(Request $request, Event $event): JsonResponse
    {
        $request->validate([
            'generate_all' => ['sometimes', 'boolean'],
            'recipient_ids' => ['required_without:generate_all', 'array', 'min:1'],
            'recipient_ids.*' => ['exists:recipients,id'],
        ]);

        if ($request->boolean('generate_all')) {
            // Get all recipients without coupons
            $recipientIds = $event->recipients()
                ->whereDoesntHave('coupons')
                ->pluck('id')
                ->toArray();
        } else {
            $recipientIds = $request->input('recipient_ids');
        }

        if (empty($recipientIds)) {
            return $this->success(['generated' => 0], 'Semua penerima sudah memiliki kupon.');
        }

        $qrService = app(QrCodeService::class);
        $coupons = $qrService->generateCouponsForRecipients($event, $recipientIds);

        return $this->success(
            ['generated' => count($coupons)],
            count($coupons) . ' kupon berhasil di-generate.'
        );
    }

    /**
     * Return print-ready coupon data with QR payloads.
     */
    public function print(Event $event): JsonResponse
    {
        $event->loadMissing('tenant');

        $coupons = $event->coupons()
            ->with('recipient')
            ->where('status', CouponStatus::Generated)
            ->orderBy('coupon_number')
            ->get();

        if ($coupons->isEmpty()) {
            return $this->error('Tidak ada kupon yang siap dicetak.', 404);
        }

        return $this->success([
            'event' => [
                'name' => $event->name,
                'event_date' => $event->event_date?->format('Y-m-d'),
                'year' => $event->year,
            ],
            'tenant' => [
                'name' => $event->tenant->name,
                'city' => $event->tenant->city,
                'address' => $event->tenant->address,
            ],
            'coupons' => CouponPrintResource::collection($coupons),
            'total' => $coupons->count(),
        ], 'Print data retrieved successfully.');
    }

    /**
     * Void a coupon.
     */
    public function void(Request $request, Event $event, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'void_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $coupon->update([
            'status' => CouponStatus::Voided,
            'voided_at' => now(),
            'void_reason' => $validated['void_reason'] ?? null,
        ]);

        return $this->success(new CouponResource($coupon->fresh()->load('recipient')), 'Coupon voided successfully.');
    }

    /**
     * Regenerate a coupon (placeholder).
     */
    public function regenerate(Event $event, Coupon $coupon): JsonResponse
    {
        // TODO: Implement actual coupon regeneration with QR service
        return $this->success(null, 'Coupon regeneration initiated successfully.');
    }
}
