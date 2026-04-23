# Software Requirements Specification (SRS)

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026

---

## 1. Functional Requirements

### 1.1 Modul Autentikasi & Akun (AUTH)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| AUTH-01 | Register akun tenant | Must | Email, password, nama organisasi, no HP |
| AUTH-02 | Login dengan email & password | Must | JWT-based authentication |
| AUTH-03 | Verifikasi email | Must | Kirim link verifikasi, token expire 24 jam |
| AUTH-04 | Forgot password | Must | Kirim link reset via email, token expire 1 jam |
| AUTH-05 | Change password | Must | Validasi password lama, enforce password policy |
| AUTH-06 | Logout | Must | Invalidasi token |
| AUTH-07 | Two-factor authentication (2FA) | Should | TOTP-based (Google Authenticator) |
| AUTH-08 | Social login (Google) | Could | OAuth2 via Google |
| AUTH-09 | Session management | Must | Multi-device login, session list, revoke session |
| AUTH-10 | Email notifikasi saat register | Must | Welcome email + link verifikasi |
| AUTH-11 | Email notifikasi saat ganti password | Must | Konfirmasi perubahan password |
| AUTH-12 | Email notifikasi saat akun aktif | Must | Konfirmasi akun terverifikasi |

### 1.2 Modul Multi-Tenancy (TNT)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| TNT-01 | Tenant registration | Must | Form registrasi organisasi |
| TNT-02 | Tenant profile management | Must | Edit nama, alamat, logo, kontak |
| TNT-03 | Tenant settings | Must | Timezone, bahasa, format tanggal |
| TNT-04 | Data isolation antar tenant | Must | Setiap tenant hanya akses data sendiri |
| TNT-05 | Custom subdomain per tenant | Should | masjid-alfurqon.qurbanlink.id |
| TNT-06 | Tenant suspension/activation | Must | Super admin bisa suspend/activate tenant |
| TNT-07 | Tenant onboarding wizard | Should | Step-by-step setup setelah register |

### 1.3 Modul Subscription & Payment (SUB)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| SUB-01 | Daftar paket subscription | Must | Free, Starter, Professional, Enterprise |
| SUB-02 | Pilih & upgrade paket | Must | Flow pemilihan dan upgrade |
| SUB-03 | Payment via Moota | Must | Integrasi Moota API (VA transfer bank) |
| SUB-04 | Invoice generation | Must | Auto-generate invoice PDF |
| SUB-05 | Payment history | Must | Riwayat pembayaran lengkap |
| SUB-06 | Auto-renewal reminder | Should | Email reminder H-7, H-3, H-1 |
| SUB-07 | Grace period | Should | 7 hari setelah jatuh tempo |
| SUB-08 | Kuota monitoring | Must | Sisa kuota kupon, alert mendekati limit |
| SUB-09 | Additional coupon purchase | Should | Beli kuota kupon tambahan |
| SUB-10 | Webhook Moota | Must | Callback otomatis saat pembayaran masuk |

### 1.4 Modul Event Kurban (EVT)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| EVT-01 | Buat event kurban | Must | Nama, tanggal, lokasi, deskripsi |
| EVT-02 | Edit event | Must | Update detail event |
| EVT-03 | Tutup/Arsipkan event | Must | Event selesai → arsip |
| EVT-04 | Daftar event per tenant | Must | List event aktif dan arsip |
| EVT-05 | Event settings | Must | Jumlah kupon per kategori, jam operasional |
| EVT-06 | Multi-lokasi distribusi per event | Should | Satu event, beberapa titik distribusi |
| EVT-07 | Duplikasi event | Could | Copy event tahun lalu sebagai template |

### 1.5 Modul Hewan Kurban (ANM)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| ANM-01 | Tambah data hewan kurban | Must | Jenis (sapi/kambing/domba), berat, jumlah |
| ANM-02 | Kelompokkan hewan per pekurban | Must | Relasi hewan ↔ shohibul kurban |
| ANM-03 | Status hewan | Must | Terdaftar → Disembelih → Dipotong → Didistribusikan |
| ANM-04 | Estimasi jumlah bagian | Should | Auto-hitung estimasi berdasarkan berat |
| ANM-05 | Foto hewan | Could | Upload foto sebagai dokumentasi |
| ANM-06 | Import data hewan (CSV/Excel) | Should | Bulk import |

