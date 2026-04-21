import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
};

export default function KebijakanPrivasiPage() {
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

        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <div className="mb-10 border-b border-[#eceef0] pb-8">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#004532]">Dokumen Hukum</p>
            <h1 className="font-headline text-4xl font-extrabold text-[#191c1e]">Kebijakan Privasi</h1>
            <p className="mt-3 text-sm text-[#3f4944]/60">Terakhir diperbarui: 1 Januari 2025</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-[#3f4944]">

            <Section title="1. Pendahuluan">
              <p>
                Tawzii Digital ("kami", "kita", atau "Platform") yang dikelola oleh adilabs.id berkomitmen untuk
                melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
                menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
              </p>
              <p>
                Dengan mendaftar dan menggunakan Platform Tawzii Digital, Anda menyetujui pengumpulan dan
                penggunaan informasi sesuai dengan kebijakan ini.
              </p>
            </Section>

            <Section title="2. Informasi yang Kami Kumpulkan">
              <p>Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan kami:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Data Identitas:</strong> Nama, alamat email, nomor telepon administrator masjid.</li>
                <li><strong>Data Organisasi:</strong> Nama masjid atau lembaga, alamat, dan informasi kontak resmi.</li>
                <li><strong>Data Penerima (Mustahik):</strong> Nama, alamat, dan data distribusi yang dikelola oleh pengurus masjid.</li>
                <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, perangkat yang digunakan, dan log aktivitas.</li>
                <li><strong>Data Pembayaran:</strong> Informasi transaksi langganan melalui Midtrans (kami tidak menyimpan data kartu kredit).</li>
              </ul>
            </Section>

            <Section title="3. Cara Kami Menggunakan Informasi">
              <p>Informasi yang dikumpulkan digunakan untuk:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Menyediakan dan mengelola akun Platform Tawzii Digital.</li>
                <li>Memproses distribusi kupon dan manajemen data penerima.</li>
                <li>Mengirimkan notifikasi layanan, pembaruan, dan informasi teknis.</li>
                <li>Memproses pembayaran langganan.</li>
                <li>Meningkatkan keamanan dan performa platform.</li>
                <li>Memenuhi kewajiban hukum yang berlaku.</li>
              </ul>
            </Section>

            <Section title="4. Penyimpanan dan Keamanan Data">
              <p>
                Data disimpan pada server yang berlokasi di Indonesia dengan standar keamanan tinggi. Kami
                menerapkan enkripsi SSL/TLS untuk semua transmisi data, enkripsi data sensitif di database,
                serta pembatasan akses berdasarkan peran pengguna.
              </p>
              <p>
                Meski kami berupaya melindungi data Anda semaksimal mungkin, tidak ada sistem keamanan yang
                sepenuhnya kebal. Kami mendorong pengguna untuk menjaga kerahasiaan kata sandi akun.
              </p>
            </Section>

            <Section title="5. Berbagi Data dengan Pihak Ketiga">
              <p>Kami tidak menjual data pribadi Anda. Data dapat dibagikan kepada:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Midtrans</strong> – untuk pemrosesan pembayaran.</li>
                <li><strong>Penyedia infrastruktur cloud</strong> – untuk hosting dan penyimpanan data.</li>
                <li><strong>Pihak berwenang</strong> – jika diwajibkan oleh hukum Indonesia yang berlaku.</li>
              </ul>
            </Section>

            <Section title="6. Hak Pengguna">
              <p>Sebagai pengguna, Anda berhak untuk:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Mengakses dan memperbaiki data pribadi Anda.</li>
                <li>Meminta penghapusan akun dan data terkait.</li>
                <li>Mengajukan keberatan atas pemrosesan data tertentu.</li>
                <li>Menerima salinan data Anda dalam format yang dapat dibaca mesin.</li>
              </ul>
              <p>Untuk mengajukan permintaan, hubungi kami di <strong>administrator@adilabs.id</strong>.</p>
            </Section>

            <Section title="7. Retensi Data">
              <p>
                Data akun disimpan selama akun aktif. Setelah penghapusan akun, data akan dihapus permanen
                dalam 30 hari, kecuali diwajibkan untuk disimpan lebih lama oleh peraturan perundang-undangan.
              </p>
            </Section>

            <Section title="8. Perubahan Kebijakan">
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan signifikan akan
                diberitahukan melalui email atau notifikasi di dalam platform minimal 14 hari sebelum berlaku.
              </p>
            </Section>

            <Section title="9. Hubungi Kami">
              <p>
                Pertanyaan terkait kebijakan privasi dapat dikirim ke:<br />
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
