export interface Article {
  slug: string;
  title: string;
  description: string;
  /** Cover image URL — optional. Kalau kosong, pakai gradient default */
  coverImage?: string;
  /** Tanggal publikasi format YYYY-MM-DD */
  publishedAt: string;
  /** Estimasi waktu baca dalam menit */
  readMinutes: number;
  /** Kategori untuk grouping di blog index */
  category: string;
  /** Nama penulis */
  author: string;
  /** Tag SEO/keyword */
  tags: string[];
  /** Konten artikel dalam bentuk array section (heading + paragraf) */
  content: ArticleSection[];
}

export type ArticleSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string; cite?: string };

export const ARTICLES: Article[] = [
  // ───────────────────────── Artikel 1 ─────────────────────────
  {
    slug: 'panduan-distribusi-daging-kurban-modern-era-digital',
    title:
      'Panduan Lengkap Distribusi Daging Kurban Modern di Era Digital',
    description:
      'Pelajari cara mengelola distribusi daging kurban secara efisien, transparan, dan tepat sasaran menggunakan sistem digital. Dari pendataan penerima hingga laporan akhir.',
    publishedAt: '2026-05-01',
    readMinutes: 8,
    category: 'Panduan',
    author: 'Tim Tawzii Digital',
    tags: ['distribusi kurban', 'digital', 'panduan masjid', 'qurban modern'],
    content: [
      {
        type: 'paragraph',
        text: 'Setiap tahun, ribuan masjid dan mushola di Indonesia melaksanakan ibadah kurban. Tantangan terbesar bukan pada penyembelihan — tapi pada distribusi. Bagaimana memastikan daging sampai ke tangan yang tepat? Bagaimana mencegah satu penerima dapat dua kali sementara yang lain tidak kebagian? Bagaimana melaporkan secara transparan kepada donatur?',
      },
      {
        type: 'paragraph',
        text: 'Era digital memberikan jawaban. Sistem distribusi berbasis kupon QR + database digital telah terbukti meningkatkan akurasi, mempercepat antrian, dan menyediakan audit trail yang lengkap. Artikel ini akan membahas langkah demi langkah cara mengelola distribusi kurban modern.',
      },
      {
        type: 'heading',
        text: '1. Pendataan Penerima yang Akurat',
      },
      {
        type: 'paragraph',
        text: 'Langkah pertama adalah memiliki daftar penerima yang valid. Tradisi membagikan kupon manual di kertas seringkali berakhir dengan duplikasi atau kupon palsu. Solusinya:',
      },
      {
        type: 'list',
        items: [
          'Kumpulkan data penerima dari RT/RW setempat — minimal Nama, NIK (opsional), Alamat, dan Jumlah Anggota Keluarga',
          'Verifikasi via kunjungan langsung atau melalui Ketua RT untuk mencegah data fiktif',
          'Input data ke sistem digital, atau import dari Excel — kategorikan berdasarkan dusun/blok',
        ],
      },
      {
        type: 'heading',
        text: '2. Generate Kupon QR yang Tidak Bisa Dipalsukan',
      },
      {
        type: 'paragraph',
        text: 'Kupon QR modern menggunakan signature HMAC-SHA256 — sebuah teknologi yang sama digunakan oleh bank untuk autentikasi transaksi. Setiap kupon punya hash unik yang tidak dapat di-screenshot lalu dicetak ulang. Sistem akan menolak kupon yang sudah pernah di-scan.',
      },
      {
        type: 'paragraph',
        text: 'Cetak kupon ini di kertas biasa A4 — bisa 6 sampai 10 kupon per lembar. Distribusikan ke penerima 1-2 hari sebelum Hari H. Penerima cukup membawa potongan kertas berisi QR code mereka ke lokasi distribusi.',
      },
      {
        type: 'heading',
        text: '3. Scan di Lokasi Distribusi',
      },
      {
        type: 'paragraph',
        text: 'Di hari distribusi, panitia berdiri di pintu masuk lokasi dengan HP. Setiap penerima yang datang menunjukkan kupon — panitia scan dengan kamera HP, sistem cek validitas, lalu daging diberikan. Proses scan ke konfirmasi hanya butuh 2-3 detik per orang.',
      },
      {
        type: 'paragraph',
        text: 'Kalau jaringan internet lemah (sering terjadi di lokasi distribusi di pelosok), sistem yang baik mendukung mode offline — data scan tersimpan lokal di HP panitia dan otomatis sinkron saat sinyal kembali. Tidak ada data hilang.',
      },
      {
        type: 'heading',
        text: '4. Laporan Real-Time untuk Donatur dan DKM',
      },
      {
        type: 'paragraph',
        text: 'Inilah keunggulan terbesar sistem digital: laporan otomatis. Saat panitia masih scan kupon di lokasi, dashboard sudah menampilkan progress real-time. Dewan Kemakmuran Masjid (DKM) dan donatur dapat memantau berapa banyak penerima yang sudah diklaim, mana yang belum, dan distribusi per lokasi.',
      },
      {
        type: 'paragraph',
        text: 'Setelah selesai, sistem generate laporan PDF yang siap dikirim ke donatur. Laporan ini berisi: total hewan, total penerima, distribusi per lokasi, dan timestamp setiap transaksi. Transparansi semacam ini meningkatkan kepercayaan donatur, dan biasanya berdampak pada peningkatan jumlah hewan kurban tahun berikutnya.',
      },
      {
        type: 'quote',
        text: 'Tahun lalu masjid kami sering kekurangan daging karena ada beberapa keluarga yang ambil 2-3 kali. Setelah pakai kupon QR, distribusi jadi merata dan ada laporan untuk donatur.',
        cite: 'DKM Masjid Al-Falah, Sleman',
      },
      {
        type: 'heading',
        text: '5. Checklist Persiapan H-7',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Finalisasi data penerima (H-14)',
          'Pilih platform distribusi digital + register akun (H-10)',
          'Input data penerima ke sistem (H-7)',
          'Generate dan cetak kupon QR (H-5)',
          'Distribusikan kupon ke penerima via RT/Ketua dusun (H-3 sampai H-1)',
          'Briefing tim panitia tentang cara scan (H-1)',
          'Hari H: jalankan distribusi, monitor dashboard real-time',
          'H+1: generate dan kirim laporan ke donatur',
        ],
      },
      {
        type: 'heading',
        text: 'Penutup',
      },
      {
        type: 'paragraph',
        text: 'Distribusi kurban modern bukan berarti meninggalkan nilai gotong-royong dan kearifan lokal. Sistem digital justru memperkuat aspek-aspek itu — panitia jadi lebih sedikit ribet di lapangan dan punya lebih banyak waktu untuk berinteraksi langsung dengan penerima. Donatur lebih percaya karena ada laporan transparan. Penerima lebih nyaman karena tidak perlu antri lama.',
      },
      {
        type: 'paragraph',
        text: 'Tawzii Digital hadir untuk memudahkan transisi ini. Mulai gratis selama 3 hari, tanpa kartu kredit, tanpa komitmen. Coba sekarang dan rasakan perbedaannya.',
      },
    ],
  },

  // ───────────────────────── Artikel 2 ─────────────────────────
  {
    slug: '5-tantangan-panitia-kurban-masjid-dan-solusinya',
    title: '5 Tantangan Panitia Kurban Masjid (dan Solusi Praktisnya)',
    description:
      'Panitia kurban masjid menghadapi tantangan yang berulang setiap tahun. Berikut 5 masalah paling umum dan solusi praktis yang sudah terbukti.',
    publishedAt: '2026-05-05',
    readMinutes: 6,
    category: 'Tips',
    author: 'Tim Tawzii Digital',
    tags: ['panitia kurban', 'masjid', 'tantangan', 'solusi'],
    content: [
      {
        type: 'paragraph',
        text: 'Setelah ngobrol dengan puluhan panitia kurban dari berbagai masjid di Jabodetabek dan Yogyakarta, ada pola tantangan yang sama dihadapi setiap tahun. Berikut 5 yang paling sering — dan solusi yang sudah terbukti efektif di lapangan.',
      },

      { type: 'heading', text: 'Tantangan 1: Distribusi Tidak Merata' },
      {
        type: 'paragraph',
        text: 'Klasik. Ada penerima yang dapat 2-3 kantong karena datang ke titik distribusi berbeda. Sementara di RT lain, ada warga yang tidak kebagian sama sekali. Akhirnya panitia dapat komplain di group WA RW.',
      },
      {
        type: 'paragraph',
        text: 'Solusi: pakai kupon dengan ID unik (entah manual atau digital). Setiap penerima cuma punya 1 kupon. Sistem digital lebih kuat karena kupon QR tidak bisa di-fotocopy lalu diklaim 2 kali — sementara kupon kertas konvensional rentan dipalsukan.',
      },

      { type: 'heading', text: 'Tantangan 2: Antrian Panjang di Lokasi' },
      {
        type: 'paragraph',
        text: 'Distribusi manual butuh waktu — periksa nama di daftar kertas, coret nama, lalu kasih daging. Per orang bisa 30-60 detik. Kalau penerima 500 orang, antrian bisa 2-3 jam, panas-panasan.',
      },
      {
        type: 'paragraph',
        text: 'Solusi: scan QR cuma 2-3 detik per orang. Kalau pakai 2-3 panitia paralel, distribusi 500 orang selesai dalam 30 menit. Penerima senang, panitia tidak kelelahan.',
      },

      { type: 'heading', text: 'Tantangan 3: Pelaporan ke Donatur Repot' },
      {
        type: 'paragraph',
        text: 'Setelah distribusi, donatur biasanya tanya: "Hewan saya didistribusi ke berapa orang? Foto-fotonya mana?" Panitia harus rekap manual dari daftar centangan kertas, hitung, susun foto, baru jadi laporan. Butuh beberapa hari.',
      },
      {
        type: 'paragraph',
        text: 'Solusi: sistem digital generate laporan PDF otomatis setelah distribusi selesai. Total penerima, distribusi per lokasi, timestamp — semua dalam satu dokumen. Kirim ke donatur via WhatsApp dalam hitungan menit. Donatur senang, kepercayaan naik.',
      },

      { type: 'heading', text: 'Tantangan 4: Sinyal Lemah di Lokasi Distribusi' },
      {
        type: 'paragraph',
        text: 'Banyak lokasi distribusi di area outdoor (lapangan, sawah, halaman masjid pinggir desa) yang sinyal HP-nya lemah. Sistem online murni jadi tidak reliable.',
      },
      {
        type: 'paragraph',
        text: 'Solusi: pilih platform yang support offline mode. Tawzii Digital sudah menerapkan ini — panitia tetap bisa scan kupon meskipun tidak ada sinyal, data tersimpan lokal di HP, lalu auto-sync ketika kembali ke area sinyal. Tidak ada data hilang.',
      },

      { type: 'heading', text: 'Tantangan 5: Panitia Baru Setiap Tahun' },
      {
        type: 'paragraph',
        text: 'Pengurus DKM dan panitia kurban sering berganti tiap 1-2 tahun. Akibatnya knowledge transfer tidak optimal — sistem yang dipakai tahun lalu tidak terdokumentasi, panitia baru harus mulai dari nol.',
      },
      {
        type: 'paragraph',
        text: 'Solusi: pakai platform SaaS yang punya dokumentasi, video tutorial, dan tim support yang konsisten. Panitia baru tinggal login, baca panduan singkat, sudah bisa langsung pakai. Histori distribusi tahun-tahun sebelumnya juga tersimpan di database, jadi mudah review pola distribusi.',
      },

      { type: 'heading', text: 'Penutup' },
      {
        type: 'paragraph',
        text: 'Tantangan-tantangan ini bukan tantangan masjid Anda sendiri — hampir semua panitia menghadapi yang sama. Yang membedakan adalah panitia yang sudah migrasi ke sistem digital sudah tidak lagi pusing dengan 4 dari 5 tantangan di atas.',
      },
      {
        type: 'paragraph',
        text: 'Mulai migrasi tahun ini. Coba Tawzii Digital gratis 3 hari untuk lihat sendiri perbedaannya. Tidak ada komitmen, tidak butuh kartu kredit untuk daftar.',
      },
    ],
  },

  // ───────────────────────── Artikel 3 ─────────────────────────
  {
    slug: 'distribusi-kurban-digital-sah-menurut-syariat',
    title:
      'Apakah Distribusi Kurban dengan Kupon Digital Sah Menurut Syariat? Penjelasan Lengkap',
    description:
      'Pertanyaan yang sering muncul: apakah distribusi daging kurban menggunakan kupon QR/digital tetap sah secara syariat? Berikut penjelasan berdasarkan fiqih klasik dan kontemporer.',
    publishedAt: '2026-05-10',
    readMinutes: 7,
    category: 'Edukasi',
    author: 'Tim Tawzii Digital',
    tags: ['hukum kurban', 'syariat', 'fiqih kurban', 'distribusi digital'],
    content: [
      {
        type: 'paragraph',
        text: 'Pertanyaan ini cukup sering muncul dari DKM masjid yang ingin migrasi ke sistem digital: "Apakah distribusi pakai kupon QR tetap sah? Tidak melanggar syariat?" Jawaban singkatnya: tetap sah. Tapi mari kita uraikan secara fiqih supaya jelas.',
      },

      { type: 'heading', text: 'Apa yang Menjadi Syarat Sah Kurban?' },
      {
        type: 'paragraph',
        text: 'Dalam fiqih klasik, syarat sah kurban berkaitan dengan empat hal utama:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Niat — pelaksana kurban berniat ibadah karena Allah',
          'Hewan kurban memenuhi syarat (cukup umur, sehat, tidak cacat fatal)',
          'Tata cara penyembelihan sesuai syariat (menyebut nama Allah, menggunakan alat tajam, memotong tiga saluran utama)',
          'Waktu pelaksanaan dalam rentang yang ditentukan (setelah shalat Idul Adha sampai tenggelam matahari 13 Dzulhijjah)',
        ],
      },
      {
        type: 'paragraph',
        text: 'Distribusi daging — baik manual maupun dengan bantuan teknologi — tidak masuk dalam syarat sah kurban itu sendiri. Distribusi adalah konsekuensi pasca-ibadah, bagian dari etika berbagi yang dianjurkan, tapi tidak menentukan keabsahan kurban.',
      },

      { type: 'heading', text: 'Sunnah Pembagian Daging Kurban' },
      {
        type: 'paragraph',
        text: 'Mayoritas ulama sepakat sunnah pembagian daging kurban dibagi tiga: 1/3 untuk keluarga pelaksana, 1/3 untuk teman/kerabat, dan 1/3 untuk fakir miskin. Tapi pembagian ini bersifat anjuran, bukan kewajiban mutlak. Pelaksana boleh mengambil sebagian atau bahkan tidak mengambil sama sekali.',
      },
      {
        type: 'paragraph',
        text: 'Cara teknis pembagian — apakah dibagi langsung di lokasi, dititipkan ke amil, atau menggunakan sistem kupon — semuanya boleh. Yang penting:',
      },
      {
        type: 'list',
        items: [
          'Daging benar-benar sampai ke yang berhak (tidak diserobot, tidak dijual)',
          'Tidak ada unsur kezaliman dalam distribusi (misalnya satu dapat banyak, yang lain tidak dapat)',
          'Pelaksana tidak menjual daging kurbannya (haram menjual daging kurban dari sisi pelaksana)',
        ],
      },

      { type: 'heading', text: 'Mengapa Kupon Digital Justru Lebih Sesuai Spirit Kurban?' },
      {
        type: 'paragraph',
        text: 'Spirit kurban adalah keadilan distribusi — agar daging sampai merata ke yang berhak. Sistem kupon QR justru lebih mendukung spirit ini dibanding sistem manual:',
      },
      {
        type: 'list',
        items: [
          'Mencegah duplikasi — satu keluarga tidak bisa klaim 2x. Daging tidak terkonsentrasi di sebagian pihak',
          'Audit trail lengkap — setiap distribusi tercatat dengan waktu dan lokasi. Transparansi kepada Allah (sebagai bukti amanah) dan kepada donatur',
          'Efisiensi — antrian lebih cepat, penerima tidak kepanasan menunggu, terutama untuk lansia dan anak-anak',
          'Akurasi penerima — sistem pencatatan digital memastikan data penerima tidak hilang atau tercampur seperti kertas yang sobek atau hilang',
        ],
      },

      { type: 'heading', text: 'Fatwa dan Pandangan Ulama Kontemporer' },
      {
        type: 'paragraph',
        text: 'Majelis Ulama Indonesia (MUI) dan Lembaga Bahtsul Masail Nahdlatul Ulama secara umum membolehkan inovasi teknologi dalam pelaksanaan ibadah, selama tidak mengubah esensi syariat. Penggunaan kupon QR untuk distribusi termasuk dalam kategori inovasi administratif — bukan inovasi yang mengubah rukun atau syarat ibadah.',
      },
      {
        type: 'paragraph',
        text: 'Beberapa lembaga zakat dan kurban besar di Indonesia (Dompet Dhuafa, BAZNAS, Rumah Zakat, ACT) sudah lama menggunakan sistem digital baik untuk pendataan donatur maupun distribusi penerima — dan tidak ada keberatan secara fiqih atas praktik ini.',
      },

      {
        type: 'quote',
        text: 'Inovasi dalam mu`amalah hukumnya boleh selama tidak melanggar nash. Pencatatan dan pendistribusian kurban dengan sistem digital tidak melanggar nash apapun, justru mendukung tertib administrasi yang dianjurkan dalam Islam.',
        cite: 'Adaptasi dari kaidah fiqih kontemporer',
      },

      { type: 'heading', text: 'Kesimpulan' },
      {
        type: 'paragraph',
        text: 'Distribusi daging kurban menggunakan kupon QR/digital sah secara syariat, dan justru lebih mendukung spirit kurban berupa keadilan distribusi dan transparansi. Yang penting adalah niat panitia tetap lillahi ta`ala, daging sampai ke yang berhak, dan tidak ada pelanggaran etika lain.',
      },
      {
        type: 'paragraph',
        text: 'Bagi masjid yang masih ragu, mulai saja dari skala kecil — coba sistem digital untuk distribusi 50-100 penerima dulu. Rasakan kemudahannya. Tahun berikutnya skala bisa diperbesar dengan keyakinan yang sudah teruji.',
      },
    ],
  },
];

export const ARTICLES_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a])
);
