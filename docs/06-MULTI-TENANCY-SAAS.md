# Multi-Tenancy & SaaS Design Document

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026

---

## 1. Multi-Tenancy Strategy

### 1.1 Pendekatan: Single Database, Shared Schema

Menggunakan **single database** dengan kolom `tenant_id` pada setiap tabel milik tenant. Pendekatan ini dipilih karena:

| Aspek | Single DB (Dipilih) | Multi-DB |
|-------|---------------------|----------|
| Complexity | Rendah | Tinggi |
| Cost | Rendah (1 DB) | Tinggi (N DB) |
| Data isolation | Row-level (cukup) | Full isolation |
| Migration | Sekali jalan | N kali per tenant |
| Scalability | Hingga ~10K tenant | Unlimited |
| Backup/Restore | Satu backup | Per-tenant backup |
| Cross-tenant query | Mudah (super admin) | Sulit |

> Untuk fase awal (target < 10K tenant), single DB sudah memadai. Bisa di-migrate ke multi-DB jika scale membutuhkan.

### 1.2 Package: stancl/tenancy

Menggunakan package `stancl/tenancy` dengan konfigurasi **single database tenancy**.

```php
// config/tenancy.php
'tenant_model' => App\Models\Tenant::class,

// Menggunakan single database mode
'database' => [
    'driver' => 'single',  // tidak membuat DB per tenant
],
```

### 1.3 Pendekatan URL: Single URL (Satu Link untuk Semua)

Menggunakan **satu URL utama** (`app.qurbanlink.id`) untuk semua tenant/masjid.
Tenant di-resolve **otomatis dari user yang login** — bukan dari subdomain.

**Alasan memilih Single URL:**

| Aspek | Single URL (Dipilih) | Subdomain per Tenant |
|-------|---------------------|----------------------|
| User experience | Login → langsung masuk data masjidnya | Harus ingat/share subdomain |
| Target user | Panitia masjid (non-teknis) | Organisasi enterprise |
| Infrastruktur | 1 domain, simple Nginx | Wildcard DNS, wildcard SSL |
| Deployment | Mudah | Kompleks |
| SEO/Branding | Tidak perlu (internal tool) | Bagus untuk public-facing |
| Biaya | Rendah | Lebih tinggi |

**URL Structure:**

```
PRIVATE (butuh login):
  app.qurbanlink.id/login              → Semua user login di sini
  app.qurbanlink.id/register           → Daftar organisasi baru
  app.qurbanlink.id/dashboard          → Auto-scoped ke tenant user
  app.qurbanlink.id/events             → Data event milik tenant user
  app.qurbanlink.id/scan               → Scanner kupon tenant user
  app.qurbanlink.id/settings           → Pengaturan tenant user

PUBLIC (tanpa login, shareable link):
  app.qurbanlink.id/live/{tenant-slug}/{event-slug}
  → Contoh: app.qurbanlink.id/live/masjid-al-furqon/kurban-1447h
  → Untuk ditampilkan di TV/proyektor saat distribusi
  → Read-only, hanya dashboard live
```

**Bagaimana ini bekerja:**

```
┌──────────────────────────────────────────────────────────┐
│                     ALUR LOGIN                            │
│                                                          │
│  User buka: app.qurbanlink.id/login                      │
│       │                                                  │
│       ▼                                                  │
│  Input email & password                                  │
│       │                                                  │
│       ▼                                                  │
│  Backend: cari user → ambil tenant_id dari tabel users   │
│       │                                                  │
│       ▼                                                  │
│  Set tenant context dari user.tenant_id                  │
│       │                                                  │
│       ▼                                                  │
│  Redirect ke /dashboard                                  │
│  → Semua data otomatis ter-filter sesuai tenant_id       │
│  → User dari Masjid A hanya lihat data Masjid A         │
│  → User dari Masjid B hanya lihat data Masjid B         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 1.4 Tenant Resolution (Session-Based)

Tenant di-resolve dari **authenticated user**, bukan dari URL/subdomain:

```php
// Middleware: ResolveTenant
class ResolveTenant
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        // Super admin tidak terikat tenant
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (!$tenant) {
            abort(404, 'Tenant not found');
        }

        if (!$tenant->is_active) {
            abort(403, 'Organisasi Anda sedang dinonaktifkan. Hubungi admin.');
        }

        // Set tenant context — semua query otomatis ter-scope
        app()->instance('current_tenant', $tenant);
        TenantScope::setTenant($tenant);

        return $next($request);
    }
}
```

```php
// Middleware: ResolvePublicTenant (untuk public live dashboard)
class ResolvePublicTenant
{
    public function handle($request, Closure $next)
    {
        $tenantSlug = $request->route('tenantSlug');
        $tenant = Tenant::where('slug', $tenantSlug)->where('is_active', true)->first();

        if (!$tenant) {
            abort(404, 'Organisasi tidak ditemukan');
        }

        app()->instance('current_tenant', $tenant);
        TenantScope::setTenant($tenant);

        return $next($request);
    }
}
```

```php
// routes/api.php

