# UI/UX Wireframe Specification

## Distribusi Penerimaan Hewan Kurban — QurbanLink

**Versi:** 1.0
**Tanggal:** 27 Februari 2026

---

## 1. Design System

### 1.1 Color Palette

**Tema: White Dominant + Green Accent + Silver Neutral — Elegant & Professional**

#### Primary Colors (Green)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `primary-50` | `#F0FDF4` | green-50 | Subtle green tint backgrounds |
| `primary-100` | `#DCFCE7` | green-100 | Selected row highlight, badge bg |
| `primary-200` | `#BBF7D0` | green-200 | Progress bar track (light) |
| `primary-500` | `#22C55E` | green-500 | Primary buttons, links, active states |
| `primary-600` | `#16A34A` | green-600 | Button hover, active sidebar item |
| `primary-700` | `#15803D` | green-700 | Button pressed, strong emphasis |
| `primary-800` | `#166534` | green-800 | Dark green text on light bg |

#### Neutral / Silver Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `silver-50` | `#F8FAFC` | slate-50 | Page background |
| `silver-100` | `#F1F5F9` | slate-100 | Card hover, table stripe, sidebar bg |
| `silver-200` | `#E2E8F0` | slate-200 | Borders, dividers, input borders |
| `silver-300` | `#CBD5E1` | slate-300 | Disabled states, placeholder |
| `silver-400` | `#94A3B8` | slate-400 | Secondary text, icons |
| `silver-500` | `#64748B` | slate-500 | Body text (secondary) |
| `silver-700` | `#334155` | slate-700 | Body text (primary) |
| `silver-800` | `#1E293B` | slate-800 | Headings, strong text |
| `silver-900` | `#0F172A` | slate-900 | Sidebar text active, emphasis |

#### Surface / White Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Card bg, modal bg, main content area |
| `background` | `#F8FAFC` | Page background (very light silver) |
| `sidebar-bg` | `#FFFFFF` | Sidebar background (white, clean) |
| `header-bg` | `#FFFFFF` | Header background + bottom border silver |

#### Semantic Colors (Minimal, only for status)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `success` | `#22C55E` | green-500 | Scan berhasil, status completed (= primary) |
| `success-bg` | `#F0FDF4` | green-50 | Background badge/alert success |
| `warning` | `#F59E0B` | amber-500 | Pending, mendekati limit |
| `warning-bg` | `#FFFBEB` | amber-50 | Background badge/alert warning |
| `danger` | `#EF4444` | red-500 | Error, scan gagal, void |
| `danger-bg` | `#FEF2F2` | red-50 | Background badge/alert error |
| `info` | `#64748B` | slate-500 | Info states (menggunakan silver) |

#### Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   DOMINANT: White (#FFFFFF)                                  │
│   ████████████████████████████████████████  ~70% of UI      │
│                                                             │
│   SECONDARY: Silver/Slate (#F1F5F9 — #E2E8F0)              │
│   ████████████████████                     ~20% of UI      │
│   Backgrounds, borders, subtle elements                     │
│                                                             │
│   ACCENT: Green (#22C55E — #16A34A)                         │
│   ██████████                               ~10% of UI      │
│   Buttons, active states, key actions                       │
│                                                             │
│   RATIO:  White 70%  |  Silver 20%  |  Green 10%           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Tailwind Config

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',  // main
          600: '#16A34A',  // hover
          700: '#15803D',  // pressed
          800: '#166534',
          900: '#14532D',
        },
        // silver menggunakan slate dari Tailwind
      },
      backgroundColor: {
        page: '#F8FAFC',
        card: '#FFFFFF',
      },
      borderColor: {
        DEFAULT: '#E2E8F0',
      },
    },
  },
};
```

#### Shadcn/UI Theme Variables

```css
/* globals.css */
@layer base {
  :root {
    --background: 210 40% 98%;        /* #F8FAFC - silver-50 */
    --foreground: 222 47% 11%;        /* #1E293B - silver-800 */
    --card: 0 0% 100%;                /* #FFFFFF */
    --card-foreground: 222 47% 11%;   /* #1E293B */
    --popover: 0 0% 100%;             /* #FFFFFF */
    --popover-foreground: 222 47% 11%;
    --primary: 142 71% 45%;           /* #22C55E - green-500 */
    --primary-foreground: 0 0% 100%;  /* white text on green */
    --secondary: 210 40% 96%;         /* #F1F5F9 - silver-100 */
    --secondary-foreground: 215 25% 27%;  /* #334155 - silver-700 */
    --muted: 210 40% 96%;             /* #F1F5F9 */
    --muted-foreground: 215 16% 47%;  /* #64748B - silver-500 */
    --accent: 210 40% 96%;            /* #F1F5F9 */
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;         /* #EF4444 */
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;            /* #E2E8F0 - silver-200 */
    --input: 214 32% 91%;             /* #E2E8F0 */
    --ring: 142 71% 45%;              /* #22C55E - green focus ring */
    --radius: 0.5rem;
  }
}
```

### 1.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 30px | Bold |
| H2 | Inter | 24px | Semibold |
| H3 | Inter | 20px | Semibold |
| Body | Inter | 14px | Regular |
| Small | Inter | 12px | Regular |
| Button | Inter | 14px | Medium |

### 1.3 Component Library

Shadcn/UI components with Tailwind CSS.

#### Button Variants

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────┐  Primary: bg-green-500, text-white     │
│  │  Simpan     │  Hover: bg-green-600                   │
│  └─────────────┘  → Aksi utama (simpan, generate, scan) │
│                                                         │
│  ┌─────────────┐  Secondary: bg-slate-100, text-slate-700│
│  │  Batal      │  Hover: bg-slate-200                   │
│  └─────────────┘  → Aksi sekunder (batal, tutup)        │
│                                                         │
│  ┌─────────────┐  Outline: border-slate-200, text-slate-700│
│  │  Export     │  Hover: bg-slate-50                    │
│  └─────────────┘  → Aksi tambahan (export, filter)      │
│                                                         │
│  ┌─────────────┐  Ghost: transparent, text-slate-500    │
│  │  Lainnya    │  Hover: bg-slate-100                   │
│  └─────────────┘  → Icon buttons, menu triggers         │
│                                                         │
│  ┌─────────────┐  Destructive: bg-red-500, text-white   │
│  │  Hapus      │  Hover: bg-red-600                     │
│  └─────────────┘  → Aksi berbahaya (hapus, void)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Component Styling Rules

| Component | Style |
|-----------|-------|
| Card | `bg-white border border-slate-200 rounded-lg shadow-sm` |
| Input | `bg-white border-slate-200 focus:ring-green-500 focus:border-green-500` |
| Table | `bg-white` header: `bg-slate-50 text-slate-500 uppercase text-xs` |
| Table row hover | `hover:bg-slate-50` |
| Badge (status) | Success: `bg-green-50 text-green-700` Warning: `bg-amber-50 text-amber-700` |
| Sidebar active | `bg-green-50 text-green-700 border-l-2 border-green-500` |
| Sidebar item | `text-slate-600 hover:bg-slate-50 hover:text-slate-900` |
| Tab active | `border-b-2 border-green-500 text-green-600` |
| Tab inactive | `text-slate-500 hover:text-slate-700` |
| Stat card number | `text-slate-800 text-2xl font-bold` |
| Stat card label | `text-slate-400 text-sm` |
| Progress bar track | `bg-slate-100 rounded-full` |
| Progress bar fill | `bg-green-500 rounded-full` |
| Divider | `border-slate-200` |
| Avatar/Icon circle | `bg-green-50 text-green-600` |

---

## 2. Layout Structure

### 2.1 Auth Pages (Login, Register, etc.)

```
┌─────────────────────────────────────────────┐
│                                             │
│              ┌───────────────┐              │
│              │     LOGO      │              │
│              │  QurbanLink   │              │
│              └───────────────┘              │
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │    Form Card        │             │
│         │                     │             │
│         │  [Email         ]   │             │
│         │  [Password      ]   │             │
│         │                     │             │
│         │  [   Login   ]      │             │
│         │                     │             │
│         │  Forgot? | Register │             │
│         └─────────────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 Dashboard Layout (Desktop)

