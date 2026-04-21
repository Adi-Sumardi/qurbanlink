<?php

namespace App\Scopes;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    protected static ?string $tenantId = null;

    public static function setTenant(Tenant $tenant): void
    {
        static::$tenantId = $tenant->id;
    }

    public static function getTenantId(): ?string
    {
        return static::$tenantId;
    }

    public static function removeTenant(): void
    {
        static::$tenantId = null;
    }

    public function apply(Builder $builder, Model $model): void
    {
        if (static::$tenantId) {
            $builder->where($model->getTable() . '.tenant_id', static::$tenantId);
        }
    }
}
