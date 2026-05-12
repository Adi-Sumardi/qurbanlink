<?php

namespace App\Models;

use App\Enums\DonorSubmissionStatus;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donor extends Model
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
        'name',
        'phone',
        'email',
        'address',
        'nik',
        'submission_status',
        'kurban_type',
        'participants',
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
            'submission_status' => DonorSubmissionStatus::class,
            'participants'      => 'array',
        ];
    }

    /**
     * Get the event that the donor belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the animals donated by this donor.
     */
    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }
}