```
┌────────────────────────────────────────────────────────┐
│  [=] QurbanLink          Search...       [Bell] [User] │  ← bg-white, border-b slate-200
├──────────┬─────────────────────────────────────────────┤
│          │                                             │
│ Dashboard│  Page Title                    [Action Btn] │  ← bg-slate-50 (page bg)
│ Events   │  ───────────────────────────────────────── │
│ Pekurban │                                             │
│ Hewan    │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │  ← bg-white cards
│ Penerima │  │ Stat Card│ │ Stat Card│ │ Stat Card│   │    border-slate-200
│ Kupon    │  │ 400      │ │ 235      │ │ 165      │   │    angka: text-slate-800
│ ─────── │  │ Total    │ │Distributed│ │Remaining │   │    label: text-slate-400
│▌Scan     │  └──────────┘ └──────────┘ └──────────┘   │  ← active: bg-green-50
│ Dashboard│                                             │    text-green-700
│ Live     │  ┌────────────────────────────────────┐    │    border-l-2 green-500
│ ─────── │  │                                    │    │
│ Laporan  │  │          Chart / Table             │    │  ← bg-white card
│ ─────── │  │                                    │    │
│ Pengguna │  │                                    │    │
│ Pengaturan│ └────────────────────────────────────┘    │
│          │                                             │
├──────────┴─────────────────────────────────────────────┤
│  © 2026 QurbanLink                                     │  ← text-slate-400
└────────────────────────────────────────────────────────┘

Sidebar: bg-white, 256px (collapsible to 64px icon-only)
         border-r border-slate-200
         items: text-slate-600, hover: bg-slate-50
         active: bg-green-50 text-green-700
```

### 2.3 Dashboard Layout (Mobile/Tablet)

```
┌──────────────────────┐
│ [=]  QurbanLink [Bell]│  ← Header (hamburger menu)
├──────────────────────┤
│                      │
│  Page Title          │
│                      │
│  ┌────────────────┐  │
│  │  Stat Card     │  │
│  │  400 Total     │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │  Stat Card     │  │
│  │  235 Distributed│ │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   Chart/Table  │  │
│  │   (scrollable) │  │
│  └────────────────┘  │
│                      │
├──────────────────────┤
│ [Home][Scan][Dash][+]│  ← Bottom Navigation (mobile)
└──────────────────────┘
```

---

## 3. Page Wireframes

### 3.1 Landing Page (`/`)

```
┌─────────────────────────────────────────────────────┐
│  QurbanLink                    [Login] [Daftar]     │  ← bg-white, Daftar: bg-green-500
├─────────────────────────────────────────────────────┤
│                                                     │
│        Distribusi Kurban                            │
│        Lebih Mudah & Transparan                     │
│                                                     │
│        Platform digital untuk mengelola             │
│        distribusi daging hewan kurban               │
│        dengan QR Code                               │
│                                                     │
│        [Mulai Gratis]    [Lihat Demo]               │  ← green btn + outline btn
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   [Icon]           [Icon]          [Icon]           │
│   QR Kupon         Live Dashboard  Multi Lokasi     │
│   Generate &       Monitor         Kelola beberapa  │
│   scan kupon       distribusi      titik distribusi │
│   digital          real-time       sekaligus        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Paket Harga                                       │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│   │  Free   │ │ Starter │ │  Pro    │ │Enterpris│ │
│   │  Rp 0   │ │ Rp 99K  │ │ Rp 249K│ │ Custom  │ │
│   │ 100 kpn │ │ 500 kpn │ │ 2K kpn │ │Unlimited│ │
│   │ [Mulai] │ │ [Pilih] │ │ [Pilih] │ │[Hubungi]│ │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer: About | FAQ | Kontak | Syarat & Ketentuan │
└─────────────────────────────────────────────────────┘
```

