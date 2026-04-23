# API Design Document

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026
**Base URL:** `https://api.qurbanlink.id/api/v1`

---

## 1. API Conventions

### 1.1 General Rules

- RESTful API design
- JSON request/response body
- API versioning via URL prefix (`/api/v1/`)
- Authentication via Laravel Sanctum (cookie-based untuk SPA, token untuk external)
- Tenant resolution via subdomain atau header `X-Tenant-ID`
- Pagination: cursor-based default, offset-based opsional
- Rate limiting per endpoint

### 1.2 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 150,
    "last_page": 10
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "name": ["The name must be at least 3 characters."]
  }
}
```

### 1.3 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (delete success) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., coupon already claimed) |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 2. Authentication Endpoints

### `POST /auth/register`

Register tenant baru.

```
Request:
{
  "name": "Ahmad Fauzi",
  "email": "admin@masjid-alfurqon.id",
  "password": "SecureP@ss123",
  "password_confirmation": "SecureP@ss123",
  "organization_name": "Masjid Al-Furqon",
  "phone": "081234567890"
}

Response: 201
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "Ahmad Fauzi", "email": "..." },
    "tenant": { "id": "uuid", "name": "Masjid Al-Furqon", "slug": "masjid-al-furqon" }
  },
  "message": "Registration successful. Please verify your email."
}
```

### `POST /auth/login`

```
Request:
{
  "email": "admin@masjid-alfurqon.id",
  "password": "SecureP@ss123"
}

