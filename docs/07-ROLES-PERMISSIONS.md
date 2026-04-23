# Roles & Permissions Design Document

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026
**Package:** Spatie Laravel Permission

---

## 1. Role Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                    PLATFORM LEVEL                    │
│                                                     │
│   ┌─────────────┐                                   │
│   │ super_admin  │  Full platform access             │
│   └─────────────┘                                   │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    TENANT LEVEL                      │
│                                                     │
│   ┌──────────────┐                                  │
│   │ tenant_admin  │  Full tenant access              │
│   └───────┬──────┘                                  │
│           │                                         │
│   ┌───────┴──────┐                                  │
│   │   operator    │  Operational access (scan, etc)  │
│   └───────┬──────┘                                  │
│           │                                         │
│   ┌───────┴──────┐                                  │
│   │    viewer     │  Read-only access                │
│   └──────────────┘                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Role Definitions

### 2.1 Super Admin

| Aspek | Detail |
|-------|--------|
| Scope | Platform-wide |
| `tenant_id` | NULL |
| Guard | `web` |
| Jumlah | 1-5 orang |
| Deskripsi | Mengelola seluruh platform, tenant, subscription, dan konfigurasi global |

### 2.2 Tenant Admin

| Aspek | Detail |
|-------|--------|
| Scope | Satu tenant |
| `tenant_id` | Tenant ID |
| Guard | `web` |
| Jumlah per tenant | 1-3 orang |
| Deskripsi | Pengelola organisasi. Full access ke semua fitur tenant. Bisa invite user dan assign role. |

### 2.3 Operator

| Aspek | Detail |
|-------|--------|
| Scope | Satu tenant |
| `tenant_id` | Tenant ID |
| Guard | `web` |
| Jumlah per tenant | 1-20 orang |
| Deskripsi | Panitia lapangan. Bisa scan kupon, input data penerima/hewan, lihat dashboard. Tidak bisa manage user atau subscription. |

### 2.4 Viewer

| Aspek | Detail |
|-------|--------|
| Scope | Satu tenant |
| `tenant_id` | Tenant ID |
| Guard | `web` |
| Jumlah per tenant | 1-10 orang |
| Deskripsi | Stakeholder. Hanya bisa melihat dashboard dan laporan. Tidak bisa melakukan perubahan data. |

---

## 3. Permission Matrix

### 3.1 Tenant Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-tenant-profile` | V | V | V | V |
| `edit-tenant-profile` | V | V | - | - |
| `edit-tenant-settings` | V | V | - | - |
| `manage-tenant-users` | V | V | - | - |
| `manage-subscription` | V | V | - | - |

### 3.2 Event Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-events` | V | V | V | V |
| `create-events` | V | V | - | - |
| `edit-events` | V | V | - | - |
| `delete-events` | V | V | - | - |
| `activate-events` | V | V | - | - |
| `complete-events` | V | V | - | - |
| `manage-locations` | V | V | V | - |

### 3.3 Donor (Pekurban) Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-donors` | V | V | V | V |
| `create-donors` | V | V | V | - |
| `edit-donors` | V | V | V | - |
| `delete-donors` | V | V | - | - |
| `import-donors` | V | V | V | - |

### 3.4 Animal Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-animals` | V | V | V | V |
| `create-animals` | V | V | V | - |
| `edit-animals` | V | V | V | - |
| `delete-animals` | V | V | - | - |
| `update-animal-status` | V | V | V | - |

### 3.5 Recipient Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-recipients` | V | V | V | V |
| `create-recipients` | V | V | V | - |
| `edit-recipients` | V | V | V | - |
| `delete-recipients` | V | V | - | - |
| `import-recipients` | V | V | V | - |
| `export-recipients` | V | V | V | - |

### 3.6 Coupon Management

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-coupons` | V | V | V | V |
| `generate-coupons` | V | V | - | - |
| `print-coupons` | V | V | V | - |
| `void-coupons` | V | V | - | - |
| `regenerate-coupons` | V | V | - | - |

### 3.7 Scan Operations

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `scan-coupons` | V | V | V | - |
| `manual-scan` | V | V | V | - |
| `view-scan-history` | V | V | V | V |
| `sync-offline-scans` | V | V | V | - |

### 3.8 Dashboard & Reports

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-dashboard` | V | V | V | V |
| `view-live-dashboard` | V | V | V | V |
| `view-reports` | V | V | V | V |
| `export-reports` | V | V | V | - |
| `generate-reports` | V | V | - | - |