### 3.2 Dashboard Home (`/dashboard`)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar │  Dashboard                               │
│          │                                          │
│          │  Selamat datang, Ahmad!                   │
│          │  Masjid Al-Furqon | Starter Plan         │
│          │                                          │
│          │  ┌────────┐ ┌────────┐ ┌────────┐       │
│          │  │ 3      │ │ 1.200  │ │ 500    │       │
│          │  │ Event  │ │ Penerima│ │ Kupon  │       │
│          │  │ Aktif  │ │ Total  │ │ Generated│      │
│          │  └────────┘ └────────┘ └────────┘       │
│          │                                          │
│          │  Event Aktif                              │
│          │  ┌──────────────────────────────────┐    │
│          │  │ Kurban 1447H     17 Jun 2026     │    │
│          │  │ ████████████░░░  235/400 (58%)   │    │
│          │  │                      [Lihat] [→] │    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│          │  Kuota Kupon                              │
│          │  ████████████████░░  380/500 tersisa     │
│          │                                          │
│          │  Aktivitas Terakhir                       │
│          │  • Scan kupon QRB-00235 oleh Ahmad       │
│          │  • 10 penerima baru ditambahkan          │
│          │  • Event "Kurban 1447H" diaktifkan       │
└─────────────────────────────────────────────────────┘
```

### 3.3 Event Detail (`/events/{id}`)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar │  ← Kembali                               │
│          │                                          │
│          │  Kurban Idul Adha 1447H                   │
│          │  17 Juni 2026 | Status: Aktif            │
│          │                                          │
│          │  [Tab: Ringkasan] [Penerima] [Hewan]     │
│          │  [Kupon] [Pekurban] [Lokasi]             │
│          │                                          │
│          │  ── Tab: Ringkasan ──                     │
│          │                                          │
│          │  ┌────────┐ ┌────────┐ ┌────────┐       │
│          │  │ 400    │ │ 10     │ │ 5      │       │
│          │  │Penerima│ │ Hewan  │ │Pekurban│       │
│          │  └────────┘ └────────┘ └────────┘       │
│          │                                          │
│          │  Distribusi per Kategori                  │
│          │  Fakir  ████████░░  80/100               │
│          │  Miskin ██████░░░░  65/100               │
│          │  Umum   ████░░░░░░  90/200               │
│          │                                          │
│          │  [Generate Kupon] [Cetak Kupon] [Laporan]│
└─────────────────────────────────────────────────────┘
```

### 3.4 Recipients List (`/events/{id}/recipients`)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar │  Daftar Penerima                         │
│          │  Event: Kurban 1447H                     │
│          │                                          │
│          │  [+ Tambah] [Import Excel] [Export]      │
│          │                                          │
│          │  [Search...     ] [Kategori ▼] [Status ▼]│
│          │                                          │
│          │  ┌──┬──────────┬────────┬───────┬──────┐ │
│          │  │# │ Nama     │Kategori│Bagian │Status│ │
│          │  ├──┼──────────┼────────┼───────┼──────┤ │
│          │  │1 │Siti A.   │Fakir   │ 1     │ ✓    │ │
│          │  │2 │Ahmad B.  │Miskin  │ 1     │ ✓    │ │
│          │  │3 │Budi C.   │Umum    │ 1     │ -    │ │
│          │  │4 │Dewi D.   │Fakir   │ 2     │ -    │ │
│          │  │..│...       │...     │ ...   │ ...  │ │
│          │  └──┴──────────┴────────┴───────┴──────┘ │
│          │                                          │
│          │  Showing 1-15 of 400    [< 1 2 3 ... >] │
└─────────────────────────────────────────────────────┘
```

### 3.5 QR Code Scanner Page (`/scan`)

```
Mobile-optimized view:

