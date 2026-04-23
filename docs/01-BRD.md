# Business Requirements Document (BRD)

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026
**Status:** Draft

---

## 1. Executive Summary

QurbanLink adalah platform SaaS multi-tenant untuk mengelola distribusi daging hewan kurban secara digital. Platform ini menggantikan proses manual pembagian kupon dan pendistribusian daging kurban dengan sistem berbasis QR Code yang real-time, transparan, dan akuntabel.

Setiap organisasi (masjid, yayasan, panitia kurban) dapat mendaftar sebagai tenant, mengelola data hewan kurban, mencetak kupon QR Code untuk penerima, dan memantau proses distribusi secara live melalui dashboard.

---

## 2. Latar Belakang & Permasalahan

### Permasalahan Saat Ini

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Kupon fisik mudah hilang/rusak/dipalsukan | Penerima tidak mendapat bagian / double claim |
| 2 | Proses distribusi tidak termonitor real-time | Panitia tidak tahu progress distribusi |
| 3 | Data penerima tidak terkelola dengan baik | Tidak ada historical data tahun ke tahun |
| 4 | Tidak ada laporan yang akurat | Sulit melakukan evaluasi dan perencanaan |
| 5 | Koordinasi antar panitia sulit | Proses distribusi lambat dan kacau |
| 6 | Setiap organisasi harus buat sistem sendiri | Biaya tinggi, reinventing the wheel |

### Peluang

- Digitalisasi proses distribusi kurban
- Model SaaS memungkinkan skalabilitas ke banyak organisasi
- Data terpusat memungkinkan analitik dan peningkatan berkelanjutan

---

## 3. Tujuan Bisnis

### 3.1 Tujuan Utama

1. **Efisiensi Distribusi** — Mempersingkat waktu distribusi daging kurban minimal 50% dibanding proses manual
2. **Akuntabilitas** — Setiap kupon dan distribusi tercatat digital, menghindari kecurangan
3. **Transparansi** — Panitia dan stakeholder dapat memantau distribusi secara real-time
4. **Skalabilitas** — Platform dapat digunakan oleh ribuan organisasi secara bersamaan

### 3.2 KPI (Key Performance Indicators)

| KPI | Target | Periode |
|-----|--------|---------|
| Jumlah tenant aktif | 100 organisasi | Tahun pertama |
| Kupon yang didistribusikan | 50.000 kupon | Tahun pertama |
| Tingkat keberhasilan scan | > 99% | Per event |
| Uptime platform saat Idul Adha | 99.9% | Per event |
| Customer satisfaction | > 4.5/5.0 | Per tahun |

---

## 4. Stakeholder

| Stakeholder | Peran | Kepentingan |
|-------------|-------|-------------|
| Super Admin (Platform Owner) | Mengelola seluruh platform | Operasional & revenue |
| Tenant Admin (Pengurus Organisasi) | Mengelola organisasi & event kurban | Manajemen distribusi |
| Panitia Kurban (Operator) | Input data, cetak kupon, scan distribusi | Operasional lapangan |
| Penerima Kurban | Menerima kupon dan daging kurban | End user |
| Shohibul Kurban (Pekurban) | Menyerahkan hewan kurban | Transparansi distribusi |

---

## 5. Ruang Lingkup Produk

### 5.1 Dalam Ruang Lingkup (In Scope)

1. **Manajemen Tenant** — Registrasi, konfigurasi, dan pengelolaan organisasi
2. **Manajemen Subscription** — Paket layanan SaaS dengan payment gateway Moota
3. **Manajemen Event Kurban** — Pembuatan event per tahun/periode
4. **Manajemen Hewan Kurban** — Data hewan, jenis, berat, pengelompokan
5. **Manajemen Pekurban** — Data pemberi/penitip hewan kurban
6. **Manajemen Penerima** — Data penerima dan kategori (fakir, miskin, umum, dll)
7. **Generate QR Code Kupon** — Pembuatan dan pencetakan kupon digital
8. **Scan Kupon** — Verifikasi dan pencatatan distribusi via QR scan
9. **Dashboard Live** — Monitoring real-time progress distribusi
10. **Notifikasi Email** — Register, verifikasi, password reset, status akun
11. **PWA** — Progressive Web App untuk multi-device support
12. **Laporan & Analitik** — Laporan distribusi, rekapitulasi, export
13. **Multi-Roles & Permission** — Hak akses berbasis peran (Spatie)

