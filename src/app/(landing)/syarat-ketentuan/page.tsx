import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
};

export default function SyaratKetentuanPage() {
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
            <h1 className="font-headline text-4xl font-extrabold text-[#191c1e]">Syarat & Ketentuan</h1>
            <p className="mt-3 text-sm text-[#3f4944]/60">Terakhir diperbarui: 1 Januari 2025</p>
          </div>

          <div className="space-y-8 text-[#3f4944]">

            <Section title="1. Penerimaan Ketentuan">
              <p>
                Dengan mendaftar dan menggunakan Platform Tawzii Digital yang dikelola oleh adilabs.id,
                Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.
                Jika Anda tidak menyetujui salah satu ketentuan, harap tidak menggunakan layanan kami.
              </p>
            </Section>

            <Section title="2. Deskripsi Layanan">
              <p>
                Tawzii Digital adalah platform manajemen distribusi daging kurban berbasis digital yang
                menyediakan fitur antara lain:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Manajemen data penerima (mustahik).</li>
                <li>Penerbitan dan pemindaian kupon digital berbasis QR.</li>
                <li>Manajemen hewan kurban dan stok.</li>
                <li>Laporan distribusi dan statistik real-time.</li>
                <li>Manajemen multi-pengguna dengan sistem peran.</li>
              </ul>
            </Section>

            <Section title="3. Eligibilitas Pengguna">
              <p>
                Layanan ini ditujukan khusus untuk lembaga Islam yang sah, termasuk masjid, yayasan,
                dan organisasi keagamaan Islam yang menyelenggarakan ibadah kurban. Dengan mendaftar,
                Anda menjamin bahwa:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Organisasi Anda adalah lembaga Islam yang sah dan terdaftar.</li>
                <li>Anda berusia minimal 18 tahun dan berwenang mewakili organisasi.</li>
                <li>Informasi yang diberikan saat pendaftaran adalah benar dan akurat.</li>
              </ul>
            </Section>

            <Section title="4. Akun dan Keamanan">
              <p>
                Anda bertanggung jawab atas kerahasiaan kredensial akun dan semua aktivitas yang terjadi
                di bawah akun Anda. Segera laporkan akses tidak sah ke <strong>administrator@adilabs.id</strong>.
                Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini.
              </p>
            </Section>

            <Section title="5. Langganan dan Pembayaran">
              <p>
                Platform menawarkan paket berlangganan berbayar dan gratis. Ketentuan pembayaran:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Harga berlangganan tercantum dalam Rupiah (IDR) dan belum termasuk pajak yang berlaku.</li>
                <li>Pembayaran diproses melalui Midtrans dan bersifat non-refundable kecuali ada kesalahan teknis dari pihak kami.</li>
                <li>Paket berbayar diperbarui otomatis setiap periode kecuali dibatalkan sebelum tanggal pembaruan.</li>
                <li>Fitur downgrade ke paket lebih rendah tidak menghapus data yang sudah ada.</li>
              </ul>
            </Section>

            <Section title="6. Penggunaan yang Dilarang">
              <p>Anda dilarang menggunakan Platform untuk:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Tujuan yang melanggar hukum atau peraturan yang berlaku di Indonesia.</li>
                <li>Memasukkan data palsu, fiktif, atau menyesatkan.</li>
                <li>Menyerang, meretas, atau mencoba mendapatkan akses tidak sah ke sistem kami.</li>
                <li>Mendistribusikan konten berbahaya, spam, atau malware.</li>
                <li>Menjual kembali atau melisensi ulang layanan tanpa izin tertulis.</li>
              </ul>
            </Section>

            <Section title="7. Kepemilikan Intelektual">
              <p>
                Seluruh konten, desain, kode, dan merek dagang pada Platform Tawzii Digital adalah milik
                adilabs.id dan dilindungi hukum hak kekayaan intelektual Indonesia. Data yang Anda masukkan
                tetap menjadi milik organisasi Anda.
              </p>
            </Section>

            <Section title="8. Batasan Tanggung Jawab">
              <p>
                Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial
                yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan. Tanggung jawab kami
                terbatas pada nilai langganan yang telah Anda bayarkan dalam tiga bulan terakhir.
              </p>
            </Section>

            <Section title="9. Penghentian Layanan">
              <p>
                Kami berhak menghentikan atau menangguhkan akses ke layanan dengan pemberitahuan 30 hari
                sebelumnya, kecuali dalam kasus pelanggaran berat yang memerlukan tindakan segera.
                Pengguna dapat mengakhiri langganan kapan saja melalui pengaturan akun.
              </p>
            </Section>

            <Section title="10. Hukum yang Berlaku">
              <p>
                Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul
                akan diselesaikan melalui musyawarah mufakat terlebih dahulu, dan jika tidak tercapai,
                melalui Pengadilan Negeri Jakarta Selatan.
              </p>
            </Section>

            <Section title="11. Hubungi Kami">
              <p>
                Pertanyaan terkait Syarat & Ketentuan dapat dikirim ke:<br />
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
