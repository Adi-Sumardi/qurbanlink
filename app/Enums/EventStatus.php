<?php

namespace App\Enums;

enum EventStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
    case Archived = 'archived';
}
