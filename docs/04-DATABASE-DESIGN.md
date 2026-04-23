# Database Design Document

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026
**Database:** PostgreSQL 16

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   tenants   │────<│    users      │────<│ model_has_roles   │
│             │     │              │     └──────────────────┘
│  id (PK)    │     │  id (PK)     │              │
│  name       │     │  tenant_id   │     ┌────────┴─────────┐
│  slug       │     │  name        │     │     roles         │
│  domain     │     │  email       │     │                  │
│  settings   │     │  password    │     │  id (PK)         │
│  ...        │     │  ...         │     │  name            │
└──────┬──────┘     └──────────────┘     │  guard_name      │
       │                                  └────────┬─────────┘
       │                                           │
       │            ┌──────────────┐     ┌─────────┴────────┐
       │            │ subscriptions│     │ role_has_perms    │
       ├───────────<│              │     └──────────────────┘
       │            │  id (PK)     │              │
       │            │  tenant_id   │     ┌────────┴─────────┐
       │            │  plan        │     │  permissions     │
       │            │  status      │     │                  │
       │            │  ...         │     │  id (PK)         │
       │            └──────────────┘     │  name            │
       │                                  └──────────────────┘
       │
       │            ┌──────────────┐
       ├───────────<│   events     │
       │            │              │
       │            │  id (PK)     │
       │            │  tenant_id   │
       │            │  name        │
       │            │  event_date  │
       │            │  ...         │
       │            └──────┬───────┘
       │                   │
       │         ┌─────────┼──────────────┐
       │         │         │              │
       │         ▼         ▼              ▼
       │  ┌────────────┐ ┌──────────┐ ┌──────────────┐
       │  │  animals   │ │recipients│ │  donors      │
       │  │            │ │          │ │ (pekurban)   │
       │  │  id (PK)   │ │ id (PK)  │ │              │
       │  │  event_id  │ │ event_id │ │ id (PK)      │
       │  │  donor_id  │ │ name     │ │ event_id     │
       │  │  type      │ │ category │ │ name         │
       │  │  weight    │ │ ...      │ │ phone        │
       │  │  ...       │ │          │ │ ...          │
       │  └────────────┘ └────┬─────┘ └──────────────┘
       │                      │
       │                      ▼
       │              ┌──────────────┐
       │              │   coupons    │
       │              │              │
       │              │  id (PK)     │
       │              │  event_id    │
       │              │  recipient_id│
       │              │  coupon_number│
       │              │  qr_payload  │
       │              │  status      │
       │              │  ...         │
       │              └──────┬───────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │   scans      │
       │              │              │
       │              │  id (PK)     │
       │              │  coupon_id   │
       │              │  scanned_by  │
       │              │  scanned_at  │
       │              │  ...         │
       │              └──────────────┘
       │
       │            ┌──────────────────┐
       ├───────────<│ distribution_    │
       │            │ locations        │
       │            │                  │
       │            │  id (PK)         │
       │            │  event_id        │
       │            │  name            │
       │            │  address         │
       │            └──────────────────┘
       │
       │            ┌──────────────────┐
       └───────────<│  payments        │
                    │                  │
                    │  id (PK)         │
                    │  tenant_id       │
                    │  subscription_id │
                    │  amount          │
                    │  status          │
                    │  moota_ref       │
                    └──────────────────┘
```

---

## 2. Table Definitions

### 2.1 `tenants` — Data Organisasi/Tenant

```sql
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    domain          VARCHAR(255) UNIQUE,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    address         TEXT,
    city            VARCHAR(100),
    province        VARCHAR(100),
    logo_path       VARCHAR(500),
    settings        JSONB DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,
    suspended_at    TIMESTAMP,
    suspended_reason TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_tenants_is_active ON tenants(is_active);
```

**Settings JSONB structure:**
```json
{
  "timezone": "Asia/Jakarta",
  "locale": "id",
  "date_format": "DD/MM/YYYY",
  "coupon_prefix": "QRB",
  "coupon_layout": "default",
  "branding": {
    "primary_color": "#10B981",
    "organization_type": "masjid"
  }
}
```

### 2.2 `users` — Data User

```sql
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP,
    password          VARCHAR(255) NOT NULL,
    phone             VARCHAR(20),
    avatar_path       VARCHAR(500),
    is_active         BOOLEAN DEFAULT TRUE,
    last_login_at     TIMESTAMP,
    last_login_ip     VARCHAR(45),
    remember_token    VARCHAR(100),
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW(),
    deleted_at        TIMESTAMP,

    UNIQUE(email, tenant_id)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
```

> **Note:** `tenant_id` NULL = Super Admin (platform-level user)

### 2.3 `subscriptions` — Data Langganan

```sql
CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan            VARCHAR(50) NOT NULL DEFAULT 'free',
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    coupon_quota    INTEGER NOT NULL DEFAULT 100,
    coupon_used     INTEGER NOT NULL DEFAULT 0,
    price           DECIMAL(12,2) DEFAULT 0,
    billing_cycle   VARCHAR(20) DEFAULT 'monthly',
    starts_at       TIMESTAMP NOT NULL,
    expires_at      TIMESTAMP,
    grace_ends_at   TIMESTAMP,
    cancelled_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- plan: free, starter, professional, enterprise