Response: 200
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "...", "email": "...", "roles": ["tenant_admin"] },
    "tenant": { "id": "uuid", "name": "...", "slug": "..." },
    "token": "1|abc..." // only for token-based auth
  }
}
```

### `POST /auth/logout`

```
Response: 200
{ "success": true, "message": "Logged out successfully" }
```

### `POST /auth/forgot-password`

```
Request: { "email": "admin@masjid-alfurqon.id" }
Response: 200
{ "success": true, "message": "Password reset link sent to your email" }
```

### `POST /auth/reset-password`

```
Request:
{
  "email": "admin@masjid-alfurqon.id",
  "token": "reset-token",
  "password": "NewSecureP@ss",
  "password_confirmation": "NewSecureP@ss"
}
Response: 200
{ "success": true, "message": "Password reset successful" }
```

### `POST /auth/verify-email/{id}/{hash}`

```
Response: 200
{ "success": true, "message": "Email verified successfully" }
```

### `GET /auth/me`

```
Response: 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmad Fauzi",
    "email": "...",
    "roles": ["tenant_admin"],
    "permissions": ["manage-events", "manage-recipients", ...],
    "tenant": { "id": "uuid", "name": "...", "plan": "starter" }
  }
}
```

---

## 3. Tenant Management Endpoints

### `GET /tenant/profile`

```
Auth: tenant_admin
Response: 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Masjid Al-Furqon",
    "slug": "masjid-al-furqon",
    "email": "...",
    "phone": "...",
    "address": "...",
    "settings": { ... },
    "subscription": { "plan": "starter", "status": "active", ... }
  }
}
```

### `PUT /tenant/profile`

```
Auth: tenant_admin
Request:
{
  "name": "Masjid Al-Furqon Bandung",
  "address": "Jl. Merdeka No. 10",
  "city": "Bandung",
  "province": "Jawa Barat",
  "phone": "081234567890"
}
Response: 200
```

### `PUT /tenant/settings`

```
Auth: tenant_admin
Request:
{
  "timezone": "Asia/Jakarta",
  "coupon_prefix": "MAF",
  "branding": { "primary_color": "#10B981" }
}
Response: 200
```

---

## 4. Subscription Endpoints

### `GET /subscriptions/plans`

```
Auth: public
Response: 200
{
  "success": true,
  "data": [
    { "id": "free", "name": "Free", "price": 0, "coupon_quota": 100, "features": [...] },
    { "id": "starter", "name": "Starter", "price": 99000, ... },
    { "id": "professional", "name": "Professional", "price": 249000, ... },
    { "id": "enterprise", "name": "Enterprise", "price": null, ... }
  ]
}
```

### `POST /subscriptions/subscribe`

```
Auth: tenant_admin
Request:
{
  "plan": "starter",
  "billing_cycle": "monthly"
}
Response: 201
{
  "success": true,
  "data": {
    "subscription": { ... },
    "payment": {
      "id": "uuid",
      "invoice_number": "INV-2026-0001",
      "amount": 99000,
      "status": "pending",
      "payment_instructions": {
        "bank": "BCA",
        "account_number": "123456789",
        "unique_code": 123,
        "total_transfer": 99123,
        "expired_at": "2026-03-01T00:00:00Z"
      }
    }
  }
}
```

### `GET /subscriptions/current`

```
Auth: tenant_admin
Response: 200
{
  "success": true,
  "data": {
    "plan": "starter",
    "status": "active",
    "coupon_quota": 500,
    "coupon_used": 120,
    "coupon_remaining": 380,
    "expires_at": "2026-04-01T00:00:00Z",
    "auto_renew": true
  }
}
```

### `GET /subscriptions/payments`

```
Auth: tenant_admin
Response: 200 (paginated)
{
  "data": [
    {
      "id": "uuid",
      "invoice_number": "INV-2026-0001",
      "amount": 99000,
      "status": "paid",
      "paid_at": "2026-02-27T10:00:00Z"
    }
  ]
}
```

### `POST /webhooks/moota` (Webhook — no auth, signature verification)

```
Request (from Moota):
{
  "mutation_id": "...",
  "bank_id": "...",
  "amount": 99123,
  "description": "...",
  "type": "CR",
  "created_at": "..."
}
Response: 200
```

---

## 5. Event Endpoints

### `GET /events`

```
Auth: tenant_admin, operator
Query: ?status=active&year=2026&page=1&per_page=10
Response: 200 (paginated list)
```

### `POST /events`

```
Auth: tenant_admin
Request:
{
  "name": "Kurban Idul Adha 1447H",
  "description": "Distribusi daging kurban masjid Al-Furqon",
  "event_date": "2026-06-17",
  "start_time": "08:00",
  "end_time": "14:00",
  "settings": {
    "categories": [
      { "key": "fakir", "label": "Fakir", "quota": 100 },
      { "key": "miskin", "label": "Miskin", "quota": 100 },
      { "key": "umum", "label": "Umum", "quota": 200 }
    ]
  }
}
Response: 201
```

### `GET /events/{id}`

```
Auth: tenant_admin, operator
Response: 200 (event detail + statistics)
```

### `PUT /events/{id}`

```
Auth: tenant_admin
```

### `DELETE /events/{id}`

```
Auth: tenant_admin (soft delete)
```

### `POST /events/{id}/activate`

```
Auth: tenant_admin
Response: 200 (change status to active)
```

### `POST /events/{id}/complete`

```
Auth: tenant_admin
Response: 200 (change status to completed)
```

---

## 6. Distribution Location Endpoints

### `GET /events/{eventId}/locations`

### `POST /events/{eventId}/locations`

```
Request: { "name": "Pos 1 - Halaman Masjid", "address": "..." }
```

### `PUT /events/{eventId}/locations/{id}`

### `DELETE /events/{eventId}/locations/{id}`

---

## 7. Donor (Pekurban) Endpoints

### `GET /events/{eventId}/donors`

```
Query: ?search=ahmad&page=1&per_page=15
```

### `POST /events/{eventId}/donors`

```
Request:
{
  "name": "H. Ahmad",
  "phone": "08123456789",
  "address": "Jl. Mawar No. 5",
  "notes": "Kurban sapi, 1/7 bagian"
}
```

### `GET /events/{eventId}/donors/{id}`

### `PUT /events/{eventId}/donors/{id}`

### `DELETE /events/{eventId}/donors/{id}`

### `POST /events/{eventId}/donors/import`

```
Request: multipart/form-data { file: donors.xlsx }
Response: 200
{
  "success": true,
  "data": { "imported": 50, "skipped": 2, "errors": [...] }
}
```

### `PATCH /events/{eventId}/donors/{id}/status`

```
Request: { "submission_status": "submitted" }
```

---

## 8. Animal Endpoints

### `GET /events/{eventId}/animals`

```
Query: ?type=sapi&status=registered&donor_id=uuid
```

### `POST /events/{eventId}/animals`

```
Request:
{
  "donor_id": "uuid",
  "type": "sapi",
  "breed": "Limousin",
  "weight": 350.5,
  "color": "Coklat",
  "estimated_portions": 70
}
```

### `GET /events/{eventId}/animals/{id}`

### `PUT /events/{eventId}/animals/{id}`

### `DELETE /events/{eventId}/animals/{id}`

### `PATCH /events/{eventId}/animals/{id}/status`

```
Request: { "status": "slaughtered", "slaughtered_at": "2026-06-17T06:00:00Z" }
```

---

## 9. Recipient Endpoints

### `GET /events/{eventId}/recipients`

```
Query: ?category=fakir&search=siti&has_coupon=true&page=1&per_page=15
```

### `POST /events/{eventId}/recipients`

```
Request:
{
  "name": "Siti Aminah",
  "phone": "08987654321",
  "address": "Jl. Kenanga RT 05/03",
  "rt_rw": "05/03",
  "kelurahan": "Sukamaju",
  "kecamatan": "Cibeunying",
  "category": "fakir",
  "portions": 1
}
```

### `GET /events/{eventId}/recipients/{id}`

### `PUT /events/{eventId}/recipients/{id}`

### `DELETE /events/{eventId}/recipients/{id}`

### `POST /events/{eventId}/recipients/import`

```
Request: multipart/form-data { file: recipients.xlsx }
```

### `GET /events/{eventId}/recipients/export`

```
Query: ?format=xlsx (atau pdf)
Response: File download
```

### `POST /events/{eventId}/recipients/check-duplicates`

```
Response: 200
{
  "data": {
    "duplicates": [
      { "recipient_id": "uuid", "matches": ["uuid2"], "field": "name+address" }
    ]
  }
}
```

---

## 10. Coupon Endpoints

### `GET /events/{eventId}/coupons`

```
Query: ?status=generated&category=fakir&search=QRB-2026&page=1
```

### `POST /events/{eventId}/coupons/generate`

Generate kupon untuk penerima yang belum punya kupon.

```
Request:
{
  "recipient_ids": ["uuid1", "uuid2"],  // optional, jika kosong = semua
  "prefix": "QRB"                       // optional, default dari tenant settings
}
Response: 202 (Accepted — async job)
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "total_coupons": 150,
    "status": "processing"
  },
  "message": "Coupon generation started. You will be notified when complete."
}
```

### `GET /events/{eventId}/coupons/generate-status/{jobId}`

```
Response: 200
{
  "data": {
    "status": "completed",  // processing, completed, failed
    "total": 150,
    "generated": 150,
    "failed": 0
  }
}
```

### `GET /events/{eventId}/coupons/{id}`

Detail kupon + data penerima.

### `POST /events/{eventId}/coupons/{id}/void`

```
Request: { "reason": "Penerima batal hadir" }
Response: 200
```

### `POST /events/{eventId}/coupons/{id}/regenerate`

```
Response: 200 (void old + generate new)
```

### `GET /events/{eventId}/coupons/print`

Download PDF kupon siap cetak.

```
Query: ?recipient_ids=uuid1,uuid2 (optional, kosong = semua)
       &layout=4_per_page (default)
