import Link from 'next/link';
import type { Metadata } from 'next';
import { ARTICLES } from '@/content/articles';
import { BlogList } from './blog-list';

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

      <BlogList articles={sortedArticles} />
    </main>
  );
}
