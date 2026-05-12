# 09 — Customer Order to Payment Flow (End-to-End)

Dokumen ini menjelaskan alur lengkap dari customer **memesan produk/jasa** (paket langganan) hingga **memproses pembayaran** dan subscription aktif di platform Tawzii / Distribusi Kurban.

> **Konteks produk**: produk yang dijual = **paket langganan SaaS multi-tenant** (Free / Starter / Professional / Enterprise) + **add-on top-up kuota kupon**. Pembayaran via **Midtrans Snap**.

---

## 1. Sequence Flow (High Level)

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Customer │   │ Frontend │   │ Backend  │   │ Midtrans │
└─────┬────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
      │             │              │              │
  (1) │ Register    │              │              │
      ├────────────►│              │              │
      │             │ POST /auth/register         │
      │             ├─────────────►│              │
      │             │              │ create tenant + user + free sub + event
      │             │◄─────────────┤              │
      │◄────────────┤ token + user │              │
      │             │              │              │
  (2) │ Buka /subscription          │              │
      ├────────────►│ GET /plans, /current, /payments
      │             ├─────────────►│              │
      │             │◄─────────────┤              │
      │◄────────────┤ render UI    │              │
      │             │              │              │
  (3) │ Pilih paket + cycle → klik "Bayar"        │
      ├────────────►│              │              │
      │             │ POST /subscriptions/subscribe              │
      │             ├─────────────►│              │
      │             │              │ create Payment(pending)     │
      │             │              │ MidtransService->createSnapToken
      │             │              ├─────────────►│
      │             │              │◄─────────────┤ snap_token
      │             │◄─────────────┤ {snap_token, payment_url}   │
      │             │              │              │
  (4) │ Snap popup terbuka         │              │
      │◄────────────┤ openSnap(token)             │
      │             │              │              │
  (5) │ Bayar (CC/VA/QRIS/eWallet) │              │
      ├──────────────────────────────────────────►│
      │                                            │
  (6) │                            │ POST /webhooks/midtrans
      │                            │◄─────────────┤
      │                            │ verify signature
      │                            │ update Payment.status=paid
      │                            │ activateSubscription()
      │                            │   - cancel old subs
      │                            │   - create new Sub(active)
      │                            │              │
  (7) │             │ onSuccess callback          │
      │             │ refresh queries             │
      │◄────────────┤ dashboard: status "Aktif"   │
