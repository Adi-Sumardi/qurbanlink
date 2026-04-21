<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Plan extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'price_monthly',
        'price_yearly',
        'coupon_quota',
        'max_events_per_year',
        'max_users',
        'max_recipients_per_event',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features'                => 'array',
        'is_active'               => 'boolean',
        'price_monthly'           => 'integer',
        'price_yearly'            => 'integer',
        'coupon_quota'            => 'integer',
        'max_events_per_year'     => 'integer',
        'max_users'               => 'integer',
        'max_recipients_per_event'=> 'integer',
        'sort_order'              => 'integer',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Plan $plan) {
            if (empty($plan->id)) {
                $plan->id = (string) Str::uuid();
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('price_monthly');
    }
}