Response: application/pdf (file download)
```

---

## 11. Scan Endpoints

### `POST /events/{eventId}/scan`

**Endpoint utama untuk scan kupon.**

```
Request:
{
  "qr_payload": "{\"v\":1,\"t\":\"...\",\"e\":\"...\",\"c\":\"...\",\"n\":\"QRB-2026-00001\",\"sig\":\"...\"}",
  "location_id": "uuid",           // optional
  "latitude": -6.9175,             // optional
  "longitude": 107.6191            // optional
}

Response (Success): 200
{
  "success": true,
  "data": {
    "scan_id": "uuid",
    "coupon": {
      "coupon_number": "QRB-2026-00001",
      "status": "claimed"
    },
    "recipient": {
      "name": "Siti Aminah",
      "category": "Fakir",
      "portions": 1,
      "address": "Jl. Kenanga RT 05/03"
    },
    "scanned_at": "2026-06-17T09:15:30Z"
  },
  "message": "Kupon valid. Distribusi berhasil dicatat."
}

Response (Already Claimed): 409
{
  "success": false,
  "message": "Kupon sudah digunakan",
  "data": {
    "claimed_at": "2026-06-17T08:30:00Z",
    "claimed_by": "Operator Ahmad"
  }
}

Response (Invalid): 400
{
  "success": false,
  "message": "Kupon tidak valid atau sudah dibatalkan"
}
```

### `POST /events/{eventId}/scan/manual`

Scan manual via nomor kupon.

```
Request:
{
  "coupon_number": "QRB-2026-00001",
  "location_id": "uuid"
}
Response: same as scan
```

### `GET /events/{eventId}/scans`

Riwayat scan.

```
Query: ?scanned_by=uuid&scan_result=success&page=1&per_page=20
```

### `POST /events/{eventId}/scans/sync`

Sync offline scans.

```
Request:
{
  "scans": [
    {
      "qr_payload": "...",
      "scanned_at": "2026-06-17T09:15:30Z",
      "location_id": "uuid"
    },
    { ... }
  ]
}
Response: 200
{
  "data": {
    "synced": 10,
    "failed": 1,
    "results": [
      { "coupon_number": "QRB-2026-00001", "status": "success" },
      { "coupon_number": "QRB-2026-00002", "status": "already_claimed" }
    ]
  }
}
```

---

## 12. Dashboard Endpoints

### `GET /events/{eventId}/dashboard/stats`

```
Auth: tenant_admin, operator
Response: 200
{
  "data": {
    "total_coupons": 400,
    "distributed": 235,
    "remaining": 165,
    "percentage": 58.75,
    "by_category": [
      { "category": "fakir", "total": 100, "distributed": 80, "percentage": 80 },
      { "category": "miskin", "total": 100, "distributed": 65, "percentage": 65 },
      { "category": "umum", "total": 200, "distributed": 90, "percentage": 45 }
    ],
    "by_location": [
      { "location": "Pos 1", "distributed": 120 },
      { "location": "Pos 2", "distributed": 115 }
    ],
    "hourly_distribution": [
      { "hour": "08:00", "count": 45 },
      { "hour": "09:00", "count": 78 },
      { "hour": "10:00", "count": 112 }
    ],
    "animals_summary": {
      "total": 10,
      "slaughtered": 10,
      "distributed": 7
    }
  }
}
```

### `GET /events/{eventId}/dashboard/live-feed`

```
Query: ?limit=20
Response: 200
{
  "data": [
    {
      "scan_id": "uuid",
      "coupon_number": "QRB-2026-00235",
      "recipient_name": "Siti Aminah",
      "category": "fakir",
      "scanned_by": "Ahmad",
      "location": "Pos 1",
      "scanned_at": "2026-06-17T09:15:30Z"
    },
    { ... }
  ]
}
```

> **Real-time updates via WebSocket channel:** `private-tenant.{id}.event.{id}.scans`

---

## 13. Report Endpoints

### `GET /events/{eventId}/reports/distribution`

```
Query: ?format=json (default) | pdf | xlsx
```

### `GET /events/{eventId}/reports/unclaimed`

```
Penerima yang belum mengambil daging.
Query: ?format=json | pdf | xlsx
```

### `GET /events/{eventId}/reports/per-animal`

```
Distribusi per hewan kurban / pekurban.
```

### `POST /events/{eventId}/reports/generate`

```
Request: { "type": "distribution", "format": "pdf" }
Response: 202
{
  "data": { "job_id": "uuid", "status": "processing" }
}
```

### `GET /reports/download/{jobId}`

```
Response: File download (PDF/XLSX)
```

---

## 14. User Management Endpoints (Tenant-level)

### `GET /users`

```
Auth: tenant_admin
Query: ?role=operator&search=ahmad
```

### `POST /users`

```
Auth: tenant_admin
Request:
{
  "name": "Ahmad Operator",
  "email": "ahmad@masjid-alfurqon.id",
  "password": "TempP@ss123",
  "role": "operator"
}
```

### `PUT /users/{id}`

### `DELETE /users/{id}`

### `PUT /users/{id}/role`

```
Request: { "role": "operator" }
```

---

## 15. Super Admin Endpoints

### `GET /admin/dashboard`

Platform-wide statistics.

### `GET /admin/tenants`

```
Query: ?status=active&plan=starter&search=masjid&page=1
```

### `GET /admin/tenants/{id}`

### `PATCH /admin/tenants/{id}/suspend`

```
Request: { "reason": "Payment overdue" }
```

### `PATCH /admin/tenants/{id}/activate`

### `GET /admin/subscriptions`

### `POST /admin/subscriptions/{id}/manual-activate`

### `GET /admin/payments`

### `GET /admin/audit-logs`

```
Query: ?tenant_id=uuid&action=scan&date_from=2026-06-17
```

---

## 16. Rate Limiting

| Endpoint Group | Limit | Window |
|---------------|-------|--------|
| Auth (login/register) | 5 requests | 1 minute |
| Auth (password reset) | 3 requests | 1 minute |
| Scan | 30 requests | 1 minute |
| General API | 60 requests | 1 minute |
| Report generation | 5 requests | 5 minutes |
| Bulk operations (import/generate) | 3 requests | 5 minutes |
| Webhook (Moota) | 100 requests | 1 minute |

---

## 17. WebSocket Events

### Channel: `private-tenant.{tenantId}.event.{eventId}.scans`

**Event: `ScanCompleted`**
```json
{
  "scan_id": "uuid",
  "coupon_number": "QRB-2026-00235",
  "recipient_name": "Siti Aminah",
  "category": "fakir",
  "portions": 1,
  "scanned_by": "Ahmad",
  "location": "Pos 1",
  "scanned_at": "2026-06-17T09:15:30Z",
  "stats": {
    "total_distributed": 236,
    "total_coupons": 400,
    "percentage": 59.0
  }
}
```

### Channel: `private-tenant.{tenantId}.notifications`

**Event: `PaymentReceived`**
```json
{
  "payment_id": "uuid",
  "amount": 99000,
  "status": "paid",
  "message": "Pembayaran berhasil dikonfirmasi"
}
```

**Event: `CouponGenerationCompleted`**
```json
{
  "job_id": "uuid",
  "total_generated": 150,
  "status": "completed"
}
```