-- status: active, expired, cancelled, suspended
-- billing_cycle: monthly, yearly

CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);
```

### 2.4 `payments` — Riwayat Pembayaran

```sql
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subscription_id     UUID REFERENCES subscriptions(id),
    payment_type        VARCHAR(50) NOT NULL,
    amount              DECIMAL(12,2) NOT NULL,
    currency            VARCHAR(3) DEFAULT 'IDR',
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method      VARCHAR(50),
    moota_mutation_id   VARCHAR(100),
    moota_bank_id       VARCHAR(100),
    moota_amount        DECIMAL(12,2),
    invoice_number      VARCHAR(50) UNIQUE,
    invoice_url         VARCHAR(500),
    paid_at             TIMESTAMP,
    expired_at          TIMESTAMP,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- payment_type: subscription, addon_coupon
-- status: pending, paid, failed, expired, refunded

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_number);
CREATE INDEX idx_payments_moota ON payments(moota_mutation_id);
```

### 2.5 `events` — Event Kurban

```sql
CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    event_date      DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    year            INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',
    settings        JSONB DEFAULT '{}',
    total_coupons   INTEGER DEFAULT 0,
    distributed     INTEGER DEFAULT 0,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

-- status: draft, active, ongoing, completed, archived

CREATE INDEX idx_events_tenant ON events(tenant_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_year ON events(tenant_id, year);
```

**Settings JSONB structure:**
```json
{
  "categories": [
    {"key": "fakir", "label": "Fakir", "quota": 100},
    {"key": "miskin", "label": "Miskin", "quota": 100},
    {"key": "umum", "label": "Umum", "quota": 200},
    {"key": "panitia", "label": "Panitia", "quota": 50}
  ],
  "portions_per_animal": {
    "sapi": 70,
    "kambing": 7
  }
}
```

### 2.6 `distribution_locations` — Lokasi Distribusi

```sql
CREATE TABLE distribution_locations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    address     TEXT,
    latitude    DECIMAL(10,8),
    longitude   DECIMAL(11,8),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dist_locations_event ON distribution_locations(event_id);
```

### 2.7 `donors` — Data Shohibul Kurban / Pekurban

```sql
CREATE TABLE donors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    address         TEXT,
    nik             VARCHAR(20),
    submission_status VARCHAR(20) DEFAULT 'pending',
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

-- submission_status: pending, submitted (hewan diserahkan)

CREATE INDEX idx_donors_tenant ON donors(tenant_id);
CREATE INDEX idx_donors_event ON donors(event_id);
```

### 2.8 `animals` — Data Hewan Kurban

```sql
CREATE TABLE animals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    donor_id        UUID REFERENCES donors(id) ON DELETE SET NULL,
    type            VARCHAR(20) NOT NULL,
    breed           VARCHAR(100),
    weight          DECIMAL(6,2),
    color           VARCHAR(50),
    estimated_portions INTEGER,
    status          VARCHAR(20) NOT NULL DEFAULT 'registered',
    slaughtered_at  TIMESTAMP,
    photo_path      VARCHAR(500),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

-- type: sapi, kambing, domba, unta
-- status: registered, slaughtered, processed, distributed

CREATE INDEX idx_animals_tenant ON animals(tenant_id);
CREATE INDEX idx_animals_event ON animals(event_id);
CREATE INDEX idx_animals_donor ON animals(donor_id);
CREATE INDEX idx_animals_status ON animals(status);
```

### 2.9 `recipients` — Data Penerima Kurban

```sql
CREATE TABLE recipients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    nik             VARCHAR(20),
    phone           VARCHAR(20),
    address         TEXT,
    rt_rw           VARCHAR(20),
    kelurahan       VARCHAR(100),
    kecamatan       VARCHAR(100),
    category        VARCHAR(50) NOT NULL,
    portions        INTEGER NOT NULL DEFAULT 1,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP
);

-- category: fakir, miskin, umum, panitia, dll (configurable per event)

CREATE INDEX idx_recipients_tenant ON recipients(tenant_id);
CREATE INDEX idx_recipients_event ON recipients(event_id);
CREATE INDEX idx_recipients_category ON recipients(category);
CREATE INDEX idx_recipients_name ON recipients(tenant_id, name);
```

### 2.10 `coupons` — Kupon QR Code

```sql
CREATE TABLE coupons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    recipient_id    UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
    coupon_number   VARCHAR(50) NOT NULL,
    qr_payload      TEXT NOT NULL,
    qr_signature    VARCHAR(128) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'generated',
    generated_at    TIMESTAMP DEFAULT NOW(),
    claimed_at      TIMESTAMP,
    voided_at       TIMESTAMP,
    void_reason     TEXT,
    expires_at      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- status: generated, claimed, voided, expired

