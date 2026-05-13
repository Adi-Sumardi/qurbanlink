# Public Demo Feature — "Coba Tawzii Tanpa Daftar"

> **Status**: Design proposal (belum implementasi)
> **Tujuan**: Memungkinkan calon pengguna mencoba aplikasi (dashboard + scan kupon) tanpa registrasi, untuk meningkatkan conversion rate dari landing page.
> **Owner**: Frontend (tidak butuh perubahan backend)

---

## 1. Rasionalisasi

### Masalah yang ingin diselesaikan

Calon klien (DKM masjid, biasanya 40-60 tahun, low-to-mid digital literacy) masih ragu mendaftar karena:

1. **Tidak tahu seperti apa aplikasinya** — landing page hanya bisa "menceritakan", tidak bisa "menunjukkan" pengalaman nyata.
2. **Takut ribet** — asumsi: "aplikasi pasti susah dipakai, tim saya nanti pusing".
3. **Tidak ada commitment-free trial** — meskipun gratis, daftar = email, password, data masjid. Friction tetap tinggi.
4. **Testimoni saja tidak cukup** — DKM percaya pada pengalaman langsung, bukan kata orang.

### Solusi yang diusulkan

Halaman publik (`/coba` atau `/demo`) yang memungkinkan visitor:
- Membuka dashboard yang sudah ber-isi data masjid simulasi
- Melakukan scan kupon (simulasi tap-to-scan, bukan kamera asli)
- Melihat live dashboard publik yang update real-time
- Mengakses semua modul tanpa daftar

Tujuan utama: **pengunjung merasakan "ini gampang"** dalam 2 menit, lalu ter-funnel ke `/register`.

### Hipotesis bisnis

- Conversion rate landing → register diperkirakan naik 30–50%.
- Demo akan mengurangi pertanyaan support "fitur X bagaimana?" karena calon pengguna sudah mencoba sendiri.
- Berfungsi sebagai sales-tool: tim Anda bisa kirim link `/coba` ke prospek tanpa demo call.

---

## 2. Naming & Routing

### Opsi naming

| Opsi  | Pro                          | Con                           |
| ----- | ---------------------------- | ----------------------------- |
| `/coba`  | Bahasa Indonesia, friendly, mudah diingat oleh target audience (DKM) | Tidak universal |
| `/demo`  | Universal, biasa di SaaS    | Lebih "teknis", kurang hangat |
| `/playground` | Modern dev-friendly    | Tidak cocok untuk audience non-tech |

**Rekomendasi: `/coba`** — sejalan dengan tone halaman lain (`/panduan`, `/blog`).

### Route map

```
/coba                       → Landing demo (penjelasan + CTA "Mulai Demo")
/coba/dashboard             → Dashboard simulasi
/coba/dashboard/events      → List event (cuma 1: Idul Adha 1447 H)
/coba/dashboard/hewan       → List hewan kurban simulasi
/coba/dashboard/kupon       → List 50 kupon dengan QR
/coba/dashboard/scan        → Scan simulator
/coba/dashboard/laporan     → Preview laporan PDF/Excel
/coba/live                  → Simulasi live dashboard publik
```

**Catatan**: route di-namespace dengan prefix `/coba/dashboard/*` agar mirip struktur asli (`/dashboard/*`), bukan jadi "tertutup". Visitor harus bisa rasakan "ini benar-benar aplikasi yang sama".

---

## 3. Arsitektur Teknis

### Prinsip utama

> **Demo adalah 100% client-side. Tidak ada panggilan backend, tidak ada data tersimpan, tidak ada akun yang dibuat.**

Alasan:
- ✅ **Aman**: tidak ada risiko abuse / spam ke production DB
- ✅ **Cepat**: tidak ada latency network
- ✅ **Isolated**: reset ke kondisi awal cukup dengan refresh
- ✅ **Murah**: tidak butuh tenant demo di production
- ✅ **Tanpa auth**: tidak perlu issue token tamu

### State management

State demo disimpan di **Zustand store terpisah** (`stores/demo.store.ts`):

```typescript
interface DemoState {
  event: DemoEvent;
  hewan: DemoHewan[];
  sohibul: DemoSohibul[];
  zona: DemoZona[];
  penerima: DemoPenerima[];
  kupon: DemoKupon[];  // 50 kupon, status dinamis
  scanLog: ScanLogEntry[];
  scanKupon: (id: string) => ScanResult;
  resetDemo: () => void;
}
```