### 1.6 Modul Shohibul Kurban / Pekurban (SHB)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| SHB-01 | Tambah data pekurban | Must | Nama, alamat, no HP, jenis kurban |
| SHB-02 | Relasi pekurban ↔ hewan | Must | Satu pekurban bisa punya beberapa hewan |
| SHB-03 | Status penyerahan | Must | Belum serah → Sudah serah |
| SHB-04 | Sertifikat kurban digital | Could | Generate PDF sertifikat |
| SHB-05 | Import data pekurban (CSV/Excel) | Should | Bulk import |
| SHB-06 | Notifikasi ke pekurban | Could | Email/SMS status kurbannya |

### 1.7 Modul Penerima Kurban (RCP)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| RCP-01 | Tambah data penerima | Must | Nama, alamat, no HP, kategori |
| RCP-02 | Kategori penerima | Must | Fakir, miskin, umum, panitia, dll (configurable) |
| RCP-03 | Jumlah bagian per penerima | Must | Bisa > 1 bagian per penerima |
| RCP-04 | Status distribusi per penerima | Must | Belum ambil → Sudah ambil |
| RCP-05 | Import data penerima (CSV/Excel) | Should | Bulk import |
| RCP-06 | Riwayat penerima tahun sebelumnya | Should | Historical data |
| RCP-07 | Deduplikasi penerima | Should | Deteksi data ganda (nama + alamat) |

### 1.8 Modul QR Code Kupon (QRC)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| QRC-01 | Generate QR Code per penerima | Must | Unique QR per kupon |
| QRC-02 | Batch generate QR Code | Must | Generate sekaligus untuk seluruh penerima event |
| QRC-03 | Format kupon | Must | QR Code + Nama + No Kupon + Kategori |
| QRC-04 | Cetak kupon (PDF) | Must | Layout siap cetak A4 (multiple per halaman) |
| QRC-05 | Kupon digital (tampil di layar) | Should | Penerima bisa simpan di HP |
| QRC-06 | QR Code mengandung data terenkripsi | Must | Anti-pemalsuan |
| QRC-07 | Regenerate QR Code | Must | Jika kupon hilang/rusak |
| QRC-08 | Void/Batalkan kupon | Must | Batalkan kupon yang sudah di-generate |
| QRC-09 | Masa berlaku kupon | Should | Kupon expire setelah event selesai |

### 1.9 Modul Scan Kupon (SCN)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| SCN-01 | Scan QR Code via kamera | Must | Gunakan kamera device (PWA) |
| SCN-02 | Validasi kupon | Must | Cek: valid, belum digunakan, event aktif |
| SCN-03 | Tampilkan data penerima setelah scan | Must | Nama, kategori, jumlah bagian |
| SCN-04 | Konfirmasi distribusi | Must | Panitia konfirmasi telah memberikan daging |
| SCN-05 | Tolak kupon invalid | Must | Tampilkan alasan penolakan |
| SCN-06 | Input manual nomor kupon | Must | Fallback jika QR rusak/tidak terbaca |
| SCN-07 | Riwayat scan per operator | Must | Log scan oleh siapa, kapan |
| SCN-08 | Offline scan capability | Should | Simpan lokal, sync ketika online |
| SCN-09 | Scan sound/vibration feedback | Should | Audio/haptic feedback sukses/gagal |

### 1.10 Modul Dashboard Live (DSH)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| DSH-01 | Real-time counter distribusi | Must | Total distributed / total kupon |
| DSH-02 | Progress bar per kategori | Must | Visual progress per kategori penerima |
| DSH-03 | Live feed scan terbaru | Must | Stream data scan terkini |
| DSH-04 | Statistik per lokasi distribusi | Should | Jika multi-lokasi |
| DSH-05 | Chart distribusi per waktu | Should | Grafik distribusi per jam |
| DSH-06 | Auto-refresh | Must | WebSocket / SSE untuk real-time update |
| DSH-07 | Display mode (TV/Projector) | Should | Full-screen mode untuk tampil di layar besar |
| DSH-08 | Export snapshot dashboard | Could | Screenshot/PDF dashboard saat ini |

### 1.11 Modul Laporan (RPT)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| RPT-01 | Laporan rekapitulasi distribusi | Must | Per event: total, per kategori, per lokasi |
| RPT-02 | Laporan penerima yang belum ambil | Must | Daftar penerima belum claim |
| RPT-03 | Laporan per hewan kurban | Should | Distribusi per hewan / pekurban |
| RPT-04 | Export ke PDF | Must | Format laporan cetak |
| RPT-05 | Export ke Excel | Must | Data mentah untuk analisis |
| RPT-06 | Laporan perbandingan antar tahun | Could | Tren tahun ke tahun |