### 5.2 Di Luar Ruang Lingkup (Out of Scope) — Fase 1

- Integrasi dengan sistem keuangan/akuntansi
- Fitur e-commerce penjualan hewan kurban
- Fitur social media sharing
- Mobile native app (Android/iOS)
- Integrasi WhatsApp notification (pertimbangan fase 2)

---

## 6. Model Bisnis

### 6.1 Pricing Strategy

| Paket | Harga/Bulan | Kuota Kupon | Fitur |
|-------|-------------|-------------|-------|
| **Free** | Rp 0 | 100 kupon | Basic features, 1 event/tahun |
| **Starter** | Rp 99.000 | 500 kupon | + Dashboard live, email notifikasi |
| **Professional** | Rp 249.000 | 2.000 kupon | + Multi-event, laporan lengkap, priority support |
| **Enterprise** | Custom | Unlimited | + Custom branding, dedicated support, SLA |

### 6.2 Revenue Stream

1. **Subscription fee** — Biaya bulanan/tahunan per tenant
2. **Pay-per-event** — Biaya per event untuk paket free (opsional)
3. **Additional coupon pack** — Pembelian kuota kupon tambahan
4. **Custom development** — Untuk kebutuhan enterprise

---

## 7. User Journey

### 7.1 Tenant Admin Journey

```
Register → Verifikasi Email → Pilih Paket → Bayar (Moota)
→ Setup Organisasi → Buat Event Kurban → Input Data Hewan
→ Input Data Penerima → Generate Kupon QR → Cetak/Distribusi Kupon
→ Hari-H: Monitor Dashboard Live → Download Laporan
```

### 7.2 Panitia/Operator Journey

```
Login → Pilih Event Aktif → Scan Kupon Penerima
→ Verifikasi Data → Konfirmasi Distribusi → Lanjut ke Penerima Berikutnya
```

### 7.3 Penerima Journey

```
Terima Kupon (fisik/digital) → Datang ke Lokasi → Tunjukkan QR Code
→ Panitia Scan → Terima Daging Kurban
```

---

## 8. Asumsi & Constraint

### Asumsi

1. Setiap lokasi distribusi memiliki akses internet (minimal 3G/4G)
2. Panitia memiliki smartphone/tablet untuk scanning
3. Organisasi bersedia melakukan registrasi digital
4. Penerima mau menerima kupon berbentuk QR Code (cetak/digital)

### Constraint

1. Platform harus siap sebelum musim Idul Adha (Dzulhijjah)
2. Harus mampu handle high traffic saat Idul Adha (peak time)
3. Data pribadi penerima harus dilindungi sesuai regulasi
4. Payment gateway terbatas pada Moota

---

## 9. Risiko

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| Server down saat peak | Medium | High | Auto-scaling, load balancing, caching agresif |
| Internet putus di lokasi | High | Medium | Offline mode pada PWA, sync ketika online |
| Penerima tidak paham QR | Medium | Low | Cetak kupon fisik dengan QR + nomor manual |
| Data breach | Low | Critical | Enkripsi, audit log, penetration testing |
| Adopsi tenant rendah | Medium | High | Free tier, marketing ke DKM, komunitas |

---

## 10. Success Criteria

1. Platform berhasil digunakan oleh minimal 10 organisasi pada Idul Adha pertama
2. Proses distribusi berjalan tanpa downtime signifikan (< 5 menit)
3. Minimal 95% kupon berhasil di-scan tanpa masalah
4. Feedback positif dari panitia dan penerima kurban
5. Tenant retention rate > 70% untuk tahun berikutnya

---

## 11. Timeline High-Level

| Fase | Aktivitas | Durasi |
|------|-----------|--------|
| **Fase 1** | BRD, Requirements, Design | 2 minggu |
| **Fase 2** | Backend Development (Core) | 4 minggu |
| **Fase 3** | Frontend Development | 4 minggu |
| **Fase 4** | Integration & Testing | 2 minggu |
| **Fase 5** | UAT & Bug Fixing | 2 minggu |
| **Fase 6** | Deployment & Soft Launch | 1 minggu |
| **Fase 7** | Marketing & Onboarding | Ongoing |

---

## Approval

| Nama | Peran | Tanda Tangan | Tanggal |
|------|-------|-------------|---------|
| | Product Owner | | |
| | Tech Lead | | |
| | Business Analyst | | |