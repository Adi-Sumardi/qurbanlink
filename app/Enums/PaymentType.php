<?php

namespace App\Enums;

enum PaymentType: string
{
    case Subscription = 'subscription';
    case AddonCoupon = 'addon_coupon';
}
