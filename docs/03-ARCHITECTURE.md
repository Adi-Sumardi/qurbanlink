# System Architecture Document

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS (PWA)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Mobile   │  │  Tablet  │  │  Laptop  │  │  TV/Display  │    │
│  │ (Scanner) │  │ (Admin)  │  │ (Admin)  │  │ (Dashboard)  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │
│       └──────────────┴──────────────┴───────────────┘            │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NGINX (Reverse Proxy)                      │
│              Load Balancing / SSL Termination / Caching          │
│  ┌────────────────────────┬────────────────────────────┐        │
│  │   api.qurbanlink.id    │   app.qurbanlink.id        │        │
│  │   (Backend API)        │   (Frontend SSR + Static)  │        │
│  └───────────┬────────────┴───────────────┬────────────┘        │
└──────────────┼────────────────────────────┼─────────────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────────┐  ┌───────────────────────────────────┐
│     BACKEND (Laravel 12) │  │      FRONTEND (Next.js)           │
│                          │  │                                   │
│  ┌────────────────────┐  │  │  ┌─────────────────────────────┐  │
│  │   API Gateway       │  │  │  │   SSR / Static Generation   │  │
│  │   (Sanctum Auth)    │  │  │  │   + PWA Service Worker      │  │
│  ├────────────────────┤  │  │  ├─────────────────────────────┤  │
│  │   Tenant Middleware │  │  │  │   React Components          │  │
│  │   (Multi-tenancy)   │  │  │  │   + QR Scanner (html5-qr)   │  │
│  ├────────────────────┤  │  │  ├─────────────────────────────┤  │
│  │   Business Logic    │  │  │  │   State Management          │  │
│  │   (Services/Actions)│  │  │  │   (Zustand / React Query)   │  │
│  ├────────────────────┤  │  │  ├─────────────────────────────┤  │
│  │   Spatie Permission │  │  │  │   Real-time (WebSocket)     │  │
│  │   (Roles & Perms)   │  │  │  │   via Laravel Echo          │  │
│  ├────────────────────┤  │  │  └─────────────────────────────┘  │
│  │   Event/Listener    │  │  │                                   │
│  │   (Queue Jobs)      │  │  └───────────────────────────────────┘
│  ├────────────────────┤  │
│  │   Broadcasting      │  │
│  │   (Laravel Echo)    │  │
│  └────────────────────┘  │
└──────────┬───────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  PostgreSQL   │  │    Redis     │  │   File Storage        │  │
│  │  (Primary DB) │  │  (Cache/     │  │   (Local/S3)          │  │
│  │              │  │   Queue/     │  │   - QR Code images    │  │
│  │  - Tenant DB  │  │   Session/   │  │   - PDF reports       │  │
│  │  - User data  │  │   Broadcast) │  │   - Upload files      │  │
│  │  - Event data │  │              │  │                       │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │    Moota     │  │  Mail (SMTP) │  │  Laravel Reverb       │  │
│  │  (Payment)   │  │  (Mailgun/   │  │  (WebSocket Server)   │  │
│  │              │  │   Mailtrap)  │  │                       │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Detail

### 2.1 Backend

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Framework | Laravel 12 | Mature PHP framework, excellent ecosystem |
| PHP Version | 8.3+ | Performance, fibers, typed properties |
| Authentication | Laravel Sanctum | SPA-friendly, token-based auth |
| Authorization | Spatie Permission | Battle-tested role/permission package |
| Multi-tenancy | stancl/tenancy | Database-per-tenant atau single DB with scoping |
| Queue | Laravel Queue + Redis | Background job processing |
| Broadcasting | Laravel Reverb | Native WebSocket server for Laravel |
| Cache | Redis | In-memory caching, session store |
| Mail | Laravel Mail + Mailgun | Transactional email |
| QR Code | bacon/bacon-qr-code | QR code generation |
| PDF | barryvdh/laravel-dompdf | PDF report & coupon generation |
| Excel | maatwebsite/laravel-excel | Import/export Excel |
| API Docs | scramble (dedoc) | Auto-generated OpenAPI docs |
| Testing | PHPUnit + Pest | Unit & feature testing |

### 2.2 Frontend

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Framework | Next.js 15 (App Router) | SSR, static generation, API routes |
| Language | TypeScript | Type safety |
| UI Library | Shadcn/UI + Tailwind CSS | Customizable components |
| State | Zustand + TanStack Query | Lightweight state + server state |
| QR Scanner | html5-qrcode | Cross-browser QR scanning |
| Charts | Recharts | Dashboard visualizations |
| Forms | React Hook Form + Zod | Form management + validation |
| Real-time | Laravel Echo (Pusher protocol) | WebSocket client |
| PWA | next-pwa (Serwist) | Service worker, offline support |
| HTTP Client | Axios | API communication |
| Testing | Vitest + Testing Library | Unit & component testing |