// Private routes — tenant dari authenticated user
Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::apiResource('events', EventController::class);
    Route::post('/events/{event}/scan', [ScanController::class, 'scan']);
    // ... semua route tenant-scoped
});

// Public routes — tenant dari URL slug (untuk live dashboard)
Route::middleware(['public-tenant'])->group(function () {
    Route::get('/live/{tenantSlug}/{eventSlug}', [PublicDashboardController::class, 'show']);
});

// Super admin routes — no tenant scope
Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('admin')->group(function () {
    Route::get('/tenants', [AdminTenantController::class, 'index']);
    // ...
});
```

### 1.5 Multi-Tenant Login Behavior

```
┌──────────────────────────────────────────────────┐
│              LOGIN SCENARIOS                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Skenario 1: User biasa (panitia masjid)         │
│  ─────────────────────────────────────────       │
│  Login → tenant_id = Masjid Al-Furqon            │
│  → Dashboard menampilkan data Masjid Al-Furqon   │
│  → Tidak bisa akses data masjid lain             │
│                                                  │
│  Skenario 2: Super Admin                         │
│  ─────────────────────────────────────────       │
│  Login → tenant_id = NULL                        │
│  → Redirect ke /admin (platform dashboard)       │
│  → Bisa lihat semua data semua tenant            │
│  → Bisa impersonate tenant tertentu              │
│                                                  │
│  Skenario 3: User punya akses ke >1 tenant       │
│  (opsional, fase 2)                              │
│  ─────────────────────────────────────────       │
│  Login → tampilkan tenant picker:                │
│  ┌──────────────────────────────┐                │
│  │ Pilih Organisasi:            │                │
│  │ ○ Masjid Al-Furqon           │                │
│  │ ○ Yayasan Baitul Maal        │                │
│  │        [Lanjutkan]           │                │
│  └──────────────────────────────┘                │
│  → Set active tenant sesuai pilihan              │
│  → Bisa switch tenant dari header menu           │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 2. Data Isolation

### 2.1 Global Scope

Setiap model yang dimiliki tenant menggunakan Global Scope untuk auto-filter:

```php
// Trait: BelongsToTenant
trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        // Auto-scope queries
        static::addGlobalScope(new TenantScope);

        // Auto-set tenant_id on create
        static::creating(function ($model) {
            if (app()->has('current_tenant')) {
                $model->tenant_id = app('current_tenant')->id;
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

```php
// TenantScope
class TenantScope implements Scope
{
    protected static ?string $tenantId = null;

    public static function setTenant(Tenant $tenant): void
    {
        static::$tenantId = $tenant->id;
    }

    public function apply(Builder $builder, Model $model): void
    {
        if (static::$tenantId) {
            $builder->where($model->getTable() . '.tenant_id', static::$tenantId);
        }
    }
}
```

### 2.2 Model Yang Menggunakan Tenant Scope

| Model | Scoped | Keterangan |
|-------|--------|------------|
| Tenant | No | Data tenant itu sendiri |
| User | Yes | `tenant_id` nullable (null = super admin) |
| Subscription | Yes | Per tenant |
| Payment | Yes | Per tenant |
| Event | Yes | Per tenant |
| DistributionLocation | Yes | Via event |
| Donor | Yes | Per tenant |
| Animal | Yes | Per tenant |
| Recipient | Yes | Per tenant |
| Coupon | Yes | Per tenant |
| Scan | Yes | Per tenant |
| AuditLog | Yes | Per tenant (null = platform-level) |

### 2.3 Cross-Tenant Prevention

```php
// Middleware: PreventCrossTenantAccess
// Diterapkan pada semua route yang menerima resource ID

