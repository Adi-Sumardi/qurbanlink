/**
 * Seed data untuk halaman /coba (demo publik tanpa login).
 *
 * Semua data di file ini adalah simulasi — nama orang, alamat, NIK, dan
 * nomor HP di-generate tanpa korelasi ke individu nyata. Jangan ganti
 * dengan data asli tanpa persetujuan tertulis.
 */

export interface DemoSohibul {
  id: string;
  name: string;
  type: 'sapi-penuh' | 'sapi-patungan' | 'kambing';
}

export interface DemoHewan {
  id: string;
  jenis: 'Sapi' | 'Kambing';
  berat: number; // kg daging
  sohibulIds: string[];
  status: 'Selesai';
}

export interface DemoZona {
  id: string;
  nama: string;
  kuota: number;
}

export interface DemoPenerima {
  id: string;
  nama: string;
  alamat: string;
  hp: string; // partially masked
  zonaId: string;
  kategori: 'Fakir' | 'Miskin' | 'Dhuafa' | 'Lansia';
}

export type KuponStatus = 'Aktif' | 'Terpakai';

export interface DemoKupon {
  id: string; // e.g. "A-0001"
  penerimaId: string;
  status: KuponStatus;
  scanAt?: string; // ISO timestamp
  scanBy?: string;
}

export interface DemoScanLog {
  kuponId: string;
  penerimaNama: string;
  zona: string;
  petugas: string;
  at: string;
  status: 'success' | 'duplicate';
}

export const DEMO_MASJID = {
  nama: 'Masjid Al-Hikmah Demo',
  alamat: 'Bekasi, Jawa Barat',
};

export const DEMO_EVENT = {
  id: 'evt-demo',
  nama: 'Idul Adha 1447 H',
  tanggal: '2026-05-27',
  status: 'Aktif' as const,
};

export const DEMO_SOHIBUL: DemoSohibul[] = [
  { id: 'sh-1', name: 'H. Ahmad Fauzi', type: 'sapi-penuh' },
  { id: 'sh-2', name: 'Hj. Siti Aminah', type: 'sapi-patungan' },
  { id: 'sh-3', name: 'Bp. Rudi Hartono', type: 'kambing' },
  { id: 'sh-4', name: 'Ibu Dewi Lestari', type: 'kambing' },
  { id: 'sh-5', name: 'Bp. Hasan Basri', type: 'kambing' },
];

export const DEMO_HEWAN: DemoHewan[] = [
  { id: 'h-1', jenis: 'Sapi', berat: 195, sohibulIds: ['sh-1'], status: 'Selesai' },
  { id: 'h-2', jenis: 'Sapi', berat: 180, sohibulIds: ['sh-2'], status: 'Selesai' },
  { id: 'h-3', jenis: 'Sapi', berat: 205, sohibulIds: ['sh-2'], status: 'Selesai' },
  { id: 'h-4', jenis: 'Kambing', berat: 18, sohibulIds: ['sh-3'], status: 'Selesai' },
  { id: 'h-5', jenis: 'Kambing', berat: 16, sohibulIds: ['sh-4'], status: 'Selesai' },
  { id: 'h-6', jenis: 'Kambing', berat: 19, sohibulIds: ['sh-5'], status: 'Selesai' },
  { id: 'h-7', jenis: 'Kambing', berat: 17, sohibulIds: ['sh-3'], status: 'Selesai' },
  { id: 'h-8', jenis: 'Kambing', berat: 20, sohibulIds: ['sh-4'], status: 'Selesai' },
];

export const DEMO_ZONA: DemoZona[] = [
  { id: 'z-1', nama: 'RT 01 / RW 05', kuota: 10 },
  { id: 'z-2', nama: 'RT 02 / RW 05', kuota: 12 },
  { id: 'z-3', nama: 'RT 03 / RW 05', kuota: 15 },
  { id: 'z-4', nama: 'RT 04 / RW 05', kuota: 13 },
];