```

---

## 2. Tahap per Tahap

### Tahap 1 — Registrasi Tenant & Auto Free Plan

| Item | Detail |
|---|---|
| **Endpoint** | `POST /api/v1/auth/register` |
| **Controller** | [AuthController.php:20-53](../backend/app/Http/Controllers/Api/V1/AuthController.php#L20-L53) |
| **Action** | [RegisterAction.php:17-79](../backend/app/Actions/Auth/RegisterAction.php#L17-L79) |
| **Halaman FE** | `/register` |

**Field yang divalidasi:**
- User: `name`, `email` (unique), `password` (confirmed, strong)
- Organisasi: `organization_name`, `phone`, `city`, `province`
- Event awal: `event_name`, `event_date` (after today), `event_description`

**Yang terjadi di backend:**
1. Buat `Tenant` (slug auto-unique).
2. Buat `User` dengan role `tenant_admin`.
3. **Auto-create Subscription gratis** (`status=active`, `coupon_quota=100`, no expiry).
4. Buat `Event` pertama dari data registrasi.
5. Issue Sanctum token.

**Hasil:** customer sudah login dengan paket gratis aktif. Upgrade ke paket berbayar dilakukan dari dashboard `/subscription` kapan saja.

---

### Tahap 2 — Browsing Paket di Dashboard

| Item | Detail |
|---|---|
| **Halaman FE** | [subscription/page.tsx](../frontend/src/app/(dashboard)/subscription/page.tsx) |
| **Endpoint plans** | `GET /api/v1/subscriptions/plans` |
| **Endpoint current** | `GET /api/v1/subscriptions/current` |
| **Endpoint payments** | `GET /api/v1/subscriptions/payments` |

**Apa yang ditampilkan:**
- **Current Plan Card**: nama paket, harga, billing cycle, tanggal mulai/expired, progress kuota kupon (`coupon_used / coupon_quota`), daftar fitur aktif/non-aktif.
- **Payment History Table**: invoice #, amount, status badge (paid/pending/failed), action **"Lanjutkan"** untuk pending.
- **Dialog Pilih Paket**: grid responsif, toggle bulanan/tahunan (diskon 20% yearly), highlight paket "Populer" (Professional).

**Struktur data Plan** (dari DB `plans`):
```
slug, name, price_monthly, price_yearly,
coupon_quota (0 = unlimited),
features: { custom_branding, email_notifications, api_access, ... }
```

---

### Tahap 3 — Customer Memesan Paket (Create Order)

| Item | Detail |
|---|---|
| **Endpoint** | `POST /api/v1/subscriptions/subscribe` |
| **Controller** | [SubscriptionController.php:47-127](../backend/app/Http/Controllers/Api/V1/SubscriptionController.php#L47-L127) |
| **FE Service** | [subscription.service.ts](../frontend/src/services/subscription.service.ts) `createPayment()` |
| **FE Hook** | [use-payment.ts](../frontend/src/hooks/use-payment.ts) `pay()` |

**Request:**
```json
{
  "plan": "professional",
  "billing_cycle": "monthly"
}
```

**Logika backend:**
1. Validasi plan exists & active.
2. Ambil harga sesuai `billing_cycle` (monthly/yearly).
3. **Jika harga = 0 (free):** langsung aktivasi, return `{ is_free: true, snap_token: null }`.
4. **Jika berbayar:**
   - Generate invoice number `INV-YYYYMMDD-XXXXXX`.
   - Buat `Payment` row: `status=pending`, `payment_type=Subscription`, `expired_at = now + 24h`, `metadata = { plan, billing_cycle, plan_name, coupon_quota }`.
   - Panggil `MidtransService::createSnapToken()`.
   - Simpan `snap_token` & `snap_redirect_url` ke Payment.

**Response:**
```json
{
  "is_free": false,
  "snap_token": "abc123...",
  "payment_url": "https://app.sandbox.midtrans.com/snap/v3/redirection/abc123",
  "invoice_number": "INV-20260427-K7M3X9",
  "amount": 299000
}
```

---

### Tahap 4 — Integrasi Midtrans (Snap Token)

| Item | Detail |
|---|---|
| **Service** | [MidtransService.php](../backend/app/Services/MidtransService.php) |
| **Config** | `config/midtrans.php` (server_key, client_key, is_production) |

**Payload yang dikirim ke Midtrans:**
```php
[
  'transaction_details' => [
    'order_id'     => $invoiceNumber,
    'gross_amount' => $amount,
  ],
  'item_details'      => [[ id, name, price, quantity ]],
  'customer_details'  => [ first_name, email, phone ],
  'callbacks'         => [ 'finish' => "{frontend_url}/subscription?payment=finish" ],
  'expiry'            => [ 'unit' => 'hours', 'duration' => 24 ],
  'enabled_payments'  => [
    'credit_card', 'bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'permata_va',
    'gopay', 'shopeepay', 'qris',
  ],
]
```

Midtrans mengembalikan `{ token, redirect_url }`. Backend menyimpan keduanya pada Payment record sehingga bisa di-resume jika user menutup popup.

---

### Tahap 5 — Customer Memproses Pembayaran (Snap Popup)

**Frontend flow:**
1. Setelah dapat response dari `/subscribe`:
   - Jika `is_free === true` → `toast.success("Paket aktif")` + refresh queries. **Selesai.**
   - Jika ada `snap_token` → panggil `useMidtransSnap().openSnap(token, callbacks)`.
   - Fallback (snap script gagal load) → `window.open(payment_url)`.
2. **Snap popup** menampilkan pilihan metode bayar (CC, VA bank, GoPay, ShopeePay, QRIS).
3. Customer menyelesaikan pembayaran.

**Snap callbacks (frontend):**

| Callback | Action |
|---|---|
| `onSuccess` | toast sukses, invalidate queries `current` + `payments` |
| `onPending` | toast info "menunggu konfirmasi" (umum untuk VA / e-wallet manual) |
| `onError` | toast error dengan pesan dari Midtrans |
| `onClose` | popup ditutup customer — payment tetap `pending`, bisa di-resume dari payment history |

> **Catatan**: status final tidak ditentukan dari callback Snap (yang client-side & bisa dispoof). Sumber kebenaran adalah **webhook server-to-server** dari Midtrans.

---

### Tahap 6 — Webhook Midtrans (Server-to-Server)

| Item | Detail |
|---|---|
| **Endpoint** | `POST /api/v1/webhooks/midtrans` (public, no auth) |
| **Controller** | [SubscriptionController.php:132-191](../backend/app/Http/Controllers/Api/V1/SubscriptionController.php#L132-L191) |
| **Signature** | SHA512(`order_id + status_code + gross_amount + server_key`) |

**Notification fields yang dipakai:**
- `order_id`, `status_code`, `gross_amount`, `signature_key`
- `transaction_status`: `capture | settlement | pending | cancel | deny | expire | refund`
- `fraud_status`: `accept | deny | challenge`
- `payment_type`: `credit_card | bank_transfer | gopay | shopeepay | qris | …`

**Mapping status:**

| Midtrans transaction_status | fraud_status | Payment.status |
|---|---|---|
| `capture` | `accept` | **paid** |
| `settlement` | — | **paid** |
| `pending` | — | `pending` |
| `cancel` / `deny` / `expire` | — | `failed` |

**Aksi:**
1. `MidtransService::parseNotification()` & `isSignatureValid()` — reject jika invalid.
2. Cari `Payment` by `midtrans_order_id`.
3. Update `payment.status`, `payment_method`, `paid_at`.
4. Jika status menjadi **paid** → panggil `activateSubscription($payment)`.
5. Return HTTP `200 { status: "OK" }` agar Midtrans tidak retry.

---

### Tahap 7 — Aktivasi Subscription

**Method:** `activateSubscription(Payment $payment)` di `SubscriptionController`.

**Untuk `payment_type = Subscription`:**
1. Read metadata: `plan`, `billing_cycle`, `coupon_quota`.
2. **Cancel subscription aktif sebelumnya** (`status = cancelled`, `cancelled_at = now`).
3. Hitung `expires_at`:
   - `monthly` → `now + 1 month`
   - `yearly` → `now + 1 year`
4. **Create Subscription baru:**
   ```
   plan, status=active, price, coupon_quota, coupon_used=0,
   billing_cycle, starts_at=now, expires_at
   ```
5. Link `payment.subscription_id` ke subscription baru.

**Untuk `payment_type = AddonCoupon`:**
- `subscription.increment('coupon_quota', $quantity)` — tidak buat subscription baru.

---

### Tahap 8 — Konfirmasi ke Customer

**Bagaimana customer tahu paket sudah aktif:**

1. **Real-time** (paling cepat) — Snap callback `onSuccess` di frontend memicu `queryClient.invalidateQueries(['subscription', 'current'])`. Dashboard otomatis re-render dengan plan baru.
2. **Refresh halaman** — `GET /subscriptions/current` selalu mengembalikan subscription terbaru berdasarkan webhook yang sudah masuk.
3. **Riwayat pembayaran** — `GET /subscriptions/payments` menampilkan invoice baru dengan badge **paid**.

**Edge cases:**
- **Pembayaran VA / pending**: Snap akan trigger `onPending` → user lihat toast "menunggu konfirmasi". Subscription baru aktif setelah webhook `settlement` masuk (bisa beberapa menit untuk VA).
- **User tutup popup** — Payment tetap `pending` di history; tombol **"Lanjutkan"** menggunakan kembali `snap_redirect_url` lama (valid hingga `expired_at`).
- **Pembayaran gagal/expired** — webhook update status ke `failed`. Customer harus pesan ulang (create payment baru).

---

## 3. Skenario Top-up Kuota Kupon (Add-on)

Selain langganan, customer bisa beli kuota kupon tambahan tanpa upgrade paket.

| Item | Detail |
|---|---|
| **Endpoint** | `POST /api/v1/subscriptions/topup-coupon` |
| **FE Dialog** | [subscription/page.tsx:830-911](../frontend/src/app/(dashboard)/subscription/page.tsx#L830-L911) |
| **Harga** | `quantity × Rp 1.000` (min 10, max 10.000, step 10) |
| **Aktivasi** | webhook → `subscription.coupon_quota += quantity` |

Flow Snap-nya identik dengan subscription order (Tahap 4–7), hanya `payment_type = AddonCoupon`.

---

## 4. Status Diagram

### Payment Status

```
        ┌─────────┐
 create │ pending │
   ────►│         │
        └────┬────┘
             │
   ┌─────────┼─────────────┐
   │         │             │
   ▼         ▼             ▼
