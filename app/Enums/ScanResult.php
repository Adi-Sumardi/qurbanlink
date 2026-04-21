<?php

namespace App\Enums;

enum ScanResult: string
{
    case Success = 'success';
    case AlreadyClaimed = 'already_claimed';
    case Invalid = 'invalid';
    case Expired = 'expired';
    case Voided = 'voided';
}
