<?php

namespace App\Events;

use App\Http\Resources\ScanResource;
use App\Models\Scan;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CouponScanned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Scan $scan,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("tenant.{$this->scan->tenant_id}.event.{$this->scan->event_id}.scans"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'coupon.scanned';
    }

    public function broadcastWith(): array
    {
        $this->scan->load(['coupon.recipient', 'scanner', 'location']);

        return [
            'scan' => new ScanResource($this->scan),
        ];
    }
}
