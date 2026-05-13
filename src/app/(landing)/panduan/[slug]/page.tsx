import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { PANDUAN_MODULES, PANDUAN_BY_SLUG } from '@/content/panduan';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PANDUAN_MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const m = PANDUAN_BY_SLUG[slug];
  if (!m) return { title: 'Panduan tidak ditemukan' };

  const url = `https://tawzii.id/panduan/${m.slug}`;
  return {
    title: `Panduan ${m.title} | Tawzii Digital`,
    description: m.description,
    alternates: { canonical: url },
    openGraph: {
      title: `Panduan ${m.title}`,
      description: m.description,
      url,
      type: 'article',
    },
  };
}

export default async function PanduanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const module = PANDUAN_BY_SLUG[slug];
  if (!module) notFound();

  const idx = PANDUAN_MODULES.findIndex((m) => m.slug === slug);
  const prev = idx > 0 ? PANDUAN_MODULES[idx - 1] : null;
  const next =
    idx >= 0 && idx < PANDUAN_MODULES.length - 1
      ? PANDUAN_MODULES[idx + 1]
      : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://tawzii.id',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Panduan',
        item: 'https://tawzii.id/panduan',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: module.title,
        item: `https://tawzii.id/panduan/${module.slug}`,
      },
    ],
  };

  const Icon = module.icon;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
      <section className="bg-white pb-10 pt-10 md:pb-14 md:pt-14">
        <div className="mx-auto max-w-4xl px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#3f4944]/70"
          >
            <Link href="/" className="hover:text-[#004532]">
              Beranda
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/panduan" className="hover:text-[#004532]">
              Panduan
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-[#191c1e]">{module.title}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#a6f2d1] text-[#004532]">
              <Icon className="size-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#004532]">
                Modul Panduan
              </p>
              <h1 className="font-headline mt-2 text-3xl font-extrabold leading-tight text-[#191c1e] md:text-5xl">
                {module.title}
              </h1>
            </div>
          </div>

          <p className="mt-6 text-base text-[#3f4944] md:text-lg">
            {module.summary}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <article className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
            <h2 className="font-headline mb-6 text-xl font-extrabold text-[#191c1e] md:text-2xl">
              Langkah-langkah
            </h2>

            <ol className="space-y-5">
              {module.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#004532] text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-[#191c1e]">{step.title}</p>
                    <p className="mt-1 text-sm text-[#3f4944] md:text-base">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {module.tips && module.tips.length > 0 && (
              <div className="mt-8 rounded-2xl border border-[#a6f2d1] bg-[#a6f2d1]/20 p-5">
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#004532]">
                  💡 Tips
                </p>
                <ul className="space-y-2 text-sm text-[#3f4944] md:text-base">
                  {module.tips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-[#004532]">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Prev / Next */}
          <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Modul lain">
            {prev ? (
              <Link
                href={`/panduan/${prev.slug}`}
                className="group flex flex-col rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#3f4944]/60">
                  <ArrowLeft className="size-3" />
                  Sebelumnya
                </span>
                <span className="font-headline mt-2 text-base font-extrabold text-[#191c1e] group-hover:text-[#004532]">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/panduan/${next.slug}`}
                className="group flex flex-col items-end rounded-2xl bg-white p-5 text-right shadow-sm transition-all hover:shadow-md"
              >
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#3f4944]/60">
                  Selanjutnya
                  <ArrowRight className="size-3" />
                </span>
                <span className="font-headline mt-2 text-base font-extrabold text-[#191c1e] group-hover:text-[#004532]">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </nav>

          {/* All modules link */}
          <div className="mt-6 text-center">
            <Link
              href="/panduan"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#004532] hover:underline"
            >
              <ArrowLeft className="size-4" />
              Semua modul panduan
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-8 text-center text-white shadow-lg md:p-10">
            <h3 className="font-headline text-2xl font-extrabold md:text-3xl">
              Coba sendiri di akun masjid Anda
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
              Gratis untuk paket Free, tanpa kartu kredit. Setup masjid dalam 5
              menit.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-[#004532] shadow-xl transition-all hover:opacity-90 active:scale-95"
            >
              Daftar Gratis
            </Link>
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