### 1.12 Modul Super Admin (ADM)

| ID | Requirement | Priority | Detail |
|----|------------|----------|--------|
| ADM-01 | Dashboard platform overview | Must | Total tenant, total event, total kupon |
| ADM-02 | Manajemen tenant | Must | List, detail, suspend, activate, delete |
| ADM-03 | Manajemen subscription | Must | Monitor pembayaran, manual activation |
| ADM-04 | Manajemen user platform | Must | CRUD user super admin |
| ADM-05 | System configuration | Must | Global settings, email template, pricing |
| ADM-06 | Audit log | Should | Log semua aktivitas penting |
| ADM-07 | System health monitoring | Should | Status service, database, queue |

---

## 2. Non-Functional Requirements

### 2.1 Performance (PERF)

| ID | Requirement | Target |
|----|------------|--------|
| PERF-01 | Response time API (95th percentile) | < 200ms |
| PERF-02 | QR Code scan to response | < 1 detik |
| PERF-03 | Dashboard live update latency | < 2 detik |
| PERF-04 | QR Code batch generation (1000 kupon) | < 30 detik |
| PERF-05 | Concurrent scan operations per event | Min 50 simultaneous |
| PERF-06 | Page load time (First Contentful Paint) | < 1.5 detik |
| PERF-07 | PDF report generation (1000 records) | < 10 detik |

### 2.2 Scalability (SCL)

| ID | Requirement | Target |
|----|------------|--------|
| SCL-01 | Total tenant support | 10.000+ |
| SCL-02 | Concurrent active events | 1.000+ |
| SCL-03 | Total kupon dalam sistem | 10.000.000+ |
| SCL-04 | Concurrent users saat peak | 5.000+ |
| SCL-05 | Horizontal scaling capability | Auto-scale backend |

### 2.3 Availability (AVL)

| ID | Requirement | Target |
|----|------------|--------|
| AVL-01 | Uptime SLA (normal) | 99.5% |
| AVL-02 | Uptime SLA (saat Idul Adha) | 99.9% |
| AVL-03 | Planned maintenance window | Maks 2 jam/bulan, diluar peak |
| AVL-04 | Recovery Time Objective (RTO) | < 30 menit |
| AVL-05 | Recovery Point Objective (RPO) | < 5 menit |

### 2.4 Security (SEC)

| ID | Requirement | Detail |
|----|------------|--------|
| SEC-01 | HTTPS everywhere | TLS 1.2+ mandatory |
| SEC-02 | Data encryption at rest | AES-256 untuk data sensitif |
| SEC-03 | Password hashing | bcrypt dengan cost factor 12 |
| SEC-04 | CSRF protection | Laravel built-in + SameSite cookies |
| SEC-05 | XSS prevention | Content Security Policy, input sanitization |
| SEC-06 | SQL injection prevention | Eloquent ORM, parameterized queries |
| SEC-07 | Rate limiting | Login: 5/menit, API: 60/menit, Scan: 30/menit |
| SEC-08 | QR Code anti-forgery | HMAC signature dalam QR payload |
| SEC-09 | Tenant data isolation | Row-level security + middleware |
| SEC-10 | Audit trail | Log semua operasi CRUD penting |
| SEC-11 | JWT token management | Access token (15min) + Refresh token (7 hari) |
| SEC-12 | Input validation | Server-side validation pada semua endpoint |

### 2.5 Usability (USB)

| ID | Requirement | Detail |
|----|------------|--------|
| USB-01 | Mobile responsive | PWA responsive design |
| USB-02 | Offline capability | Scan kupon bisa offline, sync online |
| USB-03 | Bahasa Indonesia | UI utama dalam Bahasa Indonesia |
| USB-04 | Accessibility | WCAG 2.1 Level AA |
| USB-05 | Onboarding flow | Wizard setup untuk tenant baru |
| USB-06 | Scan UX | Maks 3 tap dari login ke scan |

### 2.6 Compatibility (CMP)

| ID | Requirement | Detail |
|----|------------|--------|
| CMP-01 | Browser support | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| CMP-02 | Mobile OS | Android 8+, iOS 14+ (via PWA) |
| CMP-03 | Screen size | 320px (mobile) s.d. 4K (TV display) |
| CMP-04 | Camera access | WebRTC camera API untuk QR scan |
| CMP-05 | PWA installable | Add to Home Screen di Android & iOS |

