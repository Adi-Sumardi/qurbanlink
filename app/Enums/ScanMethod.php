<?php

namespace App\Enums;

enum ScanMethod: string
{
    case Qr = 'qr';
    case Manual = 'manual';
}