┌────────────────────────┐
│  ← Scan Kupon          │
│  Event: Kurban 1447H   │
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │                  │  │
│  │                  │  │
│  │   CAMERA VIEW    │  │
│  │   [QR Scanner]   │  │
│  │                  │  │
│  │    ┌────────┐    │  │
│  │    │ Target │    │  │
│  │    └────────┘    │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  [Input Manual Nomor]  │
│                        │
│  ── Hasil Scan ──      │
│                        │
│  (sebelum scan)        │
│  Arahkan kamera ke     │
│  QR Code kupon         │
│                        │
├────────────────────────┤
│ [Home] [Scan] [Dash]   │
└────────────────────────┘
```

### 3.6 Scan Result — Success

```
┌────────────────────────┐
│  ← Scan Kupon          │
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │   ✓  VALID       │  │  ← bg-green-50, border-green-500
│  │                  │  │
│  │  QRB-2026-00235  │  │
│  │                  │  │
│  │  Nama: Siti A.   │  │
│  │  Kategori: Fakir │  │
│  │  Bagian: 1       │  │
│  │  Alamat: Jl...   │  │
│  │                  │  │
│  │ [KONFIRMASI      │  │  ← Large green button
│  │  DISTRIBUSI]     │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  [Scan Berikutnya]     │
│                        │
├────────────────────────┤
│ [Home] [Scan] [Dash]   │
└────────────────────────┘
```

### 3.7 Scan Result — Already Claimed

```
┌────────────────────────┐
│  ← Scan Kupon          │
├────────────────────────┤
│                        │
│  ┌──────────────────┐  │
│  │   ✗  SUDAH       │  │  ← bg-red-50, border-red-500
│  │      DIAMBIL     │  │
│  │                  │  │
│  │  QRB-2026-00235  │  │
│  │                  │  │
│  │  Nama: Siti A.   │  │
│  │  Diambil pada:   │  │
│  │  17/06 08:30 WIB │  │
│  │  Oleh: Ahmad     │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  [Scan Berikutnya]     │
│                        │
├────────────────────────┤
│ [Home] [Scan] [Dash]   │
└────────────────────────┘
```

### 3.8 Live Dashboard (`/live-dashboard`)

```
Full-screen mode (TV/Projector friendly):

┌─────────────────────────────────────────────────────┐
│  Masjid Al-Furqon — Kurban 1447H        10:30 WIB  │  ← bg-white, text-slate-800
├─────────────────────────────────────────────────────┤
│                                                     │  ← bg-slate-50
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  ← bg-white cards
│  │    235       │  │     400      │  │   58.7%   │ │    angka: text-green-600
│  │  DISTRIBUTED │  │    TOTAL     │  │  PROGRESS │ │    label: text-slate-400
│  │  ▲ +3 /5min  │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                     │
│  ████████████████████████████░░░░░░░░░░  58.7%     │  ← fill: green-500, track: slate-100
│                                                     │
│  Per Kategori:                                      │
│  Fakir   ████████████████░░░░  80/100   80%        │
│  Miskin  ████████████░░░░░░░░  65/100   65%        │
│  Umum    ████████░░░░░░░░░░░░  90/200   45%        │
│                                                     │
│  ┌───────────────────────┐  ┌──────────────────┐   │
│  │ Distribusi per Jam    │  │ Scan Terakhir    │   │
│  │                       │  │                  │   │
│  │    ▓▓                 │  │ 10:30 Siti A.  ✓│   │
│  │    ▓▓  ▓▓             │  │ 10:29 Ahmad B. ✓│   │
│  │ ▓▓ ▓▓  ▓▓  ▓▓        │  │ 10:28 Budi C.  ✓│   │
│  │ ▓▓ ▓▓  ▓▓  ▓▓  ░░    │  │ 10:27 Dewi D.  ✓│   │
│  │ 08  09  10  11  12    │  │ 10:25 Eko E.   ✓│   │
│  └───────────────────────┘  │ ...              │   │
│                              └──────────────────┘   │
│                                                     │
│  [Fullscreen]  [Auto-refresh: ON]  Terakhir: 10:30 │
└─────────────────────────────────────────────────────┘
```

### 3.9 Coupon Print Preview

```
A4 Page Layout (4 coupons per page):

