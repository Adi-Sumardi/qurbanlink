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

  // ───────────────────────── Artikel 4 ─────────────────────────
  {
    slug: 'cara-membagi-zona-distribusi-kurban-adil-rt-rw',
    title:
      'Cara Membagi Zona Distribusi Kurban yang Adil per RT/RW (Panduan Praktis)',
    description:
      'Distribusi yang merata dimulai dari pembagian zona yang tepat. Panduan praktis menentukan kuota per RT/RW, kriteria penerima, dan strategi agar tidak ada wilayah yang terlewat.',
    publishedAt: '2026-05-10',
    readMinutes: 7,
    category: 'Panduan',
    author: 'Tim Tawzii Digital',
    tags: [
      'zona distribusi',
      'kuota RT RW',
      'pembagian adil',
      'panitia masjid',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Salah satu sumber konflik klasik panitia kurban: "Kenapa RT 03 dapat banyak, RT 05 cuma sedikit?" Pembagian zona yang tidak terencana membuat distribusi terkesan pilih kasih, padahal niat panitia sudah benar. Artikel ini membahas cara membagi zona distribusi yang adil dan bisa dipertanggungjawabkan.',
      },

      { type: 'heading', text: 'Kenapa Perlu Zonasi?' },
      {
        type: 'paragraph',
        text: 'Tanpa zonasi, kupon cenderung beredar di lingkungan dekat masjid saja. Warga RT yang lebih jauh — meskipun secara ekonomi lebih membutuhkan — sering tidak kebagian karena akses informasi yang lebih lambat. Zonasi memastikan tiap wilayah punya jatah proporsional.',
      },
      {
        type: 'paragraph',
        text: 'Manfaat lain: panitia bisa memetakan kebutuhan secara visual, mendeteksi RT yang under-served, dan mengantisipasi kepadatan antrian dengan menjadwalkan slot pengambilan berbeda per zona.',
      },

      { type: 'heading', text: 'Langkah 1: Petakan Wilayah Cakupan' },
      {
        type: 'paragraph',
        text: 'Mulai dari daftar RT/RW yang masuk jamaah masjid. Idealnya gunakan radius 1-2 km dari masjid sebagai cakupan utama, dengan opsi memperluas ke RT tetangga yang banyak dhuafa. Catat jumlah KK per RT — data ini biasanya tersedia di ketua RT.',
      },

      { type: 'heading', text: 'Langkah 2: Tentukan Kriteria Penerima' },
      {
        type: 'paragraph',
        text: 'Sepakati di rapat panitia: siapa yang berhak dapat kupon? Beberapa kriteria yang umum dipakai:',
      },
      {
        type: 'list',
        items: [
          'Fakir & miskin (penerima utama secara syariat).',
          'Lansia tanpa penghasilan tetap.',
          'Janda/duda dengan tanggungan.',
          'Keluarga difabel atau sakit kronis.',
          'Jamaah aktif masjid (sebagai bentuk silaturahmi, bukan prioritas).',
        ],
      },
      {
        type: 'paragraph',
        text: 'Dokumentasikan kriteria ini secara tertulis — kalau ada warga komplain, panitia punya dasar yang jelas.',
      },

      { type: 'heading', text: 'Langkah 3: Hitung Kuota per Zona' },
      {
        type: 'paragraph',
        text: 'Rumus sederhana: (jumlah dhuafa di zona / total dhuafa keseluruhan) × total kupon. Misal total kupon 600, RT 01 punya 40 dhuafa dari 200 total dhuafa, maka kuota RT 01 = (40/200) × 600 = 120 kupon.',
      },
      {
        type: 'paragraph',
        text: 'Kalau data dhuafa tidak akurat, pakai pendekatan proporsional terhadap jumlah KK miskin (data dari kelurahan). Yang penting kuota terdokumentasi sebelum kupon dicetak.',
      },

      { type: 'heading', text: 'Langkah 4: Koordinasi dengan Ketua RT' },
      {
        type: 'paragraph',
        text: 'Setelah kuota dialokasikan, serahkan daftar nama penerima ke ketua RT untuk diverifikasi. Ketua RT lebih tahu kondisi warganya — siapa yang baru pindah, siapa yang sebenarnya sudah mampu, siapa yang kelewat dari pendataan awal.',
      },
      {
        type: 'paragraph',
        text: 'Tips: minta ketua RT tanda tangan di lembar daftar. Ini bukan birokrasi — ini perlindungan kalau ada warga yang merasa terlewat, panitia bisa menunjuk bahwa daftar sudah diverifikasi RT.',
      },

      { type: 'heading', text: 'Langkah 5: Distribusi Kupon Berbasis Zona' },
      {
        type: 'paragraph',
        text: 'Pakai sistem yang bisa tag kupon per zona — di Tawzii Digital, tiap kupon punya field "Zona" sehingga laporan akhir otomatis menampilkan distribusi per RT. Kalau RT 03 cuma terealisasi 60%, panitia bisa investigasi: apakah daftar penerima terlalu banyak, atau ada masalah komunikasi.',
      },

      { type: 'heading', text: 'Mitigasi Konflik' },
      {
        type: 'paragraph',
        text: 'Tetap saja, akan ada warga yang protes. Yang penting: panitia punya data, kriteria tertulis, dan tanda tangan ketua RT. Tiga hal ini cukup untuk menjawab keluhan secara profesional tanpa membuat warga merasa diserang.',
      },
      {
        type: 'quote',
        text: 'Keadilan bukan berarti semua dapat sama, tapi setiap yang berhak dapat sesuai porsinya.',
      },

      { type: 'heading', text: 'Penutup' },
      {
        type: 'paragraph',
        text: 'Zonasi yang baik dimulai dari data, dilanjutkan dengan koordinasi, dan diakhiri dengan transparansi laporan. Mulai pemetaan zona sekarang — jangan tunggu H-7 Idul Adha. Semakin awal, semakin matang distribusinya.',
      },
    ],
  },

  // ───────────────────────── Artikel 5 ─────────────────────────
  {
    slug: 'tips-mengelola-antrian-pengambilan-daging-kurban-tertib',
    title:
      'Tips Mengelola Antrian Pengambilan Daging Kurban agar Tertib dan Cepat',
    description:
      'Antrian panjang dan panas-panasan adalah pengalaman buruk yang bisa dihindari. Berikut tips praktis mengelola alur pengambilan daging kurban supaya tertib dan selesai dalam waktu singkat.',
    publishedAt: '2026-05-11',
    readMinutes: 5,
    category: 'Tips',
    author: 'Tim Tawzii Digital',
    tags: [
      'antrian kurban',
      'tips panitia',
      'distribusi cepat',
      'idul adha',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Pengalaman buruk paling sering di hari distribusi kurban: antrian mengular, warga kepanasan, dan panitia kewalahan. Dengan persiapan yang tepat, distribusi 500 penerima bisa selesai dalam 45 menit tanpa kekacauan.',
      },

      { type: 'heading', text: '1. Bagi Slot Waktu per Zona' },
      {
        type: 'paragraph',
        text: 'Jangan undang semua penerima jam 08:00. Bagi slot per zona/RT: RT 01-02 jam 08:00, RT 03-04 jam 09:00, RT 05-06 jam 10:00. Tulis slot di kupon supaya warga tahu kapan datang.',
      },
      {
        type: 'paragraph',
        text: 'Hasilnya: antrian terpecah jadi 3-4 gelombang kecil, bukan satu tsunami. Panitia bisa istirahat singkat antar gelombang.',
      },

      { type: 'heading', text: '2. Siapkan Minimal 2 Jalur Antrian' },
      {
        type: 'paragraph',
        text: 'Satu jalur untuk lansia/difabel (prioritas, tanpa antrian), satu jalur untuk umum. Kalau penerima > 300 orang, tambah jalur ketiga khusus penerima dengan kupon digital (scan dari HP, lebih cepat).',
      },

      { type: 'heading', text: '3. Setup Stasiun Scan yang Efisien' },
      {
        type: 'paragraph',
        text: 'Tiap stasiun butuh: 1 petugas pegang HP scanner, 1 petugas serahkan paket daging, 1 petugas arahkan ke jalur keluar. Pisahkan ketiganya secara fisik supaya tidak bottleneck di satu titik.',
      },
      {
        type: 'list',
        items: [
          'HP scanner sudah login & buka modul Scan sebelum jam mulai.',
          'Power bank cadangan tersedia di tiap stasiun.',
          'Paket daging sudah pre-packed dan dikelompokkan per zona.',
        ],
      },

      { type: 'heading', text: '4. Pre-Pack Paket Daging Sebelum Distribusi' },
      {
        type: 'paragraph',
        text: 'Jangan timbang & bungkus saat penerima datang — itu mimpi buruk. Pre-pack semua paket sehari sebelum atau pagi-pagi sebelum slot pertama. Tiap paket diberi label nomor urut yang match dengan kupon.',
      },

      { type: 'heading', text: '5. Sediakan Area Tunggu yang Nyaman' },
      {
        type: 'paragraph',
        text: 'Tenda + kursi + air mineral. Ini bukan kemewahan, ini empati. Warga yang merasa dihargai akan menyebar cerita positif ke tetangga — efek branding masjid yang luar biasa.',
      },

      { type: 'heading', text: '6. Brief Panitia 30 Menit Sebelum Mulai' },
      {
        type: 'paragraph',
        text: 'Kumpulkan semua panitia, jelaskan alur, tunjuk siapa pegang stasiun mana, dan tentukan PIC kalau ada masalah (kupon tidak terbaca, penerima protes, dll). Brief singkat ini memangkas separuh dari potensi kekacauan.',
      },

      { type: 'heading', text: '7. Tracking Real-Time' },
      {
        type: 'paragraph',
        text: 'Live dashboard yang menampilkan progres real-time (mis. "320/600 kupon terpakai") membantu koordinator memutuskan kapan harus stop antrian, kapan kirim petugas tambahan, dan kapan bisa istirahat.',
      },

      { type: 'heading', text: '8. Punya Plan B untuk Kupon Bermasalah' },
      {
        type: 'paragraph',
        text: 'Selalu ada kasus: kupon basah kena hujan, QR tidak terbaca, atau penerima lupa bawa kupon. Tunjuk 1 PIC khusus untuk handle kasus-kasus ini — biasanya bisa diverifikasi via nama + alamat di database, lalu kupon di-mark manual sebagai terpakai.',
      },

      { type: 'heading', text: 'Penutup' },
      {
        type: 'paragraph',
        text: 'Antrian yang tertib bukan soal disiplin warga — itu soal desain alur dari panitia. Investasikan waktu di persiapan H-1, hasilnya hari-H lebih singkat dan kepuasan semua pihak naik signifikan.',
      },
    ],
  },

  // ───────────────────────── Artikel 6 ─────────────────────────
  {
    slug: 'hukum-patungan-sapi-kurban-niat-pembagian',
    title:
      'Hukum Patungan Sapi Kurban: Ketentuan, Niat, dan Pembagian Daging',
    description:
      'Patungan sapi (7 orang) adalah praktik umum dalam kurban. Berikut penjelasan lengkap hukumnya menurut fiqih, syarat sahnya, dan cara pembagian daging yang benar.',
    publishedAt: '2026-05-12',
    readMinutes: 8,
    category: 'Edukasi',
    author: 'Tim Tawzii Digital',
    tags: [
      'patungan sapi',
      'hukum kurban',
      'fiqih kurban',
      'niat kurban',
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Sapi kurban patungan 7 orang adalah praktik yang sangat umum di Indonesia. Tapi banyak calon sohibul yang masih ragu: apakah ini sah? Bolehkah niatnya beda-beda? Bagaimana pembagian dagingnya? Artikel ini menjawab semuanya berdasarkan fiqih klasik.',
      },

      { type: 'heading', text: 'Dasar Hukumnya' },
      {
        type: 'paragraph',
        text: 'Patungan sapi atau unta untuk kurban berdasarkan hadits riwayat Muslim dari Jabir bin Abdillah RA: "Kami berkurban bersama Rasulullah SAW pada tahun Hudaibiyah, seekor unta untuk tujuh orang dan seekor sapi untuk tujuh orang." (HR. Muslim no. 1318).',
      },
      {
        type: 'paragraph',
        text: 'Hadits ini menjadi dasar bahwa 1 sapi sah untuk 7 sohibul. Kambing & domba tidak boleh patungan — 1 ekor = 1 sohibul.',
      },

      { type: 'heading', text: 'Syarat Sah Patungan' },
      {
        type: 'list',
        items: [
          'Maksimal 7 orang per ekor sapi/unta — tidak boleh lebih.',
          'Tiap peserta berniat ibadah (kurban, aqiqah yang sebagian ulama membolehkan, atau gabungan keduanya).',
          'Tidak ada peserta yang berniat untuk konsumsi murni (mis. cuma mau dapat daging).',
          'Pembayaran sudah lunas sebelum penyembelihan.',
          'Sapi memenuhi syarat: minimal 2 tahun, sehat, tidak cacat berat.',
        ],
      },

      { type: 'heading', text: 'Bolehkah Niat Tiap Peserta Berbeda?' },
      {
        type: 'paragraph',
        text: 'Mazhab Hanafi & Hambali membolehkan variasi niat selama semuanya bersifat ibadah. Misal: 5 orang kurban, 2 orang aqiqah. Mazhab Syafi`i lebih ketat — sebagian ulamanya mensyaratkan semua peserta harus niat kurban. Untuk amannya, lakukan koordinasi niat sebelum penyembelihan.',
      },
      {
        type: 'paragraph',
        text: 'Yang jelas tidak boleh: 1-2 peserta berniat sekadar "ambil dagingnya" tanpa niat ibadah apapun. Ini membatalkan keabsahan kurban untuk seluruh peserta lain dalam satu sapi.',
      },

      { type: 'heading', text: 'Pembagian Daging — 1/7 untuk Tiap Sohibul' },
      {
        type: 'paragraph',
        text: 'Setelah disembelih, daging dibagi rata 7 bagian sesuai jumlah peserta. Ini bagian "hak sohibul" — boleh dimakan, disedekahkan, atau dihadiahkan.',
      },
      {
        type: 'paragraph',
        text: 'Sunnahnya, sohibul mengambil 1/3 untuk konsumsi keluarga, 1/3 untuk dihadiahkan, dan 1/3 untuk sedekah ke fakir-miskin. Banyak masjid memilih jalan praktis: seluruh bagian sohibul didistribusikan ke penerima, dan sohibul hanya ambil simbolis 1-2 kg untuk keluarga.',
      },

      { type: 'heading', text: 'Bagaimana Cara Pembagian Praktis di Masjid?' },
      {
        type: 'paragraph',
        text: 'Setelah daging ditimbang, panitia biasanya tidak benar-benar memisahkan secara fisik 7 bagian. Yang lebih lazim: semua daging dianggap "milik bersama 7 sohibul" lalu didistribusikan ke penerima sesuai daftar zona. Hak tiap sohibul dipenuhi melalui laporan akhir: berapa kg total daging, berapa penerima, di zona mana.',
      },
      {
        type: 'paragraph',
        text: 'Sistem digital memudahkan hal ini — sohibul dapat laporan PDF berisi foto sapi, berat daging, jumlah penerima, dan rincian zona. Transparansi yang dulu butuh berhari-hari sekarang tinggal sehari.',
      },

      { type: 'heading', text: 'Bolehkah Sohibul Tidak Hadir Saat Penyembelihan?' },
      {
        type: 'paragraph',
        text: 'Boleh. Tidak ada syarat sohibul harus hadir. Yang penting niat sudah ditetapkan & pembayaran lunas. Banyak sohibul perantauan yang transfer dari luar kota — kurban tetap sah.',
      },
      {
        type: 'paragraph',
        text: 'Sunnah hadir untuk menyaksikan, tapi tidak wajib. Lebih utama panitia kirim foto/video sebagai pengganti kehadiran fisik.',
      },

      { type: 'heading', text: 'Apa yang Tidak Boleh Dilakukan?' },
      {
        type: 'list',
        items: [
          'Menjual bagian daging sohibul (tidak boleh untuk dikomersialkan).',
          'Memberi upah penyembelih dengan daging (upah harus dari kas masjid).',
          'Menjadikan kulit/kepala sebagai komoditas yang diuangkan ke sohibul.',
          'Lebih dari 7 orang dalam satu sapi.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Kulit & jeroan secara fiqih masuk hak sohibul juga — tapi kebiasaan di Indonesia, kulit didonasikan ke panitia atau lembaga sosial sebagai infaq tambahan. Ini sah selama dengan persetujuan sohibul.',
      },

      { type: 'heading', text: 'Kesimpulan' },
      {
        type: 'paragraph',
        text: 'Patungan sapi 7 orang adalah ibadah yang sah, didasarkan langsung pada sunnah Nabi SAW. Yang perlu diperhatikan: niat tiap peserta harus ibadah, pembayaran lunas sebelum penyembelihan, dan pembagian daging mengikuti adab syariat.',
      },
      {
        type: 'paragraph',
        text: 'Bagi masjid yang mengelola banyak sapi patungan, sistem digital sangat membantu — tiap sohibul punya catatan terpisah, foto hewan tersimpan, dan laporan distribusi otomatis. Transparansi inilah yang membuat ibadah kurban makin tenang dan donatur makin percaya.',
      },
    ],
  },
];

export const ARTICLES_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a])
);
