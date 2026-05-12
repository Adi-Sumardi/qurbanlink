import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ARTICLES } from '@/content/articles';

export const metadata: Metadata = {
  title: 'Blog | Tawzii Digital — Tips & Panduan Distribusi Kurban',
  description:
    'Artikel, tips, dan panduan praktis untuk panitia kurban masjid: distribusi modern, hukum syariat, dan teknologi distribusi daging kurban.',
  openGraph: {
    title: 'Blog Tawzii Digital',
    description:
      'Tips & panduan untuk panitia kurban masjid: distribusi modern, hukum syariat, dan teknologi.',
    type: 'website',
    url: 'https://tawzii.id/blog',
  },
  alternates: { canonical: 'https://tawzii.id/blog' },
};

const CATEGORY_COLORS: Record<string, string> = {
  Panduan: 'bg-[#a6f2d1] text-[#004532]',
  Tips: 'bg-amber-100 text-amber-800',
  Edukasi: 'bg-blue-100 text-blue-800',
};

export default function BlogIndexPage() {
  const sortedArticles = [...ARTICLES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      {/* Hero */}
      <section className="bg-white pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#004532] hover:underline"
          >
            ← Kembali ke beranda
          </Link>
          <h1 className="font-headline mt-6 text-4xl font-extrabold text-[#191c1e] md:text-6xl">
            Blog Tawzii Digital
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#3f4944] md:text-lg">
            Tips, panduan, dan edukasi untuk panitia kurban masjid yang ingin
            modern, transparan, dan efisien.
          </p>
        </div>
      </section>

      {/* Article List */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Cover — gradient fallback kalau tidak ada image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-[#004532] to-[#065f46]">
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-extrabold text-white/10">
                  {article.title.charAt(0)}
                </div>
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                    CATEGORY_COLORS[article.category] ?? 'bg-white text-[#004532]'
                  }`}
                >
                  {article.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-headline text-lg font-extrabold text-[#191c1e] group-hover:text-[#004532] md:text-xl">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-[#3f4944]">
                  {article.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-[#3f4944]/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {article.readMinutes} menit baca
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#004532]">
                  Baca selengkapnya
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