┌─────────────────────────────────────┐
│  ┌──────────────┐ ┌──────────────┐  │
│  │ ┌────┐       │ │ ┌────┐       │  │
│  │ │ QR │ Masjid│ │ │ QR │ Masjid│  │
│  │ │Code│ Al-F  │ │ │Code│ Al-F  │  │
│  │ └────┘       │ │ └────┘       │  │
│  │              │ │              │  │
│  │ QRB-2026-001│ │ QRB-2026-002│  │
│  │ Siti Aminah │ │ Ahmad Budiman│  │
│  │ Fakir | 1bg │ │ Miskin | 1bg │  │
│  │ ─────────── │ │ ─────────── │  │
│  │ 17 Jun 2026 │ │ 17 Jun 2026 │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ ┌────┐       │ │ ┌────┐       │  │
│  │ │ QR │ Masjid│ │ │ QR │ Masjid│  │
│  │ │Code│ Al-F  │ │ │Code│ Al-F  │  │
│  │ └────┘       │ │ └────┘       │  │
│  │              │ │              │  │
│  │ QRB-2026-003│ │ QRB-2026-004│  │
│  │ Budi Cahyono│ │ Dewi Damayant│  │
│  │ Umum  | 1bg │ │ Fakir | 2bg │  │
│  │ ─────────── │ │ ─────────── │  │
│  │ 17 Jun 2026 │ │ 17 Jun 2026 │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 3.10 Super Admin Dashboard (`/admin`)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar │  Platform Overview                       │
│          │                                          │
│ Overview │  ┌────────┐ ┌────────┐ ┌────────┐       │
│ Tenants  │  │  156   │ │  89    │ │ 45.2K  │       │
│ Subscrip.│  │ Total  │ │ Active │ │ Kupon  │       │
│ Payments │  │ Tenants│ │ Events │ │ Generated│      │
│ Audit Log│  └────────┘ └────────┘ └────────┘       │
│ Settings │                                          │
│          │  ┌────────┐ ┌────────┐ ┌────────┐       │
│          │  │Rp 12.5M│ │  67    │ │  45    │       │
│          │  │Revenue │ │ Paid   │ │ Free   │       │
│          │  │(month) │ │ Tenants│ │ Tenants│       │
│          │  └────────┘ └────────┘ └────────┘       │
│          │                                          │
│          │  Tenant Terbaru                           │
│          │  ┌──────────────────────────────────┐    │
│          │  │ Masjid Al-Ikhlas  | Starter | ✓ │    │
│          │  │ Yayasan Baitul M. | Pro     | ✓ │    │
│          │  │ Masjid Raya Bdg   | Free    | ✓ │    │
│          │  └──────────────────────────────────┘    │
│          │                                          │
│          │  Revenue Chart (Monthly)                  │
│          │  ┌──────────────────────────────────┐    │
│          │  │  ▓▓                               │    │
│          │  │  ▓▓  ▓▓      ▓▓  ▓▓              │    │
│          │  │  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓         │    │
│          │  │  Jan Feb Mar Apr May Jun          │    │
│          │  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 4. Navigation Structure

### 4.1 Sidebar Menu (Tenant)

```
Dashboard
─────────
Events
  └── [Active Event Name]
      ├── Ringkasan
      ├── Penerima
      ├── Hewan Kurban
      ├── Pekurban
      ├── Kupon
      └── Lokasi
─────────
Scan Kupon          ← Quick access (prominent)
Live Dashboard      ← Quick access
─────────
Laporan
─────────
Pengguna            ← tenant_admin only
Pengaturan          ← tenant_admin only
  ├── Profil Organisasi
  ├── Subscription
  └── Preferensi
```

