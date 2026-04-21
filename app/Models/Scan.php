<?php

namespace App\Models;

use App\Enums\ScanMethod;
use App\Enums\ScanResult;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scan extends Model
{
    use HasUuids, HasFactory, BelongsToTenant;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'scans';

    /**
     * The name of the "updated at" column.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tenant_id',
        'event_id',
        'coupon_id',
        'scanned_by',
        'location_id',
        'scan_method',
        'scan_result',
        'device_info',
        'ip_address',
        'latitude',
        'longitude',
        'synced_at',
        'scanned_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scan_method' => ScanMethod::class,
            'scan_result' => ScanResult::class,
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'synced_at' => 'datetime',
            'scanned_at' => 'datetime',
        ];
    }

    /**
     * Get the event that the scan belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the coupon that was scanned.
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the user who performed the scan.
     */
    public function scanner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }

    /**
     * Get the distribution location where the scan occurred.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(DistributionLocation::class, 'location_id');
    }
}
