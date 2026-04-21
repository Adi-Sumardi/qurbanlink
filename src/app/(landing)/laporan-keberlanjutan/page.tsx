import Link from 'next/link';
import { ArrowLeft, Leaf, Users, Heart, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laporan Keberlanjutan',
};

const stats = [
  { label: 'Masjid Aktif', value: '250+', icon: Heart, color: 'bg-[#a6f2d1] text-[#004532]' },
  { label: 'Penerima Terbantu', value: '120.000+', icon: Users, color: 'bg-[#ffdad6] text-[#652925]' },
  { label: 'Hewan Dikelola', value: '12.450+', icon: Leaf, color: 'bg-[#8bd6b6] text-[#004532]' },
  { label: 'Kupon Digital Terbit', value: '85.000+', icon: TrendingUp, color: 'bg-[#e8eaff] text-[#3730a3]' },
];

export default function LaporanKeberlanjutanPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="border-b border-[#eceef0] bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Tawzii Digital" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-headline text-sm font-extrabold text-[#004532]">Tawzii Digital</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#3f4944] hover:text-[#004532] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>

        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-[#004532] px-10 py-12 text-white">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#6ffbbe]">Komitmen Kami</p>
          <h1 className="font-headline text-4xl font-extrabold">Laporan Keberlanjutan</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Tawzii Digital berkomitmen menjalankan bisnis yang bertanggung jawab secara sosial, lingkungan,
            dan ekonomi. Laporan ini merangkum dampak positif yang telah kami ciptakan bersama komunitas
            masjid seluruh Indonesia.
          </p>
          <p className="mt-4 text-sm text-white/40">Periode: Januari – Desember 2024</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="size-5" />
              </div>
              <p className="font-headline text-2xl font-extrabold text-[#191c1e]">{s.value}</p>
              <p className="mt-1 text-xs text-[#3f4944]/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <div className="space-y-10 text-[#3f4944]">

            <Section title="1. Tentang Laporan Ini">
              <p>
                Laporan Keberlanjutan Tawzii Digital disusun untuk memberikan gambaran transparan mengenai
                dampak sosial, ekonomi, dan lingkungan dari operasional platform kami. Laporan ini diterbitkan
                secara tahunan dan mengacu pada prinsip-prinsip pelaporan keberlanjutan yang berlaku.
              </p>
            </Section>

            <Section title="2. Dampak Sosial">
              <p>
                Misi utama Tawzii Digital adalah memastikan distribusi daging kurban berlangsung secara
                adil, tepat sasaran, dan bermartabat. Dampak sosial yang telah kami capai:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Pengurangan Ketidakmerataan:</strong> Sistem manajemen mustahik kami membantu
                  masjid mengidentifikasi penerima yang benar-benar membutuhkan, mengurangi duplikasi
                  dan kecurangan distribusi hingga estimasi 40%.
                </li>
                <li>
                  <strong>Efisiensi Waktu Panitia:</strong> Rata-rata waktu registrasi dan verifikasi
                  penerima berkurang dari 3 jam menjadi 30 menit per sesi distribusi.
                </li>
                <li>
                  <strong>Pemberdayaan Masjid Kecil:</strong> Paket gratis kami memungkinkan masjid
                  dengan anggaran terbatas mengakses teknologi distribusi yang sama dengan masjid besar.
                </li>
                <li>
                  <strong>Transparansi kepada Donatur:</strong> Fitur live dashboard memberikan donatur
                  visibilitas penuh atas perjalanan kurban mereka, meningkatkan kepercayaan dan donasi
                  berulang.
                </li>
              </ul>
            </Section>

            <Section title="3. Dampak Lingkungan">
              <p>
                Kami berkomitmen meminimalkan jejak lingkungan dari operasional digital kami:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Pengurangan Kertas:</strong> Kupon digital menggantikan kupon kertas tradisional,
                  mengestimasi pengurangan penggunaan kertas sebesar 85.000+ lembar per tahun.
                </li>
                <li>
                  <strong>Infrastruktur Hijau:</strong> Server kami menggunakan layanan cloud yang
                  berkomitmen pada penggunaan energi terbarukan minimal 50%.
                </li>
                <li>
                  <strong>Optimasi Rute:</strong> Fitur manajemen distribusi kami membantu panitia
                  merencanakan rute pengiriman yang lebih efisien, mengurangi emisi kendaraan.
                </li>
              </ul>
            </Section>

            <Section title="4. Tata Kelola dan Etika">
              <p>
                Kami menjalankan bisnis dengan standar tata kelola yang tinggi:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Keamanan Data:</strong> Seluruh data pengguna dilindungi dengan enkripsi
                  end-to-end dan disimpan di server yang berlokasi di Indonesia.
                </li>
                <li>
                  <strong>Harga Transparan:</strong> Tidak ada biaya tersembunyi. Seluruh harga
                  langganan tercantum jelas di halaman pricing kami.
                </li>
                <li>
                  <strong>Tidak Menjual Data:</strong> Kami tidak pernah menjual atau membagikan
                  data pengguna kepada pihak ketiga untuk tujuan komersial.
                </li>
                <li>
                  <strong>Aksesibilitas:</strong> Platform dirancang responsif dan dapat diakses
                  dari berbagai perangkat termasuk ponsel dengan spesifikasi rendah.
                </li>
              </ul>
            </Section>

            <Section title="5. Kontribusi pada Tujuan Pembangunan Berkelanjutan (SDGs)">
              <p>Aktivitas Tawzii Digital berkontribusi pada beberapa SDGs PBB:</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  { sdg: 'SDG 1', title: 'Tanpa Kemiskinan', desc: 'Memastikan distribusi daging kurban menjangkau masyarakat yang paling membutuhkan.' },
                  { sdg: 'SDG 2', title: 'Tanpa Kelaparan', desc: 'Meningkatkan akses pangan protein hewani bagi keluarga kurang mampu.' },
                  { sdg: 'SDG 10', title: 'Berkurangnya Kesenjangan', desc: 'Teknologi digital yang meratakan akses manfaat kurban tanpa diskriminasi.' },
                  { sdg: 'SDG 16', title: 'Perdamaian & Keadilan', desc: 'Sistem transparan yang mencegah korupsi dan ketidakadilan distribusi.' },
                ].map((item) => (
                  <div key={item.sdg} className="rounded-xl border border-[#eceef0] p-4">
                    <span className="text-xs font-black uppercase tracking-widest text-[#004532]">{item.sdg}</span>
                    <p className="mt-1 font-headline font-bold text-[#191c1e]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#3f4944]/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. Target 2025">
              <ul className="list-disc space-y-2 pl-6">
                <li>Menjangkau 500 masjid aktif di seluruh Indonesia.</li>
                <li>Membantu distribusi kepada 250.000+ penerima manfaat.</li>
                <li>Mengurangi penggunaan kertas sebesar 150.000+ lembar.</li>
                <li>Meluncurkan fitur pelaporan dampak sosial otomatis untuk setiap masjid.</li>
                <li>Kemitraan dengan 5 lembaga amil zakat nasional.</li>
              </ul>
            </Section>

            <Section title="7. Hubungi Kami">
              <p>
                Pertanyaan terkait laporan ini dapat dikirim ke:<br />
                <strong>Email:</strong> administrator@adilabs.id<br />
                <strong>Website:</strong> adilabs.id
              </p>
            </Section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-headline text-lg font-extrabold text-[#191c1e]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#eceef0] bg-white py-8">
      <div className="mx-auto max-w-4xl px-6 text-center text-xs text-[#3f4944]/50">
        © {new Date().getFullYear()} adilabs.id. Seluruh hak dilindungi.
      </div>
    </footer>
  );
}
