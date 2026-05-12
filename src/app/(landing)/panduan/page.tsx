import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
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

export const metadata: Metadata = {
  title: 'Panduan Penggunaan — Handbook Modul Tawzii Digital',
  description:
    'Panduan lengkap penggunaan aplikasi Tawzii Digital: dari setup event kurban, manajemen hewan, kupon QR, scan distribusi, hingga laporan. Handbook resmi untuk panitia masjid.',
  alternates: { canonical: 'https://tawzii.id/panduan' },
};

type Section = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  steps: { title: string; desc: string }[];
  tips?: string[];
};

const SECTIONS: Section[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    summary:
      'Halaman utama setelah login. Menampilkan ringkasan event aktif, jumlah hewan, kupon yang sudah & belum tersalurkan, serta aktivitas terbaru panitia.',
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
    id: 'event',
    title: 'Manajemen Event Kurban',
    icon: CalendarDays,
    summary:
      'Setiap musim kurban (Idul Adha) Anda membuat 1 event. Event berisi semua konfigurasi: hewan, lokasi, kupon, dan jadwal distribusi.',
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
    id: 'hewan',
    title: 'Manajemen Hewan Kurban',
    icon: Beef,
    summary:
      'Catat setiap hewan kurban (sapi, kambing, domba) lengkap dengan data sohibul, berat, dan kondisi. Sistem otomatis menghitung target jumlah kupon dari estimasi daging.',
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
    id: 'donatur',
    title: 'Data Sohibul / Donatur',
    icon: HeartHandshake,
    summary:
      'Database pekurban yang berkontribusi pada event. Berguna untuk laporan ke pekurban dan kampanye tahun berikutnya.',
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
    id: 'lokasi',
    title: 'Lokasi & Zona Distribusi',
    icon: MapPin,
    summary:
      'Bagi area distribusi menjadi zona (RT/RW, kampung, dusun) agar kupon tidak menumpuk di satu wilayah dan distribusi lebih adil.',
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
    id: 'penerima',
    title: 'Penerima Manfaat (Mustahik)',
    icon: Users,
    summary:
      'Daftar warga atau mustahik yang berhak menerima kupon. Bisa diimpor massal dari Excel atau ditambah satu per satu.',
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
    id: 'kupon',
    title: 'Kupon QR Code',
    icon: Ticket,
    summary:
      'Setiap penerima mendapat kupon dengan QR Code unik yang hanya bisa di-scan sekali. Kupon bisa dicetak fisik atau dikirim via WhatsApp.',
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
    id: 'scan',
    title: 'Scan Distribusi (Hari-H)',
    icon: ScanLine,
    summary:
      'Petugas lapangan membuka modul Scan di HP untuk memverifikasi kupon penerima. Bekerja offline — sinkron otomatis saat online kembali.',
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
    id: 'live',
    title: 'Live Dashboard Publik',
    icon: Tv,
    summary:
      'Halaman publik (tanpa login) yang menampilkan progres distribusi real-time. Cocok ditayangkan di layar TV masjid agar jamaah ikut memantau transparansi.',
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
    id: 'print',
    title: 'Cetak Dokumen',
    icon: Printer,
    summary:
      'Selain kupon, sistem bisa mencetak: kartu petugas, label paket daging, dan tanda terima penerimaan. Semua format A4 / thermal printer.',
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
    id: 'laporan',
    title: 'Laporan & Ekspor',
    icon: FileBarChart2,
    summary:
      'Setelah event selesai, ekspor laporan lengkap dalam format PDF & Excel untuk dilaporkan ke pengurus, sohibul, dan keperluan audit.',
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
    id: 'users',
    title: 'Manajemen Tim Panitia',
    icon: Users,
    summary:
      'Undang anggota panitia ke akun masjid dan atur peran (role) sesuai tanggung jawab masing-masing.',
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
    id: 'settings',
    title: 'Settings Masjid',
    icon: Settings,
    summary:
      'Konfigurasi profil masjid, logo, dan preferensi yang muncul di kupon, laporan, dan live dashboard.',
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
    id: 'subscription',
    title: 'Langganan & Pembayaran',
    icon: CreditCard,
    summary:
      'Tawzii Digital gratis untuk masjid dengan paket Free. Paket berbayar membuka kuota kupon lebih besar, fitur lanjutan, dan dukungan prioritas.',
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
    id: 'keamanan',
    title: 'Keamanan & Privasi Data',
    icon: ShieldCheck,
    summary:
      'Tawzii Digital menjaga data masjid & penerima dengan enkripsi end-to-end, audit log, dan kepatuhan terhadap regulasi pelindungan data pribadi Indonesia.',
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

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="border-b border-[#eceef0] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Tawzii Digital"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-headline text-sm font-extrabold text-[#004532]">
              Tawzii Digital
            </span>
          </Link>
          <Link
            href="/register"
            className="hidden rounded-full bg-[#004532] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#003524] md:inline-flex"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#3f4944] transition-colors hover:text-[#004532]"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Beranda
          </Link>
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#004532]">
            Handbook Aplikasi
          </p>
          <h1 className="font-headline text-4xl font-extrabold text-[#191c1e] md:text-5xl">
            Panduan Penggunaan Tawzii Digital
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#3f4944] md:text-lg">
            Dokumentasi lengkap setiap modul aplikasi — dari setup event,
            manajemen hewan kurban, kupon QR, scan distribusi, hingga laporan
            akhir. Panduan ini ditujukan untuk panitia masjid yang baru pertama
            kali menggunakan Tawzii.
          </p>
        </div>
      </section>

      {/* Layout */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar TOC */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
                Daftar Modul
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#3f4944] transition-colors hover:bg-[#f2f4f6] hover:text-[#004532]"
                  >
                    <s.icon className="size-4 shrink-0 text-[#004532]" />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-20 rounded-3xl bg-white p-8 shadow-sm md:p-10"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#a6f2d1] text-[#004532]">
                    <s.icon className="size-6" />
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold text-[#191c1e] md:text-3xl">
                    {s.title}
                  </h2>
                </div>

                <p className="text-base text-[#3f4944]">{s.summary}</p>

                <ol className="mt-6 space-y-4">
                  {s.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#004532] text-xs font-extrabold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-[#191c1e]">{step.title}</p>
                        <p className="mt-1 text-sm text-[#3f4944]">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {s.tips && s.tips.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-[#a6f2d1] bg-[#a6f2d1]/20 p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#004532]">
                      💡 Tips
                    </p>
                    <ul className="space-y-1.5 text-sm text-[#3f4944]">
                      {s.tips.map((t) => (
                        <li key={t} className="flex gap-2">
                          <span className="text-[#004532]">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-10 text-center text-white shadow-lg">
              <h3 className="font-headline text-2xl font-extrabold md:text-3xl">
                Siap memulai distribusi kurban modern?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
                Daftarkan masjid Anda sekarang — gratis, tanpa kartu kredit, dan
                bisa langsung dipakai untuk event terdekat.
              </p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-[#004532] shadow-xl transition-all hover:opacity-90 active:scale-95"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eceef0] bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-[#3f4944]/50">
          © {new Date().getFullYear()} adilabs.id. Seluruh hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
