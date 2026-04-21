<?php

namespace App\Enums;

enum SubscriptionPlan: string
{
    case Free = 'free';
    case Starter = 'starter';
    case Professional = 'professional';
    case Enterprise = 'enterprise';
}