### 2.3 Infrastructure

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Web Server | Nginx | Reverse proxy, static files, SSL |
| Database | PostgreSQL 16 | JSONB, row-level security, performance |
| Cache/Queue | Redis 7 | Fast in-memory store |
| WebSocket | Laravel Reverb | Native Laravel WebSocket |
| Container | Docker + Docker Compose | Consistent environments |
| CI/CD | GitHub Actions | Automated pipeline |
| Monitoring | Laravel Telescope + Pulse | App monitoring |
| Log | Laravel Log (Monolog) | Structured logging |

---

## 3. Application Architecture (Backend)

### 3.1 Directory Structure (Laravel)

```
backend/
├── app/
│   ├── Actions/              # Single-purpose action classes
│   │   ├── Auth/
│   │   ├── Coupon/
│   │   ├── Distribution/
│   │   ├── Event/
│   │   └── Subscription/
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Enums/                # PHP Enums
│   │   ├── CouponStatus.php
│   │   ├── AnimalType.php
│   │   ├── RecipientCategory.php
│   │   └── SubscriptionPlan.php
│   ├── Events/               # Laravel Events
│   │   ├── CouponScanned.php
│   │   ├── DistributionCompleted.php
│   │   └── PaymentReceived.php
│   ├── Exceptions/           # Custom exceptions
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/V1/       # API v1 controllers
│   │   │   └── Webhook/      # Webhook controllers (Moota)
│   │   ├── Middleware/
│   │   │   ├── EnsureTenantAccess.php
│   │   │   ├── CheckSubscription.php
│   │   │   └── CheckCouponQuota.php
│   │   ├── Requests/         # Form requests (validation)
│   │   └── Resources/        # API Resources (transformers)
│   ├── Jobs/                 # Queue jobs
│   │   ├── GenerateBatchQrCodes.php
│   │   ├── GenerateReport.php
│   │   └── SendNotificationEmail.php
│   ├── Listeners/            # Event listeners
│   ├── Models/               # Eloquent models
│   ├── Notifications/        # Laravel notifications
│   ├── Observers/            # Model observers
│   ├── Policies/             # Authorization policies
│   ├── Providers/
│   └── Services/             # Complex business services
│       ├── QrCodeService.php
│       ├── CouponService.php
│       ├── MootaPaymentService.php
│       └── DashboardService.php
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php               # API routes
│   ├── channels.php          # Broadcasting channels
│   └── console.php
└── tests/
    ├── Feature/
    └── Unit/
```

### 3.2 Design Patterns

| Pattern | Usage |
|---------|-------|
| **Action Pattern** | Single-responsibility classes untuk business operations |
| **Repository Pattern** | Opsional — hanya jika query complex |
| **Service Pattern** | Orchestrasi multi-step business logic |
| **Observer Pattern** | Side effects pada model events |
| **Event/Listener** | Decoupled event handling (scan → dashboard update) |
| **DTO Pattern** | Type-safe data transfer antar layer |
| **Policy Pattern** | Authorization logic per resource |

### 3.3 Request Flow

```
Client Request
     │
     ▼
[Nginx] → SSL termination, rate limiting
     │
     ▼
[Laravel Application]
     │
     ├── Middleware Pipeline
     │   ├── CORS
     │   ├── Authentication (Sanctum)
     │   ├── Tenant Resolution (dari authenticated user)
     │   ├── Role/Permission Check (Spatie)
     │   ├── Rate Limiting
     │   └── Request Validation
     │
     ├── Controller
     │   ├── Validate Input (FormRequest)
     │   ├── Call Action/Service
     │   └── Return API Resource
     │
     ├── Action/Service Layer
     │   ├── Business Logic
     │   ├── Database Operations (Eloquent)
     │   ├── Dispatch Events
     │   └── Queue Jobs (if async)
     │
     └── Response (JSON API Resource)
```

---

## 4. Application Architecture (Frontend)

### 4.1 Directory Structure (Next.js)

