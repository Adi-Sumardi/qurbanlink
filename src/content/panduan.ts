import {
  LayoutDashboard,
  CalendarDays,
  Beef,
  Ticket,
  ScanLine,
  Users,
  FileBarChart2,
  Settings,
  MapPin,
  Tv,
  HeartHandshake,
  Printer,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export type PanduanStep = { title: string; desc: string };

export interface PanduanModule {
  slug: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  /** Tagline pendek untuk meta description / hero detail */
  description: string;
  steps: PanduanStep[];
  tips?: string[];
}

export const PANDUAN_MODULES: PanduanModule[] = [
  {
    slug: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    summary:
      'Halaman utama setelah login. Menampilkan ringkasan event aktif, jumlah hewan, kupon yang sudah & belum tersalurkan, serta aktivitas terbaru panitia.',
    description:
      'Memahami panel utama Tawzii Digital: ringkasan event aktif, aksi cepat, dan feed aktivitas panitia.',
    steps: [
      {
        title: 'Lihat ringkasan event',
        desc: 'Kartu-kartu di atas memuat total kupon, kupon ter-scan, sisa stok daging, dan progres distribusi real-time.',
      },
      {
        title: 'Aksi cepat',
        desc: 'Tombol pintasan untuk membuat event baru, scan kupon, atau membuka live dashboard publik.',
      },
      {
        title: 'Notifikasi & aktivitas',
        desc: 'Feed aktivitas menampilkan riwayat scan, penambahan hewan, dan perubahan konfigurasi oleh tim panitia.',
      },
    ],
  },
  {
    slug: 'event',
    title: 'Manajemen Event Kurban',
    icon: CalendarDays,
    summary:
      'Setiap musim kurban (Idul Adha) Anda membuat 1 event. Event berisi semua konfigurasi: hewan, lokasi, kupon, dan jadwal distribusi.',
    description:
      'Cara membuat, mengaktifkan, dan mengarsipkan event kurban — dari Idul Adha 1 musim ke musim berikutnya.',
    steps: [
      {
        title: 'Buat event baru',
        desc: 'Buka menu Events → Buat Event. Isi nama event (mis. "Idul Adha 1447 H"), tanggal pelaksanaan, dan deskripsi.',
      },
      {
        title: 'Atur jadwal distribusi',
        desc: 'Tentukan tanggal mulai & selesai pembagian agar kupon hanya valid pada periode tersebut.',
      },
      {
        title: 'Aktifkan event',
        desc: 'Setelah konfigurasi selesai, ubah status event jadi "Aktif" supaya kupon bisa di-scan oleh petugas lapangan.',
      },
      {
        title: 'Arsipkan event lama',
        desc: 'Selesai musim, arsipkan event agar tidak tercampur dengan event berikutnya — data laporan tetap tersimpan.',
      },
    ],
    tips: [
      'Hanya 1 event yang boleh berstatus Aktif dalam satu waktu agar scan tidak ambigu.',
      'Anda bisa duplikat event lama sebagai template untuk tahun berikutnya.',
    ],
  },
  {
    slug: 'hewan',
    title: 'Manajemen Hewan Kurban',
    icon: Beef,
    summary:
      'Catat setiap hewan kurban (sapi, kambing, domba) lengkap dengan data sohibul, berat, dan kondisi. Sistem otomatis menghitung target jumlah kupon dari estimasi daging.',
    description:
      'Input hewan kurban beserta sohibul, status penyembelihan, dan kalkulasi otomatis paket distribusi.',
    steps: [
      {
        title: 'Tambah hewan',
        desc: 'Buka Event → Hewan → Tambah. Pilih jenis (sapi/kambing/domba), masukkan berat hidup & estimasi daging.',
      },
      {
        title: 'Data sohibul',
        desc: 'Kaitkan tiap hewan dengan nama pekurban (sohibul) — untuk sapi patungan bisa berisi 7 nama.',
      },
      {
        title: 'Update status penyembelihan',
        desc: 'Tandai status: Belum disembelih → Sedang diproses → Selesai. Berat daging final di-input setelah ditimbang.',
      },
      {
        title: 'Kalkulasi otomatis paket',
        desc: 'Sistem membagi total kg daging dengan target gram per paket untuk menghitung jumlah kupon yang bisa diterbitkan.',
      },
    ],
    tips: [
      'Gunakan foto hewan saat input data untuk dokumentasi laporan ke sohibul.',
      'Berat estimasi cukup di awal; berat aktual diperbarui setelah penimbangan akhir.',
    ],
  },
  {
    slug: 'donatur',
    title: 'Data Sohibul / Donatur',
    icon: HeartHandshake,
    summary:
      'Database pekurban yang berkontribusi pada event. Berguna untuk laporan ke pekurban dan kampanye tahun berikutnya.',
    description:
      'Kelola data pekurban (sohibul), kaitkan ke hewan, dan kirim laporan pribadi pasca distribusi.',
    steps: [
      {
        title: 'Daftarkan sohibul',
        desc: 'Buka Event → Donatur → Tambah. Isi nama, kontak, dan jenis kontribusi (sapi penuh, 1/7 sapi, kambing).',
      },
      {
        title: 'Kaitkan ke hewan',
        desc: 'Saat menambah hewan, pilih sohibul dari daftar agar laporan per pekurban otomatis terbentuk.',
      },
      {
        title: 'Kirim laporan',
        desc: 'Setelah event selesai, ekspor laporan per sohibul (PDF) berisi foto hewan, berat, dan zona distribusi.',
      },
    ],
  },
  {
    slug: 'lokasi',
    title: 'Lokasi & Zona Distribusi',
    icon: MapPin,
    summary:
      'Bagi area distribusi menjadi zona (RT/RW, kampung, dusun) agar kupon tidak menumpuk di satu wilayah dan distribusi lebih adil.',
    description:
      'Buat zona distribusi (RT/RW), atur kuota per zona, dan pantau saturasi pengambilan secara real-time.',
    steps: [
      {
        title: 'Tambah zona',
        desc: 'Event → Lokasi → Tambah Zona. Isi nama (mis. "RT 03 / RW 05") dan kuota kupon untuk zona tersebut.',
      },
      {
        title: 'Assign penerima ke zona',
        desc: 'Saat menambah penerima manfaat, pilih zona-nya — sistem akan validasi agar tidak melebihi kuota.',
      },
      {
        title: 'Pantau saturasi zona',
        desc: 'Di live dashboard, tiap zona memiliki indikator warna: hijau (longgar), kuning (hampir penuh), merah (penuh).',
      },
    ],
  },
  {
    slug: 'penerima',
    title: 'Penerima Manfaat (Mustahik)',
    icon: Users,
    summary:
      'Daftar warga atau mustahik yang berhak menerima kupon. Bisa diimpor massal dari Excel atau ditambah satu per satu.',
    description:
      'Input daftar mustahik manual atau impor Excel, lalu generate kupon QR Code unik untuk masing-masing.',
    steps: [
      {
        title: 'Tambah manual',
        desc: 'Event → Penerima → Tambah. Isi nama, alamat, nomor HP (opsional), zona, dan kategori (fakir/miskin/dhuafa).',
      },
      {
        title: 'Impor massal dari Excel',
        desc: 'Download template, isi data, lalu unggah. Sistem akan validasi duplikasi & format sebelum disimpan.',
      },
      {
        title: 'Generate kupon',
        desc: 'Setelah daftar penerima fix, klik "Generate Kupon" — sistem menerbitkan QR Code unik untuk tiap penerima.',
      },
    ],
    tips: [
      'Gunakan NIK atau nomor HP sebagai identifier unik untuk mencegah duplikasi.',
      'Kategori penerima berguna untuk laporan demografis ke donatur.',
    ],
  },
  {
    slug: 'kupon',
    title: 'Kupon QR Code',
    icon: Ticket,
    summary:
      'Setiap penerima mendapat kupon dengan QR Code unik yang hanya bisa di-scan sekali. Kupon bisa dicetak fisik atau dikirim via WhatsApp.',
    description:
      'Cetak batch kupon QR, kirim digital ke WhatsApp penerima, dan kelola status kupon (aktif/terpakai/batal).',
    steps: [
      {
        title: 'Cetak batch',
        desc: 'Event → Kupon → Cetak. Pilih rentang nomor atau zona, lalu generate PDF siap cetak (4-up / 8-up).',
      },
      {
        title: 'Kirim digital',
        desc: 'Untuk penerima yang punya HP, kirim kupon via WhatsApp — mereka tinggal tunjukkan QR di layar saat ambil daging.',
      },
      {
        title: 'Status kupon',
        desc: 'Tiap kupon punya 3 status: Belum Aktif (event belum mulai), Aktif (siap scan), Terpakai (sudah ambil).',
      },
      {
        title: 'Cetak ulang / batalkan',
        desc: 'Kupon hilang bisa dibatalkan & diterbitkan kupon pengganti — QR lama otomatis invalid.',
      },
    ],
    tips: [
      'Cetak kupon di kertas dengan kop masjid agar lebih resmi.',
      'QR Code tidak bisa difotokopi karena sistem mendeteksi scan kedua secara otomatis.',
    ],
  },
  {
    slug: 'scan',
    title: 'Scan Distribusi (Hari-H)',
    icon: ScanLine,
    summary:
      'Petugas lapangan membuka modul Scan di HP untuk memverifikasi kupon penerima. Bekerja offline — sinkron otomatis saat online kembali.',
    description:
      'Operasional hari-H: scan QR kupon penerima dengan HP, validasi otomatis, dan mode offline saat sinyal lemah.',
    steps: [
      {
        title: 'Login petugas',
        desc: 'Tiap petugas login dengan akun masing-masing supaya log scan tercatat per orang.',
      },
      {
        title: 'Buka modul Scan',
        desc: 'Menu Scan → izinkan akses kamera → arahkan ke QR pada kupon penerima.',
      },
      {
        title: 'Verifikasi otomatis',
        desc: 'Sistem menampilkan: nama penerima, zona, dan jenis paket. Klik "Konfirmasi Ambil" untuk menandai terpakai.',
      },
      {
        title: 'Mode offline',
        desc: 'Jika sinyal hilang, scan tetap jalan & data disimpan lokal. Otomatis sinkron ke server saat koneksi kembali.',
      },
      {
        title: 'Tangani kupon invalid',
        desc: 'Kupon yang sudah terpakai akan ditolak dengan notif merah. Petugas bisa lihat siapa & kapan kupon discan pertama.',
      },
    ],
    tips: [
      'Siapkan minimal 2 HP scanner agar antrian tidak menumpuk.',
      'Charger / power bank wajib — modul kamera cukup boros baterai.',
    ],
  },
  {
    slug: 'live-dashboard',
    title: 'Live Dashboard Publik',
    icon: Tv,
    summary:
      'Halaman publik (tanpa login) yang menampilkan progres distribusi real-time. Cocok ditayangkan di layar TV masjid agar jamaah ikut memantau transparansi.',
    description:
      'Aktifkan live page publik untuk pantau distribusi real-time — bisa ditayangkan di layar TV masjid.',
    steps: [
      {
        title: 'Aktifkan live page',
        desc: 'Event → Live Dashboard → Aktifkan. Sistem memberi URL publik unik (mis. tawzii.id/live/abc123).',
      },
      {
        title: 'Tampilkan di layar',
        desc: 'Buka URL di browser layar TV — halaman auto-refresh, menampilkan progres per zona & total daging tersalurkan.',
      },
      {
        title: 'Sebarkan ke jamaah',
        desc: 'Bagikan link/QR ke jamaah agar bisa pantau dari HP masing-masing.',
      },
    ],
  },
  {
    slug: 'print',
    title: 'Cetak Dokumen',
    icon: Printer,
    summary:
      'Selain kupon, sistem bisa mencetak: kartu petugas, label paket daging, dan tanda terima penerimaan. Semua format A4 / thermal printer.',
    description:
      'Cetak kartu petugas, label paket daging, dan tanda terima — siap pakai untuk operasional di lapangan.',
    steps: [
      {
        title: 'Kartu petugas',
        desc: 'Settings → Users → Cetak ID Card. Berisi nama, foto, peran, dan QR akses cepat.',
      },
      {
        title: 'Label paket',
        desc: 'Event → Kupon → Cetak Label. Tempel di plastik daging berisi nomor urut & zona tujuan.',
      },
      {
        title: 'Tanda terima',
        desc: 'Setelah penerima ambil daging, cetak/kirim tanda terima berisi nama, tanggal, dan paraf petugas.',
      },
    ],
  },
  {
    slug: 'laporan',
    title: 'Laporan & Ekspor',
    icon: FileBarChart2,
    summary:
      'Setelah event selesai, ekspor laporan lengkap dalam format PDF & Excel untuk dilaporkan ke pengurus, sohibul, dan keperluan audit.',
    description:
      'Ekspor laporan distribusi PDF & Excel — per zona, per sohibul, dan arsip multi-tahun untuk perbandingan.',
    steps: [
      {
        title: 'Laporan distribusi',
        desc: 'Reports → Distribusi. Berisi total kupon, terpakai, tidak terpakai, per zona, per jenis hewan.',
      },
      {
        title: 'Laporan per sohibul',
        desc: 'PDF per pekurban berisi foto hewan, berat, dan rincian zona penerima.',
      },
      {
        title: 'Ekspor Excel',
        desc: 'Untuk audit, ekspor semua data ke Excel: hewan, penerima, kupon, log scan, dan timeline aktivitas.',
      },
      {
        title: 'Arsip multi-tahun',
        desc: 'Data laporan event lama tetap tersimpan sehingga bisa dibandingkan antar musim kurban.',
      },
    ],
  },
  {
    slug: 'users',
    title: 'Manajemen Tim Panitia',
    icon: Users,
    summary:
      'Undang anggota panitia ke akun masjid dan atur peran (role) sesuai tanggung jawab masing-masing.',
    description:
      'Undang anggota panitia, atur role (Admin/Panitia/Scanner/Viewer), dan nonaktifkan akun yang tidak aktif.',
    steps: [
      {
        title: 'Undang anggota',
        desc: 'Settings → Users → Undang. Masukkan email — sistem kirim link aktivasi otomatis.',
      },
      {
        title: 'Atur role',
        desc: 'Pilih peran: Admin (semua akses), Panitia (input data), Scanner (hanya scan kupon), Viewer (read-only).',
      },
      {
        title: 'Nonaktifkan akun',
        desc: 'Anggota yang sudah tidak aktif bisa di-nonaktifkan agar tidak bisa login, tanpa menghapus log riwayatnya.',
      },
    ],
  },
  {
    slug: 'settings',
    title: 'Settings Masjid',
    icon: Settings,
    summary:
      'Konfigurasi profil masjid, logo, dan preferensi yang muncul di kupon, laporan, dan live dashboard.',
    description:
      'Atur profil masjid (nama, logo, kontak) dan preferensi branding yang muncul di kupon serta laporan.',
    steps: [
      {
        title: 'Profil masjid',
        desc: 'Nama masjid, alamat, kontak, dan logo. Data ini muncul di header kupon & laporan.',
      },
      {
        title: 'Branding',
        desc: 'Unggah logo & atur warna aksen agar dokumen yang dicetak konsisten dengan identitas masjid.',
      },
      {
        title: 'Notifikasi',
        desc: 'Aktifkan email/WhatsApp notifikasi untuk event penting (kupon habis, hari-H, dll).',
      },
    ],
  },
  {
    slug: 'subscription',
    title: 'Langganan & Pembayaran',
    icon: CreditCard,
    summary:
      'Tawzii Digital gratis untuk masjid dengan paket Free. Paket berbayar membuka kuota kupon lebih besar, fitur lanjutan, dan dukungan prioritas.',
    description:
      'Kelola paket langganan masjid, upgrade via Midtrans, dan unduh invoice untuk laporan keuangan.',
    steps: [
      {
        title: 'Cek paket aktif',
        desc: 'Settings → Subscription. Lihat paket saat ini, kuota terpakai, dan tanggal perpanjangan.',
      },
      {
        title: 'Upgrade paket',
        desc: 'Pilih paket → bayar via Midtrans (transfer bank, e-wallet, kartu). Fitur premium aktif otomatis setelah bayar.',
      },
      {
        title: 'Riwayat tagihan',
        desc: 'Semua invoice tersimpan & bisa diunduh sebagai PDF untuk laporan keuangan masjid.',
      },
    ],
  },
  {
    slug: 'keamanan',
    title: 'Keamanan & Privasi Data',
    icon: ShieldCheck,
    summary:
      'Tawzii Digital menjaga data masjid & penerima dengan enkripsi end-to-end, audit log, dan kepatuhan terhadap regulasi pelindungan data pribadi Indonesia.',
    description:
      'Audit log, backup otomatis, dan akses berbasis role — kepatuhan terhadap UU Pelindungan Data Pribadi.',
    steps: [
      {
        title: 'Audit log',
        desc: 'Semua aktivitas (login, scan, edit data) tercatat dengan timestamp & user-nya — bisa ditelusuri kapan pun.',
      },
      {
        title: 'Backup otomatis',
        desc: 'Data di-backup harian. Anda juga bisa ekspor manual ke Excel kapan saja sebagai cadangan offline.',
      },
      {
        title: 'Akses berbasis role',
        desc: 'Tiap anggota tim hanya bisa melihat data sesuai perannya — petugas scanner tidak bisa lihat laporan keuangan.',
      },
    ],
  },
];

export const PANDUAN_BY_SLUG: Record<string, PanduanModule> = Object.fromEntries(
  PANDUAN_MODULES.map((m) => [m.slug, m])
);
