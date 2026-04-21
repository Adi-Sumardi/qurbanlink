<?php

namespace App\Jobs;

use App\Models\Event;
use App\Services\QrCodeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateBatchQrCodes implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        public Event $event,
        public array $recipientIds,
    ) {
        $this->onQueue('high');
    }

    public function handle(QrCodeService $qrCodeService): void
    {
        $qrCodeService->generateCouponsForRecipients($this->event, $this->recipientIds);
    }
}