```
frontend/
├── public/
│   ├── icons/                # PWA icons
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth layout group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/      # Dashboard layout group
│   │   │   ├── layout.tsx    # Sidebar + header layout
│   │   │   ├── page.tsx      # Dashboard home
│   │   │   ├── events/
│   │   │   ├── animals/
│   │   │   ├── recipients/
│   │   │   ├── donors/
│   │   │   ├── coupons/
│   │   │   ├── scan/
│   │   │   ├── live-dashboard/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   ├── (superadmin)/     # Super admin area
│   │   │   ├── tenants/
│   │   │   ├── subscriptions/
│   │   │   └── platform/
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── layout/           # Layout components
│   │   ├── forms/            # Form components
│   │   ├── tables/           # Data table components
│   │   ├── charts/           # Chart components
│   │   ├── scanner/          # QR Scanner components
│   │   └── common/           # Shared components
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-tenant.ts
│   │   ├── use-scanner.ts
│   │   └── use-realtime.ts
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # Axios instance
│   │   ├── auth.ts           # Auth helpers
│   │   ├── echo.ts           # Laravel Echo config
│   │   └── utils.ts
│   ├── services/             # API service layer
│   │   ├── auth.service.ts
│   │   ├── event.service.ts
│   │   ├── coupon.service.ts
│   │   └── scan.service.ts
│   ├── stores/               # Zustand stores
│   │   ├── auth.store.ts
│   │   └── scan.store.ts
│   └── types/                # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       └── enums.ts
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. Real-time Architecture (Live Dashboard)

```
[Scanner Device]
     │
     │  POST /api/v1/scan
     ▼
[Laravel Controller]
     │
     ├── Validate & process scan
     ├── Update database
     ├── Dispatch CouponScanned event
     │
     ▼
[Laravel Broadcasting (Reverb)]
     │
     ├── Channel: private-tenant.{id}.event.{id}.scans
     │
     ▼
[WebSocket Server (Reverb)]
     │
     ├── Push to all connected clients
     │
     ▼
[Dashboard Client (Next.js)]
     │
     ├── Laravel Echo listener
     ├── Update Zustand store
     ├── Re-render dashboard components
     │   ├── Counter update
     │   ├── Progress bar update
     │   ├── Live feed update
     │   └── Chart update
     │
     ▼
[Display on Screen]
```

### Broadcasting Channels

```php
// channels.php
Broadcast::channel('tenant.{tenantId}.event.{eventId}.scans', function ($user, $tenantId, $eventId) {
    return $user->tenant_id === (int) $tenantId;
});

Broadcast::channel('tenant.{tenantId}.notifications', function ($user, $tenantId) {
    return $user->tenant_id === (int) $tenantId;
});
```

---

## 6. QR Code Architecture

### 6.1 QR Code Payload Structure

```json
{
  "v": 1,
  "t": "tenant_uuid",
  "e": "event_uuid",
  "c": "coupon_uuid",
  "n": "QRB-2026-00001",
  "sig": "hmac_sha256_signature"
}
```

| Field | Description |
|-------|-------------|
| `v` | Payload version |
| `t` | Tenant UUID (short) |
| `e` | Event UUID (short) |
| `c` | Coupon UUID (short) |
| `n` | Coupon number (human-readable) |
| `sig` | HMAC-SHA256 signature for anti-forgery |

### 6.2 QR Code Flow

```
[Generate]                          [Scan]
    │                                  │
    ▼                                  ▼
Create coupon record              Camera capture QR
    │                                  │
    ▼                                  ▼
Generate payload JSON             Decode QR payload
    │                                  │
    ▼                                  ▼
Sign with HMAC-SHA256             Verify HMAC signature
    │                                  │
    ▼                                  ▼
Encode to QR image                Lookup coupon in DB
    │                                  │
    ▼                                  ▼
Store QR image / embed in PDF     Validate status & event
    │                                  │
    ▼                                  ▼
Print / Display                   Show recipient data
                                      │
                                      ▼
                                  Confirm distribution
                                      │
                                      ▼
                                  Broadcast to dashboard
```

---

## 7. Caching Strategy

| Data | Cache Key Pattern | TTL | Invalidation |
|------|------------------|-----|-------------|
| Tenant config | `tenant:{id}:config` | 1 jam | On config update |
| Event detail | `tenant:{id}:event:{id}` | 30 menit | On event update |
| Dashboard stats | `tenant:{id}:event:{id}:stats` | 10 detik | On scan |
| User permissions | `user:{id}:permissions` | 15 menit | On role change |
| Subscription status | `tenant:{id}:subscription` | 1 jam | On payment |
| Coupon validation | `coupon:{uuid}:status` | 5 menit | On scan |

---

## 8. Queue Architecture

### Job Priorities

| Queue | Jobs | Workers | Priority |
|-------|------|---------|----------|
| `high` | CouponScanned, PaymentWebhook | 4 | Immediate |
| `default` | SendNotification, GenerateInvoice | 2 | Normal |
| `low` | GenerateBatchQR, GenerateReport, DataExport | 2 | Background |

### Job Flow

```
[Trigger] → [Dispatch Job] → [Redis Queue] → [Worker Process] → [Complete]
                                    │
                                    ├── Retry (3x with backoff)
                                    │
                                    └── Failed → Dead Letter → Alert