CREATE UNIQUE INDEX idx_coupons_number ON coupons(tenant_id, coupon_number);
CREATE INDEX idx_coupons_tenant ON coupons(tenant_id);
CREATE INDEX idx_coupons_event ON coupons(event_id);
CREATE INDEX idx_coupons_recipient ON coupons(recipient_id);
CREATE INDEX idx_coupons_status ON coupons(event_id, status);
CREATE INDEX idx_coupons_qr_sig ON coupons(qr_signature);
```

### 2.11 `scans` — Log Scan Kupon

```sql
CREATE TABLE scans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    coupon_id       UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    location_id     UUID REFERENCES distribution_locations(id),
    scanned_by      UUID NOT NULL REFERENCES users(id),
    scan_method     VARCHAR(20) NOT NULL DEFAULT 'qr',
    scan_result     VARCHAR(20) NOT NULL,
    device_info     VARCHAR(255),
    ip_address      VARCHAR(45),
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    synced_at       TIMESTAMP,
    scanned_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- scan_method: qr, manual
-- scan_result: success, already_claimed, invalid, expired, voided

CREATE INDEX idx_scans_tenant ON scans(tenant_id);
CREATE INDEX idx_scans_event ON scans(event_id);
CREATE INDEX idx_scans_coupon ON scans(coupon_id);
CREATE INDEX idx_scans_scanned_by ON scans(scanned_by);
CREATE INDEX idx_scans_scanned_at ON scans(event_id, scanned_at);
```

### 2.12 `audit_logs` — Audit Trail

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,
    auditable_type  VARCHAR(100) NOT NULL,
    auditable_id    UUID NOT NULL,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_auditable ON audit_logs(auditable_type, auditable_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

### 2.13 `email_notifications` — Log Email

```sql
CREATE TABLE email_notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID REFERENCES tenants(id),
    user_id         UUID REFERENCES users(id),
    type            VARCHAR(50) NOT NULL,
    to_email        VARCHAR(255) NOT NULL,
    subject         VARCHAR(500),
    status          VARCHAR(20) DEFAULT 'pending',
    sent_at         TIMESTAMP,
    failed_at       TIMESTAMP,
    error_message   TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP DEFAULT NOW()
);

-- type: registration, verification, password_reset, account_activated,
--       subscription_reminder, payment_confirmation
-- status: pending, sent, failed

CREATE INDEX idx_email_notif_tenant ON email_notifications(tenant_id);
CREATE INDEX idx_email_notif_type ON email_notifications(type);
CREATE INDEX idx_email_notif_status ON email_notifications(status);
```

### 2.14 Spatie Permission Tables (Auto-generated)

```sql
-- These tables are auto-created by Spatie Permission package
-- Listed here for reference

-- permissions
-- roles
-- model_has_permissions
-- model_has_roles
-- role_has_permissions
```

---

## 3. Database Indexes Summary

### Performance-Critical Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| coupons | `(tenant_id, coupon_number)` UNIQUE | Quick coupon lookup saat scan |
| coupons | `(event_id, status)` | Dashboard statistics |
| coupons | `(qr_signature)` | QR validation |
| scans | `(event_id, scanned_at)` | Live dashboard feed |
| scans | `(coupon_id)` | Check if coupon already scanned |
| recipients | `(event_id)` | List recipients per event |
| events | `(tenant_id, year)` | Event listing per tenant per year |

---

## 4. Data Integrity Constraints

| Constraint | Table | Rule |
|-----------|-------|------|
| Unique coupon per recipient per event | coupons | One active coupon per recipient per event |
| Unique coupon number per tenant | coupons | `UNIQUE(tenant_id, coupon_number)` |
| Coupon status flow | coupons | generated → claimed / voided / expired (no reverse) |
| Scan only active coupons | scans | FK to coupon + app-level validation |
| Tenant data isolation | all tables | All queries scoped by tenant_id |
| Soft delete | major tables | `deleted_at` for recoverable deletes |

---

## 5. Migration Order

```
01 - create_tenants_table
02 - create_users_table
03 - create_personal_access_tokens_table (Sanctum)
04 - create_permission_tables (Spatie)
05 - create_subscriptions_table
06 - create_payments_table
07 - create_events_table
08 - create_distribution_locations_table
09 - create_donors_table
10 - create_animals_table
11 - create_recipients_table
12 - create_coupons_table
13 - create_scans_table
14 - create_audit_logs_table
15 - create_email_notifications_table
```

---

## 6. Seed Data

### 6.1 Default Roles & Permissions

```
Roles:
- super_admin (platform-level)
- tenant_admin
- operator
- viewer

Permissions: (lihat detail di 07-ROLES-PERMISSIONS.md)
```

### 6.2 Default Subscription Plans

```
- free (100 kupon, 1 event/tahun)
- starter (500 kupon, 3 event/tahun)
- professional (2000 kupon, unlimited event)
- enterprise (unlimited)
```