- State **tidak persist** ke localStorage — refresh = fresh state. Ini sengaja: agar tiap kunjungan terasa "bersih" dan tidak nyangkut state dari sesi sebelumnya.
- Action `scanKupon` memvalidasi (Aktif → Terpakai), append `scanLog`, update progress dashboard.
- Action `resetDemo` mengembalikan ke seed.

### Seed data (mock)

| Entity     | Jumlah | Detail                                                       |
| ---------- | ------ | ------------------------------------------------------------ |
| Event      | 1      | "Idul Adha 1447 H — Masjid Al-Hikmah Demo"                  |
| Masjid     | 1      | Masjid Al-Hikmah Demo, Bekasi                                |
| Sohibul    | 5      | Campur (sapi penuh, 1/7 sapi, kambing)                       |
| Hewan      | 8      | 3 sapi, 5 kambing — sudah disembelih, berat tercatat         |
| Zona       | 4      | RT 01-04 / RW 05                                             |
| Penerima   | 50     | Tersebar di 4 zona, ada NIK & nomor HP simulasi             |
| Kupon      | 50     | Status awal: 18 Terpakai, 32 Aktif                          |
| Scan log   | 18     | History scan yang sudah terjadi (untuk realisme dashboard)   |

Seed data didefinisikan di `src/content/demo-seed.ts` — single source of truth.

### Auth handling

`auth-provider.tsx` perlu ditambah `/coba` ke `PUBLIC_PATHS` agar tidak redirect ke `/login`.

```typescript
const PUBLIC_PATHS = [
  // ... existing
  '/coba',
];
```

`pathname.startsWith('/coba')` sudah otomatis cover semua sub-route.

### Komponen yang di-reuse

Sebanyak mungkin reuse dari `/dashboard` asli untuk konsistensi visual:
- Card layout, sidebar, header
- Table style, badge status, color tokens
- Modal, toast, form input

Yang **TIDAK** di-reuse:
- Service layer (`*.service.ts`) — diganti dengan demo store
- Auth-related hooks
- Subscription/billing UI

---

## 4. Desain Halaman

### 4.1. `/coba` — Demo Landing Page

**Tujuan**: Sambut pengunjung, jelaskan apa yang bisa dicoba, salurkan ke dashboard demo.