```

---

## 9. PWA Architecture

### Service Worker Strategy

| Resource | Strategy | Detail |
|----------|----------|--------|
| App shell (HTML/CSS/JS) | Cache First | Pre-cache saat install |
| API responses (GET) | Network First | Fallback ke cache |
| API mutations (POST/PUT) | Network Only | Queue jika offline |
| Static assets (images) | Cache First | Long TTL |
| QR Scanner page | Cache First | Harus available offline |

### Offline Scan Flow

```
[Scan QR Code (Offline)]
     │
     ▼
[Validate locally (cached coupon data)]
     │
     ▼
[Store scan result in IndexedDB]
     │
     ▼
[Show "Pending Sync" indicator]
     │
     ... (back online) ...
     │
     ▼
[Background Sync via Service Worker]
     │
     ▼
[POST scans to API]
     │
     ▼
[Clear IndexedDB queue]
     │
     ▼
[Update dashboard]
```

---

## 10. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                  Docker Compose                  │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │   Nginx    │  │  Next.js   │  │  Laravel   │  │
│  │  :80/:443  │  │   :3000    │  │   :8000   │  │
│  └─────┬──────┘  └────────────┘  └─────┬─────┘  │
│        │                               │         │
│  ┌─────┴──────────────────────────────┐│         │
│  │         Internal Network           ││         │
│  └────────────────────────────────────┘│         │
│                                        │         │
│  ┌────────────┐  ┌────────────┐  ┌────┴──────┐  │
│  │ PostgreSQL │  │   Redis    │  │  Reverb   │  │
│  │   :5432    │  │   :6379    │  │  :8080    │  │
│  └────────────┘  └────────────┘  └───────────┘  │
│                                                  │
│  ┌────────────┐  ┌────────────┐                  │
│  │  Worker 1  │  │  Worker 2  │  (Queue)         │
│  └────────────┘  └────────────┘                  │
│                                                  │
│  ┌────────────┐                                  │
│  │  Scheduler │  (Cron)                          │
│  └────────────┘                                  │
└─────────────────────────────────────────────────┘
```

### Docker Services

```yaml
# docker-compose.yml (simplified)
services:
  nginx:        # Reverse proxy
  app:          # Laravel PHP-FPM
  frontend:     # Next.js
  worker:       # Laravel Queue Worker
  scheduler:    # Laravel Scheduler
  reverb:       # Laravel Reverb WebSocket
  postgres:     # PostgreSQL 16
  redis:        # Redis 7
```

---

## 11. Security Architecture

### 11.1 Authentication Flow

```
[Login Request]
     │
     ▼
[Validate Credentials]
     │
     ├── Failed → Return 401
     │
     ▼
[Generate Sanctum Token]
     │
     ├── Access Token (cookie, HttpOnly, SameSite)
     │
     ▼
[Return User Data + CSRF Token]

[Subsequent API Requests]
     │
     ├── Cookie-based auth (SPA same-origin)
     │   OR
     ├── Bearer token (mobile/third-party)
     │
     ▼
[Sanctum Middleware validates]
     │
     ▼
[Tenant Middleware scopes data]
     │
     ▼
[Spatie Permission checks role/permission]
```

### 11.2 Multi-Tenant Security (Session-Based)

```
[Authenticated Request]
     │
     ▼
[Get Tenant from user.tenant_id] ← dari session/token user
     │
     ├── Tenant not found → 404
     ├── Tenant suspended → 403
     │
     ▼
[Apply Tenant Scope]
     │
     ├── Global scope on all tenant models
     ├── Row-level filtering (tenant_id)
     │
     ▼
[Process Request within tenant context]
```

---

## 12. Monitoring & Observability

| Aspect | Tool | Detail |
|--------|------|--------|
| Application monitoring | Laravel Telescope | Request/query/job inspection (dev) |
| Performance monitoring | Laravel Pulse | Real-time app health (production) |
| Error tracking | Sentry (Laravel + Next.js) | Exception tracking |
| Logging | Laravel Log → file/stderr | Structured JSON logging |
| Health check | Custom endpoint | `/api/health` → DB, Redis, Queue status |
| Uptime monitoring | External service (UptimeRobot) | Periodic ping check |