class PreventCrossTenantAccess
{
    public function handle($request, Closure $next)
    {
        // Route model binding sudah di-scope oleh TenantScope
        // Jika model tidak ditemukan, otomatis 404
        // Extra check pada nested resources
        foreach ($request->route()->parameters() as $param) {
            if ($param instanceof Model && method_exists($param, 'tenant')) {
                if ($param->tenant_id !== app('current_tenant')->id) {
                    abort(403, 'Access denied');
                }
            }
        }

        return $next($request);
    }
}
```

---

## 3. SaaS Subscription Management

### 3.1 Plan Configuration

```php
// config/plans.php
return [
    'free' => [
        'name' => 'Free',
        'price_monthly' => 0,
        'price_yearly' => 0,
        'coupon_quota' => 100,
        'max_events_per_year' => 1,
        'max_users' => 2,
        'features' => [
            'basic_dashboard' => true,
            'live_dashboard' => false,
            'email_notifications' => false,
            'export_reports' => false,
            'custom_branding' => false,
            'api_access' => false,
            'priority_support' => false,
        ],
    ],
    'starter' => [
        'name' => 'Starter',
        'price_monthly' => 99000,
        'price_yearly' => 999000,
        'coupon_quota' => 500,
        'max_events_per_year' => 3,
        'max_users' => 5,
        'features' => [
            'basic_dashboard' => true,
            'live_dashboard' => true,
            'email_notifications' => true,
            'export_reports' => true,
            'custom_branding' => false,
            'api_access' => false,
            'priority_support' => false,
        ],
    ],
    'professional' => [
        'name' => 'Professional',
        'price_monthly' => 249000,
        'price_yearly' => 2499000,
        'coupon_quota' => 2000,
        'max_events_per_year' => null, // unlimited
        'max_users' => 20,
        'features' => [
            'basic_dashboard' => true,
            'live_dashboard' => true,
            'email_notifications' => true,
            'export_reports' => true,
            'custom_branding' => true,
            'api_access' => true,
            'priority_support' => false,
        ],
    ],
    'enterprise' => [
        'name' => 'Enterprise',
        'price_monthly' => null, // custom
        'price_yearly' => null,
        'coupon_quota' => null, // unlimited
        'max_events_per_year' => null,
        'max_users' => null,
        'features' => [
            'basic_dashboard' => true,
            'live_dashboard' => true,
            'email_notifications' => true,
            'export_reports' => true,
            'custom_branding' => true,
            'api_access' => true,
            'priority_support' => true,
        ],
    ],
];
```

### 3.2 Feature Gate Middleware

```php
// Middleware: CheckFeature
class CheckFeature
{
    public function handle($request, Closure $next, string $feature)
    {
        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;

        if (!$subscription) {
            abort(403, 'No active subscription');
        }

        $plan = config("plans.{$subscription->plan}");

        if (!($plan['features'][$feature] ?? false)) {
            abort(403, "Feature '{$feature}' is not available on your current plan. Please upgrade.");
        }

        return $next($request);
    }
}

// Usage in routes:
Route::middleware('feature:live_dashboard')->group(function () {
    Route::get('/events/{event}/dashboard/live-feed', ...);
});
```

### 3.3 Quota Check Middleware

```php
// Middleware: CheckCouponQuota
class CheckCouponQuota
{
    public function handle($request, Closure $next)
    {
        $tenant = app('current_tenant');
        $subscription = $tenant->activeSubscription;

        $plan = config("plans.{$subscription->plan}");
        $quota = $plan['coupon_quota'];

        if ($quota !== null && $subscription->coupon_used >= $quota) {
            abort(403, 'Coupon quota exceeded. Please upgrade your plan or purchase additional coupons.');
        }

        return $next($request);
    }
}
```

### 3.4 Subscription Lifecycle

```
[Tenant Register]
       │
       ▼
[Free Plan Auto-Assigned]
       │
       ├── Use platform with free limits
       │
       ▼
[Choose Paid Plan]
       │
       ▼
[Create Payment (Moota)]
       │
       ├── Generate unique amount (e.g., 99.123)
       ├── Create pending payment record
       ├── Show transfer instructions
       │
       ▼
[Moota Webhook: Payment Received]
       │
       ├── Match by unique amount
       ├── Activate subscription
       ├── Update coupon quota
       ├── Send confirmation email
       │
       ▼
[Active Subscription]
       │
       ├── H-7: Reminder email
       ├── H-3: Reminder email
       ├── H-1: Reminder email
       │
       ▼