### 3.9 User Management (Tenant-level)

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-users` | V | V | - | - |
| `create-users` | V | V | - | - |
| `edit-users` | V | V | - | - |
| `delete-users` | V | V | - | - |
| `assign-roles` | V | V | - | - |

### 3.10 Platform Administration (Super Admin Only)

| Permission | Super Admin | Tenant Admin | Operator | Viewer |
|-----------|:-----------:|:------------:|:--------:|:------:|
| `view-all-tenants` | V | - | - | - |
| `manage-tenants` | V | - | - | - |
| `suspend-tenants` | V | - | - | - |
| `view-platform-dashboard` | V | - | - | - |
| `manage-platform-settings` | V | - | - | - |
| `view-audit-logs` | V | - | - | - |
| `manage-plans` | V | - | - | - |
| `manual-payment-activation` | V | - | - | - |

---

## 4. Spatie Implementation

### 4.1 Seeder

```php
// database/seeders/RolePermissionSeeder.php

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Tenant
            'view-tenant-profile', 'edit-tenant-profile', 'edit-tenant-settings',
            'manage-tenant-users', 'manage-subscription',

            // Events
            'view-events', 'create-events', 'edit-events', 'delete-events',
            'activate-events', 'complete-events', 'manage-locations',

            // Donors
            'view-donors', 'create-donors', 'edit-donors', 'delete-donors', 'import-donors',

            // Animals
            'view-animals', 'create-animals', 'edit-animals', 'delete-animals',
            'update-animal-status',

            // Recipients
            'view-recipients', 'create-recipients', 'edit-recipients', 'delete-recipients',
            'import-recipients', 'export-recipients',

            // Coupons
            'view-coupons', 'generate-coupons', 'print-coupons',
            'void-coupons', 'regenerate-coupons',

            // Scanning
            'scan-coupons', 'manual-scan', 'view-scan-history', 'sync-offline-scans',

            // Dashboard & Reports
            'view-dashboard', 'view-live-dashboard', 'view-reports',
            'export-reports', 'generate-reports',

            // User Management
            'view-users', 'create-users', 'edit-users', 'delete-users', 'assign-roles',

            // Platform (Super Admin)
            'view-all-tenants', 'manage-tenants', 'suspend-tenants',
            'view-platform-dashboard', 'manage-platform-settings',
            'view-audit-logs', 'manage-plans', 'manual-payment-activation',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

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
```

### 4.2 Middleware Usage

```php
// routes/api.php

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {

    // Events - tenant_admin only for CUD
    Route::get('/events', [EventController::class, 'index'])
        ->middleware('permission:view-events');

    Route::post('/events', [EventController::class, 'store'])
        ->middleware('permission:create-events');

    // Scanning - operators and above
    Route::post('/events/{event}/scan', [ScanController::class, 'scan'])
        ->middleware('permission:scan-coupons');

    // Coupon generation - tenant_admin only
    Route::post('/events/{event}/coupons/generate', [CouponController::class, 'generate'])
        ->middleware('permission:generate-coupons');

    // Dashboard - all tenant roles
    Route::get('/events/{event}/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('permission:view-dashboard');

    // User management - tenant_admin only
    Route::apiResource('users', UserController::class)
        ->middleware('permission:manage-tenant-users');
});

// Super admin routes
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/tenants', [AdminTenantController::class, 'index']);
    Route::patch('/tenants/{tenant}/suspend', [AdminTenantController::class, 'suspend']);
    // ...
});
```

### 4.3 Controller Authorization

```php
class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        // Permission sudah dicek di middleware
        // Tambahan: cek subscription limit
        $this->checkEventLimit();

        $event = (new CreateEventAction)->execute($request->validated());

        return new EventResource($event);
    }

    private function checkEventLimit(): void
    {
        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;
        $plan = config("plans.{$subscription->plan}");

        $maxEvents = $plan['max_events_per_year'];
        if ($maxEvents !== null) {
            $currentYearEvents = Event::where('year', now()->year)->count();
            if ($currentYearEvents >= $maxEvents) {
                abort(403, "Maximum {$maxEvents} events per year on your plan.");
            }
        }
    }
}
```

---

## 5. Frontend Permission Handling

### 5.1 Permission Provider

```typescript
// hooks/use-auth.ts
interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  tenant: {
    id: string;
    name: string;
    plan: string;
  };
}

// Utility functions
export function can(permission: string): boolean {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ?? false;
}

export function hasRole(role: string): boolean {
  const { user } = useAuth();
  return user?.roles.includes(role) ?? false;
}

export function isSuperAdmin(): boolean {
  return hasRole('super_admin');
}
```

### 5.2 UI Conditional Rendering

```tsx
// Contoh: tombol hanya tampil jika punya permission
<>
  {can('generate-coupons') && (
    <Button onClick={handleGenerate}>Generate Kupon</Button>
  )}

  {can('scan-coupons') && (
    <Link href="/scan">Scan Kupon</Link>
  )}

  {hasRole('tenant_admin') && (
    <Link href="/settings">Pengaturan</Link>
  )}
</>
```

### 5.3 Route Protection

```tsx
// middleware.ts (Next.js)
const roleRouteMap: Record<string, string[]> = {
  '/admin': ['super_admin'],
  '/settings': ['tenant_admin'],
  '/users': ['tenant_admin'],
  '/scan': ['tenant_admin', 'operator'],
  '/dashboard': ['tenant_admin', 'operator', 'viewer'],
};
```

---

## 6. Permission Summary Count

| Category | Permission Count |
|----------|:---------------:|
| Tenant Management | 5 |
| Event Management | 7 |
| Donor Management | 5 |
| Animal Management | 5 |
| Recipient Management | 6 |
| Coupon Management | 5 |
| Scan Operations | 4 |
| Dashboard & Reports | 5 |
| User Management | 5 |
| Platform Admin | 8 |
| **Total** | **55** |
