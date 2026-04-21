<?php

namespace App\Enums;

enum CouponStatus: string
{
    case Generated = 'generated';
    case Claimed = 'claimed';
    case Voided = 'voided';
    case Expired = 'expired';
}
