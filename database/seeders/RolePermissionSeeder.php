<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Tenant Management
            'view-tenant-profile', 'edit-tenant-profile', 'edit-tenant-settings',
            'manage-tenant-users', 'manage-subscription',

            // Event Management
            'view-events', 'create-events', 'edit-events', 'delete-events',
            'activate-events', 'complete-events', 'manage-locations',

            // Donor Management
            'view-donors', 'create-donors', 'edit-donors', 'delete-donors', 'import-donors',

            // Animal Management
            'view-animals', 'create-animals', 'edit-animals', 'delete-animals',
            'update-animal-status',

            // Recipient Management
            'view-recipients', 'create-recipients', 'edit-recipients', 'delete-recipients',
            'import-recipients', 'export-recipients',

            // Coupon Management
            'view-coupons', 'generate-coupons', 'print-coupons',
            'void-coupons', 'regenerate-coupons',

            // Scan Operations
            'scan-coupons', 'manual-scan', 'view-scan-history', 'sync-offline-scans',

            // Dashboard & Reports
            'view-dashboard', 'view-live-dashboard', 'view-reports',
            'export-reports', 'generate-reports',

            // User Management
            'view-users', 'create-users', 'edit-users', 'delete-users', 'assign-roles',

            // Platform Administration (Super Admin only)
            'view-all-tenants', 'manage-tenants', 'suspend-tenants',
            'view-platform-dashboard', 'manage-platform-settings',
            'view-audit-logs', 'manage-plans', 'manual-payment-activation',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Super Admin — all permissions
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Tenant Admin — all tenant-level permissions
        $tenantAdmin = Role::create(['name' => 'tenant_admin']);
        $tenantAdmin->givePermissionTo([
            'view-tenant-profile', 'edit-tenant-profile', 'edit-tenant-settings',
            'manage-tenant-users', 'manage-subscription',
            'view-events', 'create-events', 'edit-events', 'delete-events',
            'activate-events', 'complete-events', 'manage-locations',
            'view-donors', 'create-donors', 'edit-donors', 'delete-donors', 'import-donors',
            'view-animals', 'create-animals', 'edit-animals', 'delete-animals', 'update-animal-status',
            'view-recipients', 'create-recipients', 'edit-recipients', 'delete-recipients',
            'import-recipients', 'export-recipients',
            'view-coupons', 'generate-coupons', 'print-coupons', 'void-coupons', 'regenerate-coupons',
            'scan-coupons', 'manual-scan', 'view-scan-history', 'sync-offline-scans',
            'view-dashboard', 'view-live-dashboard', 'view-reports', 'export-reports', 'generate-reports',
            'view-users', 'create-users', 'edit-users', 'delete-users', 'assign-roles',
        ]);

        // Operator — operational permissions
        $operator = Role::create(['name' => 'operator']);
        $operator->givePermissionTo([
            'view-tenant-profile',
            'view-events', 'manage-locations',
            'view-donors', 'create-donors', 'edit-donors', 'import-donors',
            'view-animals', 'create-animals', 'edit-animals', 'update-animal-status',
            'view-recipients', 'create-recipients', 'edit-recipients',
            'import-recipients', 'export-recipients',
            'view-coupons', 'print-coupons',
            'scan-coupons', 'manual-scan', 'view-scan-history', 'sync-offline-scans',
            'view-dashboard', 'view-live-dashboard', 'view-reports', 'export-reports',
        ]);

        // Viewer — read-only permissions
        $viewer = Role::create(['name' => 'viewer']);
        $viewer->givePermissionTo([
            'view-tenant-profile',
            'view-events',
            'view-donors',
            'view-animals',
            'view-recipients',
            'view-coupons',
            'view-scan-history',
            'view-dashboard', 'view-live-dashboard', 'view-reports',
        ]);
    }
}