### 4.2 Bottom Navigation (Mobile)

```
[🏠 Home]  [📷 Scan]  [📊 Dashboard]  [⋯ Lainnya]
```

---

## 5. PWA Specification

### 5.1 Manifest

```json
{
  "name": "QurbanLink - Distribusi Kurban Digital",
  "short_name": "QurbanLink",
  "description": "Platform distribusi daging hewan kurban dengan QR Code",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#FFFFFF",
  "theme_color": "#22C55E",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 5.2 Offline Pages

| Page | Offline Support | Strategy |
|------|:---------------:|----------|
| Login | Yes | Cached shell, network for auth |
| Dashboard | Partial | Last cached data |
| Scan | Yes | Full offline scan support |
| Recipient list | Partial | Cached list for reference |
| Live Dashboard | No | Requires real-time connection |
| Settings | No | Requires network |

### 5.3 Install Prompt

Tampilkan custom install banner setelah user login 2x:

```
┌────────────────────────────────────┐
│ 📱 Install QurbanLink             │
│                                    │
│ Akses lebih cepat dan bisa scan   │
│ kupon offline.                     │
│                                    │
│ [Install Sekarang]  [Nanti Saja]  │
└────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Stack, bottom nav, no sidebar |
| Tablet | 640-1024px | Collapsible sidebar, grid 2 col |
| Desktop | 1024-1440px | Full sidebar, grid 3 col |
| Large/TV | > 1440px | Full sidebar, grid 4 col, display mode |

---

## 7. Key Interaction Patterns

### 7.1 Scan Flow (Mobile)

```
[Open Scanner] → [Point Camera] → [QR Detected] → [Show Result]
     │                                                    │
     │                                               ┌────┴────┐
     │                                               │ Valid?  │
     │                                          ┌────┤         ├────┐
     │                                          │Yes │         │ No │
     │                                          │    └─────────┘    │
     │                                          ▼                   ▼
     │                                    [Show Data]        [Show Error]
     │                                    [Confirm Btn]      [Sound: Beep]
     │                                          │
     │                                          ▼
     │                                    [Tap Confirm]
     │                                          │
     │                                          ▼
     │                                    [Success!]
     │                                    [Sound: Ding]
     │                                    [Vibrate]
     │                                          │
     └──────────────────────────────────────────┘
                    [Scan Next]
```

### 7.2 Feedback Patterns

| Action | Visual | Audio | Haptic |
|--------|--------|-------|--------|
| QR Detected | Blue highlight | - | Short vibrate |
| Scan Success | Green card + checkmark | Success chime | Double vibrate |
| Scan Failed | Red card + X mark | Error beep | Long vibrate |
| Already Claimed | Orange card + warning | Warning tone | Triple vibrate |
| Offline scan queued | Yellow indicator | Soft beep | Short vibrate |

---

## 8. Email Templates

### 8.1 Registration Welcome

```
Subject: Selamat Datang di QurbanLink! 🕌

Assalamu'alaikum {nama},

Terima kasih telah mendaftarkan {nama_organisasi} di QurbanLink.

Silakan verifikasi email Anda:
[Verifikasi Email]

Setelah verifikasi, Anda bisa langsung:
1. Setup organisasi
2. Buat event kurban
3. Generate kupon QR Code

Jazakallahu khairan,
Tim QurbanLink
```

### 8.2 Account Verified

```
Subject: Akun Anda Telah Aktif ✓

Assalamu'alaikum {nama},

Akun {nama_organisasi} telah berhasil diverifikasi
dan siap digunakan.

[Masuk ke Dashboard]

Butuh bantuan? Hubungi support@qurbanlink.id
```

### 8.3 Password Changed

```
Subject: Password Anda Telah Diubah

Assalamu'alaikum {nama},

Password akun Anda telah berhasil diubah pada {waktu}.

Jika Anda tidak melakukan perubahan ini,
segera hubungi support kami.

[Hubungi Support]
```
