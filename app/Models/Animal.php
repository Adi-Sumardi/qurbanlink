<?php

namespace App\Models;

use App\Enums\AnimalStatus;
use App\Enums\AnimalType;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Animal extends Model
{
    use HasUuids, HasFactory, BelongsToTenant, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tenant_id',
        'event_id',
        'donor_id',
        'type',
        'breed',
        'weight',
        'color',
        'status',
        'estimated_portions',
        'slaughtered_at',
        'photo_path',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => AnimalType::class,
            'weight' => 'decimal:2',
            'status' => AnimalStatus::class,
            'estimated_portions' => 'integer',
            'slaughtered_at' => 'datetime',
        ];
    }

    /**
     * Get the event that the animal belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the donor that donated this animal.
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(Donor::class);
    }
}
