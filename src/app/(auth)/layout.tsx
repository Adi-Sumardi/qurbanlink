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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ffbbe]/30 bg-[#6ffbbe]/10 px-4 py-2">
              <div className="flex size-5 items-center justify-center rounded-md bg-[#6ffbbe]">
                <svg viewBox="0 0 24 24" className="size-3 fill-[#002113]">
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/>
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#6ffbbe]">
                Mesjid Digital
              </span>
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