// Generate 50 penerima (mustahik) — distribusi: z1=10, z2=12, z3=15, z4=13
const PENERIMA_NAMES = [
  'Bp. Suparman', 'Ibu Maryam', 'Bp. Joko Susilo', 'Ibu Siti Khadijah',
  'Bp. Slamet Riyadi', 'Ibu Aminah', 'Bp. Mahmud', 'Ibu Rohmah',
  'Bp. Sukirno', 'Ibu Sumiati',
  'Bp. Wahyudi', 'Ibu Nuraini', 'Bp. Hidayat', 'Ibu Khotimah',
  'Bp. Rahmadi', 'Ibu Aisyah', 'Bp. Marsudi', 'Ibu Yati',
  'Bp. Sukamto', 'Ibu Painah', 'Bp. Saiful', 'Ibu Nasiyah',
  'Bp. Karyono', 'Ibu Rusmiyati', 'Bp. Sugiyono', 'Ibu Tarni',
  'Bp. Wagiman', 'Ibu Sumarni', 'Bp. Suparjo', 'Ibu Karsih',
  'Bp. Mardi', 'Ibu Wagiyem', 'Bp. Surono', 'Ibu Lestari',
  'Bp. Pardi', 'Ibu Tukinah', 'Bp. Bambang', 'Ibu Sukarni',
  'Bp. Hadi Suwito', 'Ibu Mujirah', 'Bp. Sutrisno', 'Ibu Wahyuni',
  'Bp. Sakijan', 'Ibu Suparti', 'Bp. Misbah', 'Ibu Sulastri',
  'Bp. Marno', 'Ibu Yatemi', 'Bp. Karim', 'Ibu Murni',
];

const KATEGORI: DemoPenerima['kategori'][] = ['Fakir', 'Miskin', 'Dhuafa', 'Lansia'];

function buildPenerima(): DemoPenerima[] {
  const distribusi = [
    { zonaId: 'z-1', count: 10 },
    { zonaId: 'z-2', count: 12 },
    { zonaId: 'z-3', count: 15 },
    { zonaId: 'z-4', count: 13 },
  ];
  const out: DemoPenerima[] = [];
  let idx = 0;
  for (const { zonaId, count } of distribusi) {
    for (let i = 0; i < count; i++) {
      const nama = PENERIMA_NAMES[idx % PENERIMA_NAMES.length];
      out.push({
        id: `p-${String(idx + 1).padStart(3, '0')}`,
        nama,
        alamat: `Jl. ${['Mawar', 'Melati', 'Anggrek', 'Kenanga', 'Dahlia'][idx % 5]} No. ${(idx % 50) + 1}`,
        hp: `08${(1000000000 + idx * 137).toString().slice(0, 9)}`.replace(/^(\d{4})(\d{5})/, '$1*****'),
        zonaId,
        kategori: KATEGORI[idx % KATEGORI.length],
      });
      idx++;
    }
  }
  return out;
}

export const DEMO_PENERIMA: DemoPenerima[] = buildPenerima();

// Generate 50 kupon. Status awal: 18 Terpakai (3-4 per zona ditangani secara proporsional), sisanya Aktif.
function buildKupon(): DemoKupon[] {
  // Tentukan mana saja yang sudah terpakai (seed deterministik supaya konsisten antar load).
  const terpakaiSeedIndex = [
    0, 1, 2, 3, 4, 5, 6, 7,         // RT 01: 8 terpakai dari 10
    10, 11, 12, 13, 14, 15,         // RT 02: 6 terpakai dari 12
    22, 23, 24,                     // RT 03: 3 terpakai dari 15
    37,                             // RT 04: 1 terpakai dari 13
  ];
  const terpakaiSet = new Set(terpakaiSeedIndex);

  return DEMO_PENERIMA.map((p, i) => {
    const id = `A-${String(i + 1).padStart(4, '0')}`;
    const isTerpakai = terpakaiSet.has(i);
    return {
      id,
      penerimaId: p.id,
      status: isTerpakai ? 'Terpakai' : 'Aktif',
      ...(isTerpakai
        ? {
            scanAt: new Date(Date.now() - (i + 1) * 60_000 * 7).toISOString(),
            scanBy: ['Pak Hasan', 'Pak Yusuf', 'Pak Rizki'][i % 3],
          }
        : {}),
    } satisfies DemoKupon;
  });
}

export const DEMO_KUPON: DemoKupon[] = buildKupon();

// Build initial scan log dari kupon yang sudah Terpakai
export const DEMO_SCAN_LOG: DemoScanLog[] = DEMO_KUPON
  .filter((k) => k.status === 'Terpakai' && k.scanAt)
  .map((k) => {
    const p = DEMO_PENERIMA.find((x) => x.id === k.penerimaId)!;
    const z = DEMO_ZONA.find((zo) => zo.id === p.zonaId)!;
    return {
      kuponId: k.id,
      penerimaNama: p.nama,
      zona: z.nama,
      petugas: k.scanBy!,
      at: k.scanAt!,
      status: 'success' as const,
    };
  })
  .sort((a, b) => b.at.localeCompare(a.at));
