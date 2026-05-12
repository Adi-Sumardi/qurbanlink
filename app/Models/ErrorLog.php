<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ErrorLog extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'method',
        'url',
        'route',
        'status_code',
        'exception_class',
        'message',
        'stack_trace',
        'request_data',
        'ip_address',
        'user_agent',
        'user_id',
        'environment',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'request_data' => 'array',
            'occurred_at'  => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
