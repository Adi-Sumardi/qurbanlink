export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ landing page — disusun untuk:
 * 1. Menjawab keberatan/concern paling umum calon user
 * 2. Mendukung SEO via FAQ Schema (rich snippet di Google)
 * 3. Mengurangi friction registrasi
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Apa itu Tawzii Digital?',
    answer:
      'Tawzii Digital adalah platform SaaS yang membantu masjid, mushola, dan lembaga sosial mengelola distribusi daging kurban secara digital. Mulai dari pendaftaran donatur, pendataan penerima, generate kupon QR, scan distribusi, sampai laporan keberlanjutan — semua dalam satu sistem terintegrasi.',
  },
  {
    question: 'Apakah Tawzii Digital gratis?',
    answer:
      'Ya, kami menyediakan paket Uji Coba gratis selama 3 hari dengan kuota 15 kupon. Setelah masa uji coba, Anda dapat memilih paket berbayar mulai Rp 1.000 untuk kuota lebih besar dan fitur tambahan seperti Live Dashboard, Export PDF, dan Priority Support.',
  },
  {
    question: 'Bagaimana cara mendaftar?',
    answer:
      'Cukup klik tombol "Mulai Gratis" atau "Pilih Paket" di halaman ini, lalu isi data masjid/organisasi Anda, data admin, dan event qurban yang akan dikelola. Proses pendaftaran selesai dalam kurang dari 2 menit. Setelah daftar, langsung dapat akses dashboard untuk mulai mendata penerima dan generate kupon.',
  },
  {
    question: 'Apakah aman menggunakan distribusi kupon digital?',
    answer:
      'Sangat aman. Setiap kupon QR memiliki signature HMAC-SHA256 unik yang tidak dapat dipalsukan atau di-screenshot lalu di-scan ulang. Sistem mendeteksi kupon yang sudah diklaim, mencegah double-claim, dan memberikan audit trail lengkap untuk setiap transaksi distribusi.',
  },
  {
    question: 'Apakah distribusi kurban online/digital sah menurut syariat?',
    answer:
      'Yang menjadi syarat sah kurban adalah hewan dan tatacara penyembelihan sesuai syariat. Distribusi daging — baik secara langsung maupun via sistem digital seperti kupon QR — tidak mempengaruhi keabsahan ibadah kurban. Kupon digital justru mempermudah panitia memastikan distribusi merata dan tepat sasaran. Pelajari lebih lanjut di artikel blog kami.',
  },
  {
    question: 'Apakah penerima harus punya HP atau internet?',
    answer:
      'Tidak. Penerima hanya perlu menunjukkan kupon QR yang dapat dicetak ke kertas biasa. Panitia di lokasi distribusi yang melakukan scan menggunakan HP mereka. Penerima tidak perlu install aplikasi, registrasi, atau memiliki internet pribadi.',
  },
  {
    question: 'Bagaimana jika sinyal internet di lokasi distribusi lemah?',
    answer:
      'Sistem mendukung mode offline. Panitia tetap dapat scan kupon meskipun sinyal lemah, dan data akan otomatis sinkron ketika koneksi internet kembali stabil. Tidak ada risiko data hilang atau distribusi terganggu.',
  },
  {
    question: 'Apakah saya bisa export data penerima dan laporan?',
    answer:
      'Bisa. Anda dapat export data penerima ke Excel/CSV untuk kepentingan administrasi, dan export laporan distribusi ke PDF untuk pelaporan kepada donatur, dewan kemakmuran masjid, atau pihak terkait. Fitur ini tersedia di semua paket berbayar.',
  },
  {
    question: 'Bagaimana cara berlangganan paket berbayar?',
    answer:
      'Setelah memilih paket, Anda akan diarahkan ke halaman pembayaran Midtrans. Tersedia banyak metode: transfer bank (BCA, BNI, BRI, Mandiri, Permata via Virtual Account), kartu kredit/debit, GoPay, ShopeePay, dan QRIS. Setelah pembayaran berhasil, paket Anda otomatis aktif dalam beberapa detik.',
  },
  {
    question: 'Apakah ada support kalau bingung pakai?',
    answer:
      'Tentu. Kami menyediakan dokumentasi lengkap, panduan video, dan tim support yang siap membantu. Paket Professional ke atas mendapatkan Priority Support dengan respon dalam 2 jam kerja. Untuk pertanyaan umum, hubungi kami via WhatsApp atau email yang tertera di footer halaman.',
  },
];