┌──────┐  ┌──────┐    ┌──────┐
│ paid │  │failed│    │expired│  (24h tanpa aksi)
└──────┘  └──────┘    └──────┘
```

### Subscription Status

```
                  ┌────────┐
   register ────► │ active │ (free plan)
                  └───┬────┘
                      │ user upgrade & bayar
                      ▼
                ┌───────────┐         ┌──────────┐
                │ cancelled │ ◄────── │  active  │
                └───────────┘ old sub └────┬─────┘
                                           │
                          ┌────────────────┼────────────────┐
                          │                │                │
                          ▼                ▼                ▼
                   ┌──────────┐     ┌──────────┐    ┌──────────┐
                   │ expired  │     │suspended │    │cancelled │
                   └──────────┘     └──────────┘    └──────────┘
                   (lewat date)     (kuota habis)   (manual)
```

> **Suspended** dipicu otomatis saat `coupon_used >= coupon_quota` — lihat [QrCodeService::generateCouponsForRecipients](../backend/app/Services/QrCodeService.php). Saat suspended, request generate kupon mendapat 403 `QUOTA_EXCEEDED` dan frontend redirect ke `/subscription` untuk upgrade.

---

## 5. File Reference

| Komponen | Path |
|---|---|
| Pricing & dashboard page | [frontend/src/app/(dashboard)/subscription/page.tsx](../frontend/src/app/(dashboard)/subscription/page.tsx) |
| Subscription FE service | [frontend/src/services/subscription.service.ts](../frontend/src/services/subscription.service.ts) |
| Payment hook (Snap) | [frontend/src/hooks/use-payment.ts](../frontend/src/hooks/use-payment.ts) |
| Auth controller | [backend/app/Http/Controllers/Api/V1/AuthController.php](../backend/app/Http/Controllers/Api/V1/AuthController.php) |
| Register action | [backend/app/Actions/Auth/RegisterAction.php](../backend/app/Actions/Auth/RegisterAction.php) |
| Subscription controller | [backend/app/Http/Controllers/Api/V1/SubscriptionController.php](../backend/app/Http/Controllers/Api/V1/SubscriptionController.php) |
| Midtrans service | [backend/app/Services/MidtransService.php](../backend/app/Services/MidtransService.php) |
| Plan model | [backend/app/Models/Plan.php](../backend/app/Models/Plan.php) |
| Subscription model | [backend/app/Models/Subscription.php](../backend/app/Models/Subscription.php) |
| Payment model | [backend/app/Models/Payment.php](../backend/app/Models/Payment.php) |
| Quota check middleware | [backend/app/Http/Middleware/CheckCouponQuota.php](../backend/app/Http/Middleware/CheckCouponQuota.php) |
| Routes | [backend/routes/api.php](../backend/routes/api.php) |
| PaymentStatus enum | [backend/app/Enums/PaymentStatus.php](../backend/app/Enums/PaymentStatus.php) |
| SubscriptionStatus enum | [backend/app/Enums/SubscriptionStatus.php](../backend/app/Enums/SubscriptionStatus.php) |

---

## 6. Catatan Operasional

- **Webhook URL Midtrans** harus dikonfigurasi di Midtrans Dashboard → Settings → Configuration → Payment Notification URL: `https://{api-domain}/api/v1/webhooks/midtrans`.
- **Sandbox vs Production**: ditentukan oleh `MIDTRANS_IS_PRODUCTION` env. Server key & client key berbeda untuk masing-masing environment.
- **Idempotensi webhook**: Midtrans bisa retry. Implementasi saat ini aman karena update by `order_id` bersifat idempotent (status capture → paid akan tetap paid pada retry).
- **Resume payment**: payment dengan status `pending` & `expired_at > now` dapat di-resume menggunakan `snap_redirect_url` yang tersimpan — tidak perlu generate ulang token.
