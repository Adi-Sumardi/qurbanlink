<?php

namespace App\Models;

use App\Enums\CouponStatus;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Coupon extends Model
{
    use HasUuids, HasFactory, BelongsToTenant;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tenant_id',
        'event_id',
        'recipient_id',
        'coupon_number',
        'qr_payload',
        'qr_signature',
        'status',
        'generated_at',
        'claimed_at',
        'voided_at',
        'void_reason',
        'expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CouponStatus::class,
            'generated_at' => 'datetime',
            'claimed_at' => 'datetime',
            'voided_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the event that the coupon belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the recipient that the coupon belongs to.
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(Recipient::class);
    }

    /**
     * Get the successful scan for the coupon.
     */
    public function scan(): HasOne
    {
        return $this->hasOne(Scan::class);
    }

    /**
     * Get all scan attempts for the coupon.
     */
    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }
}
