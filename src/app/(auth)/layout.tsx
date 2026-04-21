export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fb]">
      {/* Left Panel: Brand / Hero */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]">
        {/* Background image layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00301f] via-[#004532] to-[#065f46]" />
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #6ffbbe 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        {/* Light blobs */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-[#065f46] blur-[120px] opacity-50" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 size-80 rounded-full bg-[#006c49] blur-[100px] opacity-40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Top: Logo badge */}
          <div>
            <div className="inline-block rounded-2xl bg-white p-2 shadow-xl">
              <img src="/logo.png" alt="Tawzii Digital" className="h-14 w-14 rounded-full object-cover" />
            </div>
          </div>

          {/* Middle: Headline */}
          <div className="space-y-8">
            <h1 className="font-headline text-5xl font-extrabold leading-tight text-white xl:text-6xl">
              Martabat di Setiap
              <br />
              <span className="text-[#6ffbbe]">Ibadah Kurban.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-white/60">
              Membantu Pengurus Masjid mengelola distribusi daging kurban dengan
              sistem yang tepat, transparan, dan mudah digunakan.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: '📦',
                  title: 'Manajemen Kupon',
                  desc: 'Kelola dan distribusikan kupon kurban secara digital.',
                },
                {
                  icon: '👥',
                  title: 'Data Penerima',
                  desc: 'Verifikasi penerima dan alokasi bagian secara akurat.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <span className="mb-3 block text-2xl">{f.icon}</span>
                  <p className="font-headline font-bold text-white">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Footer info */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/30">
            <span>Tawzii Digital by adilabs.id</span>
            <span>Mesjid Digital</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
        {/* Form container */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-[#3f4944]/40">
          Platform Distribusi Kurban Digital
        </p>
      </div>
    </div>
  );
}
