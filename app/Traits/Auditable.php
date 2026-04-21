<?php

namespace App\Traits;

use App\Models\AuditLog;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            static::recordAudit($model, 'created', null, $model->getAttributes());
        });

        static::updated(function ($model) {
            $dirty = $model->getDirty();
            if (empty($dirty)) {
                return;
            }

            $old = collect($dirty)->mapWithKeys(fn ($v, $k) => [$k => $model->getOriginal($k)])->toArray();
            static::recordAudit($model, 'updated', $old, $dirty);
        });

        static::deleted(function ($model) {
            static::recordAudit($model, 'deleted', $model->getAttributes(), null);
        });
    }

    private static function recordAudit($model, string $action, ?array $old, ?array $new): void
    {
        $user = auth()->user();

        AuditLog::create([
            'tenant_id' => $model->tenant_id ?? $user?->tenant_id,
            'user_id' => $user?->id,
            'action' => $action,
            'auditable_type' => $model->getMorphClass(),
            'auditable_id' => $model->getKey(),
            'old_values' => $old,
            'new_values' => $new,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
