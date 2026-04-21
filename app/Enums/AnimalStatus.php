<?php

namespace App\Enums;

enum AnimalStatus: string
{
    case Registered = 'registered';
    case Slaughtered = 'slaughtered';
    case Processed = 'processed';
    case Distributed = 'distributed';
}
