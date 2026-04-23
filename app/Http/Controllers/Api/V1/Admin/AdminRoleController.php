<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminRoleController extends Controller
{
    public function roles(): JsonResponse
    {
        $roles = Role::with('permissions')->get()->map(fn ($role) => [
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ]);

        return $this->success($roles);
    }

    public function permissions(): JsonResponse
    {
        $permissions = Permission::orderBy('name')->pluck('name');
        return $this->success($permissions);
    }

    public function updateRolePermissions(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'permissions'   => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->syncPermissions($request->permissions);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return $this->success([
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ], 'Permissions updated successfully.');
    }

    public function createRole(Request $request): JsonResponse
    {
        $request->validate([
            'name'          => ['required', 'string', 'unique:roles,name'],
            'permissions'   => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->filled('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return $this->created([
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ], 'Role created successfully.');
    }

    public function deleteRole(Role $role): JsonResponse
    {
        if (in_array($role->name, ['super_admin', 'tenant_admin', 'operator', 'viewer'])) {
            return $this->error('Role bawaan sistem tidak dapat dihapus.', 403);
        }

        $role->delete();
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return $this->success(null, 'Role deleted.');
    }
}