[Expiry Date]
       │
       ├── Grace period (7 days)
       │   ├── Limited access
       │   ├── Daily reminder
       │   │
       │   ├── [Payment Received] → Renew
       │   │
       │   └── [No Payment]
       │              │
       │              ▼
       │       [Downgrade to Free]
       │              │
       │              ├── Keep data (read-only excess)
       │              ├── Limit to free quotas
       │              └── Send downgrade notification
       │
       └── [Payment Received before expiry] → Auto-renew
```

---

## 4. Moota Payment Integration

### 4.1 Payment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Tenant   │     │ QurbanLink│     │  Moota   │     │   Bank   │
│  Admin    │     │  Backend  │     │   API    │     │          │
└─────┬────┘     └─────┬────┘     └─────┬────┘     └─────┬────┘
      │                │                │                 │
      │  Subscribe     │                │                 │
      ├───────────────>│                │                 │
      │                │                │                 │
      │                │  Create unique │                 │
      │                │  transfer code │                 │
      │                ├───────────────>│                 │
      │                │                │                 │
      │  Payment info  │                │                 │
      │<───────────────┤                │                 │
      │  (Bank + amt)  │                │                 │
      │                │                │                 │
      │  Transfer      │                │                 │
      ├────────────────┼────────────────┼────────────────>│
      │                │                │                 │
      │                │  Webhook:      │  Detect         │
      │                │  mutation      │  mutation        │
      │                │<───────────────┤<────────────────┤
      │                │                │                 │
      │                │  Verify &      │                 │
      │                │  match payment │                 │
      │                │                │                 │
      │  Confirmation  │                │                 │
      │<───────────────┤                │                 │
      │  (email + UI)  │                │                 │
```

### 4.2 Moota Service

```php
class MootaPaymentService
{
    // Create payment with unique amount for matching
    public function createPayment(Tenant $tenant, string $plan, string $cycle): Payment
    {
        $basePrice = config("plans.{$plan}.price_{$cycle}");
        $uniqueCode = rand(1, 999);
        $totalAmount = $basePrice + $uniqueCode;

        $payment = Payment::create([
            'tenant_id' => $tenant->id,
            'payment_type' => 'subscription',
            'amount' => $totalAmount,
            'unique_code' => $uniqueCode,
            'status' => 'pending',
            'invoice_number' => $this->generateInvoiceNumber(),
            'expired_at' => now()->addHours(24),
            'metadata' => [
                'plan' => $plan,
                'cycle' => $cycle,
                'base_price' => $basePrice,
            ],
        ]);

        return $payment;
    }

    // Handle Moota webhook
    public function handleWebhook(array $data): void
    {
        // Verify webhook signature
        // Match mutation amount to pending payment
        // Activate subscription
        // Send confirmation email
    }
}
```

---

## 5. Tenant Onboarding Flow

```
Step 1: Register
├── Input: Nama, Email, Password, Nama Organisasi, No HP
├── Action: Create tenant + user (tenant_admin role)
├── Email: Verification link
│
Step 2: Verify Email
├── Click link dari email
├── Action: Activate account
├── Email: Welcome + account active notification
│
Step 3: Choose Plan
├── Display: Plan comparison table
├── Free: Auto-activate, skip to step 5
├── Paid: Continue to step 4
│
Step 4: Payment (Paid plans only)
├── Display: Transfer instructions
├── Wait: Moota webhook confirmation
├── Action: Activate subscription
│
Step 5: Organization Setup
├── Input: Alamat, Logo, Timezone, Kategori penerima
├── Action: Update tenant profile + settings
│
Step 6: First Event
├── Guide: Create first kurban event
├── Input: Nama event, tanggal, lokasi
│
Step 7: Ready
├── Display: Quick start guide
├── Links: Import penerima, tambah hewan, generate kupon
```

---

## 6. Tenant Isolation Testing Checklist

| Test Case | Description |
|-----------|-------------|
| TC-01 | Tenant A cannot see Tenant B's events |
| TC-02 | Tenant A cannot scan Tenant B's coupons |
| TC-03 | API request without tenant context returns 404 |
| TC-04 | User from Tenant A cannot login to Tenant B |
| TC-05 | Super admin can see all tenants' data |
| TC-06 | Suspended tenant cannot access any API |
| TC-07 | Expired subscription limits features correctly |
| TC-08 | Coupon quota enforced per subscription plan |
| TC-09 | Cross-tenant URL manipulation returns 403 |
| TC-10 | Bulk import scoped to correct tenant |
