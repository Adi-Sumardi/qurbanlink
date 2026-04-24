<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * List users for current tenant. Paginated.
     */
    public function index(Request $request): JsonResponse
    {
        $tenantId = app()->has('current_tenant') ? app('current_tenant')->id : $request->user()->tenant_id;

        $users = User::with('roles')
            ->where('tenant_id', $tenantId)
            ->paginate($request->input('per_page', 15));

        return $this->paginatedSuccess(UserResource::collection($users)->response()->getData(true), 'Users retrieved successfully.');
    }

    /**
     * Create a user within the current tenant.
     */
    public function store(Request $request): JsonResponse
    {
        $tenantId = app()->has('current_tenant') ? app('current_tenant')->id : $request->user()->tenant_id;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['required', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return $this->created(new UserResource($user->load('roles')), 'User created successfully.');
    }

    /**
     * Show a user with roles.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('roles');

        return $this->success(new UserResource($user), 'User retrieved successfully.');
    }

    /**
     * Update user fields.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $this->success(new UserResource($user->fresh()->load('roles')), 'User updated successfully.');
    }

    /**
     * Soft delete a user.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->noContent();
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string'],
        ]);

        $user->syncRoles([$validated['role']]);

        return $this->success(new UserResource($user->fresh()->load('roles')), 'Role assigned successfully.');
    }
}
