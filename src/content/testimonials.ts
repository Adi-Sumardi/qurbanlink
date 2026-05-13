export interface Testimonial {
  /** Nama narasumber */
  name: string;
  /** Jabatan/peran (mis. "Ketua DKM", "Bendahara Panitia Kurban") */
  role: string;
  /** Nama masjid */
  masjid: string;
  /** Kota/lokasi singkat */
  location: string;
  /** Inisial untuk avatar fallback (2 huruf, otomatis di-uppercase) */
  initials: string;
  /** Kutipan testimoni */
  quote: string;
  /** Metrik singkat yang ingin di-highlight (opsional, mis. "1,200 kupon · 18 zona") */
  highlight?: string;
}

// NOTE: Konten di bawah adalah ilustrasi/placeholder.
// Sebelum publish ke produksi, ganti dengan testimoni asli + dapatkan
// persetujuan tertulis dari narasumber & pencantuman nama masjid.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'H. Ahmad Fauzi',
    role: 'Ketua DKM',
    masjid: 'Masjid Al-Hikmah',
    location: 'Bekasi',
    initials: 'AF',
    quote:
      'Tahun lalu distribusi 800 kupon butuh 4 jam dan masih ada komplain warga. Pakai Tawzii, tahun ini selesai 50 menit dan tidak ada satupun komplain. Donatur bahkan kirim WA "kapan acara lagi?" karena laporan PDF-nya rapi banget.',
    highlight: '800 kupon · 12 zona · 50 menit selesai',
  },
  {
    name: 'Ust. Saiful Anwar',
    role: 'Sekretaris Panitia Kurban',
    masjid: 'Masjid Jami` Baiturrahman',
    location: 'Yogyakarta',
    initials: 'SA',
    quote:
      'Yang bikin kami pindah ke digital itu fitur offline-nya. Lokasi distribusi kami di pinggir sawah, sinyal pas-pasan. Tawzii tetap jalan walaupun HP offline, lalu sync sendiri pas balik ke masjid. Panitia tinggal scan, gak mikir teknis.',
    highlight: 'Distribusi offline-friendly',
  },
  {
    name: 'Hj. Siti Aminah',
    role: 'Bendahara DKM',
    masjid: 'Masjid Nurul Iman',
    location: 'Bandung',
    initials: 'SA',
    quote:
      'Awalnya saya yang paling skeptis — takut panitia bingung pakai aplikasi. Ternyata onboarding 30 menit cukup. Yang paling membantu: laporan otomatis untuk 47 sohibul kami selesai dalam 1 jam, padahal dulu butuh 5 hari rekap manual.',
    highlight: '47 sohibul · laporan otomatis',
  },
  {
    name: 'Bapak Rudi Hartono',
    role: 'Koordinator Distribusi',
    masjid: 'Masjid At-Taqwa',
    location: 'Surabaya',
    initials: 'RH',
    quote:
      'Saya sudah 8 tahun jadi panitia kurban. Tahun ini paling tenang. Bukan karena pesertanya berkurang — justru terbanyak (1,200 penerima) — tapi karena semua tracked di sistem. Tidak ada lagi "siapa belum ambil?" yang bikin pusing.',
    highlight: '1,200 penerima · 0 kupon hilang',
  },
  {
    name: 'Drs. H. Mahmud Yusuf',
    role: 'Ketua Pengurus',
    masjid: 'Masjid Raya Al-Furqan',
    location: 'Padang',
    initials: 'MY',
    quote:
      'Live dashboard yang ditayangkan di TV masjid membuat jamaah lihat sendiri progres distribusi. Transparansi seperti ini tidak bisa dilawan rumor. Tahun depan donatur sudah daftar duluan tanpa kami promosi.',
    highlight: 'Live dashboard publik',
  },
  {
    name: 'Ibu Dewi Lestari',
    role: 'Admin Masjid',
    masjid: 'Masjid Al-Ikhlas',
    location: 'Tangerang Selatan',
    initials: 'DL',
    quote:
      'Sebagai admin, saya yang paling diuntungkan. Dulu input penerima manual 1 per 1 di Excel. Sekarang impor 600 nama dari Excel, generate kupon QR sekali klik. Hari-H tinggal pantau dashboard. Kurban jadi terasa ibadah, bukan beban administratif.',
    highlight: 'Import Excel · auto-generate QR',
  },
];
