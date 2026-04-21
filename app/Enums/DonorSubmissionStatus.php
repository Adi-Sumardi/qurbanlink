<?php

namespace App\Enums;

enum DonorSubmissionStatus: string
{
    case Pending = 'pending';
    case Submitted = 'submitted';
}