### 2.7 Maintainability (MNT)

| ID | Requirement | Detail |
|----|------------|--------|
| MNT-01 | Code coverage | Minimum 80% unit test coverage |
| MNT-02 | API documentation | OpenAPI 3.0 / Swagger |
| MNT-03 | Database migration | Laravel migrations, versioned |
| MNT-04 | Environment parity | Dev/Staging/Production konsisten |
| MNT-05 | Logging | Structured logging (JSON), centralized |
| MNT-06 | CI/CD pipeline | Automated build, test, deploy |

---

## 3. User Stories

### 3.1 Tenant Admin

```
Sebagai Tenant Admin,
Saya ingin mendaftarkan organisasi saya ke platform,
Sehingga saya bisa mengelola distribusi kurban secara digital.

Acceptance Criteria:
- Bisa register dengan email, password, nama organisasi
- Menerima email verifikasi
- Setelah verifikasi, bisa login dan setup organisasi
- Bisa memilih paket subscription
```

```
Sebagai Tenant Admin,
Saya ingin membuat event kurban baru,
Sehingga saya bisa mengelola distribusi untuk periode tertentu.

Acceptance Criteria:
- Bisa input nama event, tanggal, lokasi
- Bisa set kategori penerima dan kuota
- Event muncul di daftar event tenant
```

```
Sebagai Tenant Admin,
Saya ingin generate QR Code kupon untuk semua penerima,
Sehingga kupon bisa dicetak dan dibagikan.

Acceptance Criteria:
- Bisa generate batch untuk seluruh penerima dalam event
- QR Code unik per penerima
- Bisa download PDF siap cetak
- Kupon berisi: QR Code, nama, nomor kupon, kategori
```

```
Sebagai Tenant Admin,
Saya ingin melihat dashboard live distribusi,
Sehingga saya bisa memonitor progress secara real-time.

Acceptance Criteria:
- Dashboard update otomatis tanpa refresh
- Menampilkan total distribusi vs total kupon
- Progress bar per kategori
- Feed scan terbaru
```

### 3.2 Panitia/Operator

```
Sebagai Panitia Kurban,
Saya ingin scan kupon QR Code penerima,
Sehingga distribusi tercatat dengan akurat.

Acceptance Criteria:
- Bisa buka scanner via PWA
- Kamera langsung aktif
- Setelah scan, tampil data penerima
- Bisa konfirmasi distribusi dengan 1 tap
- Feedback visual/audio sukses/gagal
```

```
Sebagai Panitia Kurban,
Saya ingin input nomor kupon manual,
Sehingga penerima dengan kupon rusak tetap bisa dilayani.

Acceptance Criteria:
- Ada input field nomor kupon
- Validasi sama seperti scan QR
- Tercatat sebagai "manual entry" di log
```

### 3.3 Super Admin

```
Sebagai Super Admin,
Saya ingin melihat overview seluruh platform,
Sehingga saya bisa memonitor kesehatan bisnis.

Acceptance Criteria:
- Dashboard menampilkan total tenant, event aktif, total kupon
- Grafik pertumbuhan tenant
- Status subscription per tenant
- Revenue overview
```

---

## 4. Acceptance Criteria Summary

| Modul | Jumlah Requirements | Must | Should | Could |
|-------|-------------------|------|--------|-------|
| AUTH | 12 | 9 | 1 | 2 |
| TNT | 7 | 5 | 2 | 0 |
| SUB | 10 | 6 | 3 | 1 |
| EVT | 7 | 4 | 1 | 2 |
| ANM | 6 | 3 | 2 | 1 |
| SHB | 6 | 3 | 1 | 2 |
| RCP | 7 | 4 | 3 | 0 |
| QRC | 9 | 6 | 2 | 1 |
| SCN | 9 | 6 | 3 | 0 |
| DSH | 8 | 4 | 3 | 1 |
| RPT | 6 | 4 | 1 | 1 |
| ADM | 7 | 5 | 2 | 0 |
| **Total** | **94** | **59** | **24** | **11** |

---

## 5. Traceability Matrix

Setiap requirement di atas dapat di-trace ke:
- **BRD Section** → Ruang lingkup produk (Section 5)
- **Architecture Component** → Lihat `03-ARCHITECTURE.md`
- **Database Entity** → Lihat `04-DATABASE-DESIGN.md`
- **API Endpoint** → Lihat `05-API-DESIGN.md`
- **Test Case** → Akan dibuat pada fase testing