```
┌─────────────────────────────────────────────────────────────┐
│  TAWZII                          [Daftar Gratis] [Masuk]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│            [ ⚡ MODE DEMO INTERAKTIF ]                       │
│                                                             │
│       Coba Tawzii sekarang — tanpa daftar.                  │
│                                                             │
│       Masuk ke dashboard simulasi, scan kupon QR,           │
│       dan lihat laporan otomatis. Semua tanpa email,        │
│       tanpa password, tanpa commitment.                     │
│                                                             │
│       [ Mulai Demo Sekarang → ]                             │
│                                                             │
│       ✓ Berbasis data masjid simulasi                       │
│       ✓ Tidak menyimpan apapun di server                    │
│       ✓ Reset dengan satu klik                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Apa yang bisa Anda coba?                                   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ DASHBOARD│  │ KUPON QR │  │   SCAN   │  │ LAPORAN  │    │
│  │  [icon]  │  │  [icon]  │  │  [icon]  │  │  [icon]  │    │
│  │ Pantau   │  │ Lihat 50 │  │ Scan tap-│  │ Preview  │    │
│  │ progres  │  │ kupon &  │  │ to-scan  │  │ PDF &    │    │
│  │ live     │  │ status   │  │          │  │ Excel    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                             │
│  [ Mulai Demo Sekarang → ]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Elemen kunci**:
- Headline benefit-driven: "tanpa daftar"
- Reassurance: tanpa email, tanpa password, tidak menyimpan apapun
- 4 fitur card sebagai preview
- CTA tunggal "Mulai Demo Sekarang"
- Link ke `/register` di header (untuk yang sudah yakin)

---

### 4.2. `/coba/dashboard` — Dashboard Simulasi

**Tujuan**: Menampilkan dashboard penuh dengan data live yang bisa dimanipulasi.

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠ MODE DEMO — data tidak tersimpan  [Reset] [Daftar Gratis]│
├──────────┬──────────────────────────────────────────────────┤
│ SIDEBAR  │                                                  │
│          │  Idul Adha 1447 H  [• AKTIF]                    │
│ Dashboard│  Masjid Al-Hikmah Demo · Bekasi                  │
│ Events   │                                                  │
│ Hewan    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│ Sohibul  │  │ 50 ku- │ │ 18 ter-│ │ 32 ku- │ │ 4 zona │    │
│ Zona     │  │ pon    │ │ pakai  │ │ pon    │ │        │    │
│ Penerima │  │        │ │ (36%)  │ │ aktif  │ │        │    │
│ Kupon QR │  └────────┘ └────────┘ └────────┘ └────────┘    │
│ Scan ★   │                                                  │
│ Laporan  │  Progres Distribusi                              │
│ Live     │  ━━━━━━━━━━━━━━░░░░░░░░░  36%                   │
│          │                                                  │
│          │  Per Zona                                        │
│          │  RT 01 / RW 05  ████████░░  8/10  Hijau         │
│          │  RT 02 / RW 05  ██████░░░░  6/12  Hijau         │
│          │  RT 03 / RW 05  ████░░░░░░  3/15  Kuning        │
│          │  RT 04 / RW 05  █░░░░░░░░░  1/13  Merah         │
│          │                                                  │
│          │  Aktivitas Terbaru                               │
│          │  • Scan Bapak Joko (RT 02) - 2 menit lalu       │
│          │  • Scan Ibu Maryam (RT 01) - 5 menit lalu       │
│          │  ...                                             │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

**Elemen kunci**:
- **Sticky banner kuning di atas**: "⚠ MODE DEMO — data tidak tersimpan" + tombol Reset + tombol Daftar
- Sidebar identik dengan dashboard asli, tapi link mengarah ke `/coba/*`
- Item "Scan" diberi indikator ★ (highlight untuk dicoba)
- KPI cards, progress bar, zone breakdown, aktivitas log — semua interaktif

**Interaksi**:
- Klik "Scan" → masuk ke halaman scan simulator
- Klik zona → drill-down ke list penerima di zona itu
- Klik aktivitas terbaru → detail scan log

---

### 4.3. `/coba/dashboard/scan` — Scan Simulator

**Tujuan**: Demo yang paling berkesan — meskipun tanpa kamera asli, harus terasa "real".

**Tantangan**: pengunjung pakai laptop/HP biasa, tidak punya printout kupon. Solusi: **tap-to-scan** — tampilkan list kupon, klik salah satu untuk simulate scan.

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠ MODE DEMO            [Reset] [Daftar Gratis]              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scan Kupon — Mode Simulasi                                 │
│                                                             │
│  Di kondisi nyata, petugas mengarahkan kamera HP ke QR.    │
│  Di demo ini, klik salah satu kupon di bawah:               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HASIL SCAN                                          │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  ✓ KUPON VALID — siap diambil                  │  │   │
│  │  │                                                │  │   │
│  │  │  #A-0142  ·  Bapak Suparman                    │  │   │
│  │  │  RT 03 / RW 05  ·  1 paket (2.5 kg)            │  │   │
│  │  │                                                │  │   │
│  │  │  [✓ Konfirmasi Ambil]   [✗ Batal]              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Pilih kupon untuk discan (50 kupon)                        │
│                                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │A-0142  │ │A-0143  │ │A-0144  │ │A-0145  │ │A-0146  │    │
│  │ [QR]   │ │ [QR]   │ │ [QR]   │ │ [QR]   │ │ [QR]   │    │
│  │AKTIF   │ │AKTIF   │ │TERPAKAI│ │AKTIF   │ │AKTIF   │    │
│  │RT 03   │ │RT 01   │ │RT 02   │ │RT 02   │ │RT 04   │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│  ... (50 kupon, scrollable grid)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Behaviour 3 kasus**:

1. **Kupon Aktif → klik**:
   - Hasil scan menampilkan card hijau "KUPON VALID"
   - Tombol "Konfirmasi Ambil" → status kupon berubah Terpakai, scan log bertambah, dashboard ter-update
   - Animasi check mark + sound effect (optional)

2. **Kupon Terpakai → klik**:
   - Hasil scan menampilkan card merah "KUPON SUDAH DIPAKAI"
   - Detail: scan pertama pada [tanggal], oleh [petugas]
   - Tidak ada tombol konfirmasi
   - Untuk demonstrate anti-fraud

3. **(Bonus) Tombol "Simulate kupon invalid"** — generate QR random untuk demo bahwa kupon tidak dikenal sistem akan ditolak.

**Variasi**: untuk pengunjung mobile, bisa juga aktifkan webcam untuk scan QR kertas (advanced — skip di v1).

---

### 4.4. `/coba/dashboard/kupon` — Daftar Kupon

Tampilkan semua 50 kupon dengan filter status (Aktif/Terpakai), zona, dan search by nama penerima.

```
┌─────────────────────────────────────────────────────────────┐
│  Kupon QR Code — 50 total                                   │
│  [Semua] [Aktif (32)] [Terpakai (18)]   [Cari nama...]      │
├─────────────────────────────────────────────────────────────┤
│  ID      Penerima         Zona       Status      QR         │
│  A-0001  Bp Joko          RT 01      ✓ Terpakai  [QR]       │
│  A-0002  Ibu Maryam       RT 01      ✓ Terpakai  [QR]       │
│  A-0003  Ibu Siti         RT 02      • Aktif     [QR]       │
│  ...                                                        │
│                                                             │
│  [Print Batch (Disabled di demo)]  [Export Excel (Disabled)]│
└─────────────────────────────────────────────────────────────┘
```

Tombol "Print Batch" dan "Export Excel" di-disabled dengan tooltip: "Tersedia setelah daftar". Ini menciptakan natural funnel ke `/register`.

---

### 4.5. `/coba/dashboard/laporan` — Preview Laporan

Tampilkan **placeholder laporan PDF/Excel** (preview saja, tidak bisa di-download). Tujuan: visitor lihat bahwa fitur laporan ada & terlihat profesional.

```
┌─────────────────────────────────────────────────────────────┐
│  Laporan Distribusi                                         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  📄 PDF Format   │  │  📊 Excel Format │                  │
│  │  Laporan resmi   │  │  Untuk audit     │                  │
│  │  [Lihat Preview] │  │  [Lihat Preview] │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  Preview Laporan PDF (DEMO)                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MASJID AL-HIKMAH DEMO                              │    │
│  │  Laporan Distribusi Kurban — Idul Adha 1447 H       │    │
│  │  ─────────────────────────────────────────────────  │    │
│  │  Total Hewan:    8 ekor (3 sapi, 5 kambing)         │    │
│  │  Total Kupon:    50                                 │    │
│  │  Tersalurkan:    18 (36%)                           │    │
│  │  Per Zona:                                          │    │
│  │    RT 01 - 8/10                                     │    │
│  │    ...                                              │    │
│  │  [WATERMARK: DEMO - TIDAK UNTUK DISTRIBUSI]         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  💡 Laporan lengkap tersedia setelah daftar.                │
│  [ Daftar Gratis → ]                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.6. `/coba/live` — Live Dashboard Publik

Simulasi `/live/[uuid]` versi publik — full-screen progress untuk ditayangkan di TV masjid.

```
┌─────────────────────────────────────────────────────────────┐
│            MASJID AL-HIKMAH — IDUL ADHA 1447 H              │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │       36%            │                   │
│                  │   ───────────        │                   │
│                  │   18 dari 50         │                   │
│                  │   kupon ter-scan     │                   │
│                  └──────────────────────┘                   │
│                                                             │
│   RT 01  ████████░░  8/10                                   │
│   RT 02  ██████░░░░  6/12                                   │
│   RT 03  ████░░░░░░  3/15                                   │
│   RT 04  █░░░░░░░░░  1/13                                   │
│                                                             │
│   📺 Update otomatis tiap 5 detik                           │
└─────────────────────────────────────────────────────────────┘
```

**Catatan**: bisa pakai auto-increment counter untuk simulasi "scan baru" tiap 10 detik agar terasa hidup.

---

## 5. UI Patterns Khusus Demo

### 5.1. Demo Banner (sticky atas)

Selalu visible di semua halaman `/coba/*`:

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ MODE DEMO — Data simulasi, tidak tersimpan.              │
│                                  [↻ Reset] [Daftar Gratis →]│
└─────────────────────────────────────────────────────────────┘
```

- Background warna lembut (amber/kuning muda) agar jelas tapi tidak intrusive
- Tinggi ~40px

### 5.2. Floating CTA

Bottom-right pada semua halaman demo (kecuali landing):

```
                                              ┌──────────────┐
                                              │ Suka demo-   │
                                              │ nya? Daftar  │
                                              │ Gratis →     │
                                              └──────────────┘
```

Muncul setelah scroll 50% atau setelah action pertama (scan kupon).

### 5.3. Tooltip "Tersedia setelah daftar"

Untuk fitur yang di-disabled di demo (Print, Export, Settings, Subscription):

```
┌──────────────────────────────┐
│ 🔒 Tersedia setelah daftar    │
│ Daftar gratis, no credit card│
│           [ Daftar → ]       │
└──────────────────────────────┘
```

### 5.4. Watermark "DEMO"

Pada PDF preview, dashboard yang di-screenshot, dan elemen visual lain yang bisa "disalah-pakai":
- Diagonal text "DEMO" dengan opacity 10-15%
- Atau footer bar "Contoh laporan — data tidak nyata"

---

## 6. Konten Seed Detail

### 6.1. Penerima (mustahik) — 50 nama

Gunakan nama-nama Indonesia umum yang **jelas fiktif** (jangan pakai nama yang bisa di-Google ke orang asli):
- Bapak Suparman, Ibu Maryam, Bapak Joko, Ibu Siti...
- Alamat: "Jl. Mawar No. 12 RT 03/05" (tidak alamat nyata)
- NIK: gunakan format 3210xxxxxxxxxxxxxx tapi semua digit terakhir random
- HP: 08xxxxxxxxxx — masking 5 digit tengah

### 6.2. Sohibul — 5 orang

- H. Ahmad Fauzi (sapi penuh)
- Hj. Siti Aminah (sapi 1/7)
- 3 nama lain untuk sapi patungan & kambing

### 6.3. Hewan

| # | Jenis  | Berat | Sohibul              | Status   |
| - | ------ | ----- | -------------------- | -------- |
| 1 | Sapi   | 320kg | H. Ahmad Fauzi       | Selesai  |
| 2 | Sapi   | 290kg | Patungan 7 sohibul   | Selesai  |
| 3 | Sapi   | 310kg | Patungan 7 sohibul   | Selesai  |
| 4 | Kambing| 32kg  | Bp Rudi              | Selesai  |
| 5 | Kambing| 28kg  | Ibu Dewi             | Selesai  |
| 6 | Kambing| 35kg  | Bp Hasan             | Selesai  |
| 7 | Kambing| 30kg  | Hj. Aisyah           | Selesai  |
| 8 | Kambing| 33kg  | Bp Imam              | Selesai  |

---

## 7. Konversi & Funnel

### Touch points ke `/register`

1. **Header**: tombol "Daftar Gratis" selalu visible
2. **Sticky banner**: link "Daftar" di kanan atas
3. **Floating CTA**: muncul setelah scan pertama
4. **Disabled features**: tooltip dengan CTA
5. **Akhir flow scan**: setelah scan 3 kupon, tampilkan modal "Wah, Anda sudah scan 3 kupon! Mau langsung pakai untuk masjid Anda? [Daftar Gratis]"
6. **Laporan preview**: CTA "Daftar untuk download laporan asli"

### Metric yang perlu di-track

Setup GA4 events:
- `demo_start` — visitor mencapai `/coba/dashboard`
- `demo_scan_success` — visitor sukses scan kupon
- `demo_scan_duplicate` — visitor scan kupon terpakai
- `demo_reset` — visitor reset state
- `demo_to_register` — visitor klik daftar dari halaman demo
- `demo_session_duration` — berapa lama di mode demo

Hipotesis baseline:
- Conversion landing → register: ~3%
- Setelah demo: target 6–8%

---

## 8. Scope & Phased Rollout

### Phase 1 (MVP) — 2-3 hari

- [x] Halaman `/coba` landing
- [x] Halaman `/coba/dashboard` (KPI, progress, zona, aktivitas)
- [x] Halaman `/coba/dashboard/scan` (tap-to-scan, 3 states)
- [x] Halaman `/coba/dashboard/kupon` (list with filter)
- [x] Zustand store + seed data
- [x] Demo banner & floating CTA
- [x] Auth-provider whitelist `/coba`
- [x] Update sitemap & nav landing

### Phase 2 — opsional (1-2 hari)

- [ ] Halaman `/coba/dashboard/laporan` dengan PDF preview
- [ ] Halaman `/coba/live` simulasi public dashboard
- [ ] Halaman `/coba/dashboard/hewan` & `/coba/dashboard/penerima` (CRUD read-only)
- [ ] Modal konversi setelah 3 scan
- [ ] GA4 event tracking

### Phase 3 — advanced (kalau performa demo bagus)

- [ ] Webcam scan asli (untuk visitor yang punya printout demo kupon)
- [ ] Multi-event demo (Idul Adha 2 tahun)
- [ ] Demo dengan masalah/edge case ("kupon basah", "antrian banyak")

---

## 9. Edge Cases & Risiko

### Edge cases

| Case | Handling |
| ---- | -------- |
| Visitor refresh saat scan in-progress | State reset ke seed. Banner kuning mengingatkan "demo tidak menyimpan data" |
| Visitor pakai Incognito + adblocker | Tidak ada masalah — semua client-side |
| Visitor share link `/coba/dashboard` | Boleh — semua publik, semua reset on load |
| Bot/crawler index halaman | `robots.txt`: izinkan index `/coba` (landing), block `/coba/dashboard/*` |
| Disabled JS | Tampilkan fallback message "Demo butuh JavaScript" |

### Risiko & mitigasi

| Risiko | Probabilitas | Mitigasi |
| ------ | ------------ | -------- |
| Visitor bingung apakah ini real account | Medium | Banner kuning persistent + watermark DEMO di tiap halaman |
| Demo terasa "fake" → trust turun | Low-Medium | Pakai data realistic + animasi/interaksi yang halus |
| Conversion turun karena visitor "cukup" dengan demo | Low | Disabled features yang strategis (Print/Export/Settings) memaksa upgrade |
| Bundle size naik karena demo data | Low | Demo seed cuma ~10KB JSON, code-split route `/coba/*` |
| Maintenance ganda (UI dashboard real & demo) | Medium | Reuse komponen UI level rendah, hanya beda service layer |

---

## 10. SEO & Sharing

- Meta title: "Coba Tawzii Tanpa Daftar — Demo Interaktif Platform Kurban Digital"
- Meta description: "Coba dashboard, scan kupon, dan lihat laporan distribusi kurban — semua tanpa email, tanpa daftar. Akses langsung."
- Canonical: `https://tawzii.id/coba`
- OG image: screenshot dashboard demo dengan badge "COBA TANPA DAFTAR"
- Sitemap: tambah `/coba` (priority 0.9) — paling tinggi setelah `/` dan `/register`

---

## 11. Pertanyaan untuk Diputuskan

Sebelum implementasi, putuskan:

1. **Naming**: `/coba` (rekomendasi) vs `/demo`?
2. **Scope MVP**: Phase 1 saja, atau langsung Phase 1+2?
3. **Scan UX**: tap-to-scan saja (rekomendasi), atau juga support webcam scan?
4. **Persistence**: state hilang on refresh (rekomendasi) atau persist via localStorage selama 24 jam?
5. **Print/Export di demo**: disabled dengan tooltip (rekomendasi) atau bisa tapi watermark DEMO?
6. **Floating CTA**: timing — setelah scroll vs setelah action vs immediate?

---

## 12. Estimasi & Next Steps

**Estimasi effort (Phase 1)**: 2-3 hari full-time

**File yang akan dibuat**:
```
frontend/src/app/(landing)/coba/
├── page.tsx                          # Landing demo
├── layout.tsx                        # Sticky banner + floating CTA
└── dashboard/
    ├── page.tsx                      # Dashboard simulasi
    ├── scan/page.tsx                 # Scan simulator
    ├── kupon/page.tsx                # List kupon
    ├── (opsional Phase 2)/
    │   ├── hewan/page.tsx
    │   ├── penerima/page.tsx
    │   └── laporan/page.tsx

frontend/src/content/demo-seed.ts     # Seed data
frontend/src/stores/demo.store.ts     # Zustand store
frontend/src/components/demo/
├── demo-banner.tsx
├── floating-cta.tsx
├── disabled-tooltip.tsx
└── scan-simulator.tsx
```

**File yang diubah**:
- `frontend/src/providers/auth-provider.tsx` (tambah `/coba` ke PUBLIC_PATHS)
- `frontend/src/app/sitemap.ts` (tambah `/coba`)
- `frontend/src/app/(landing)/page.tsx` (link "Coba Demo" di hero/nav?)
- `frontend/src/app/robots.ts` (block `/coba/dashboard/*` dari index)

---

**Status sekarang**: Menunggu approval untuk mulai implementasi. Putuskan dulu 6 pertanyaan di section 11.
