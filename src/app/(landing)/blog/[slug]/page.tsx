import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { ARTICLES, ARTICLES_BY_SLUG } from '@/content/articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES_BY_SLUG[slug];
  if (!article) return { title: 'Artikel tidak ditemukan' };

  const url = `https://tawzii.id/blog/${article.slug}`;
  return {
    title: `${article.title} | Tawzii Digital`,
    description: article.description,
    keywords: article.tags.join(', '),
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url,
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES_BY_SLUG[slug];
  if (!article) notFound();

  const url = `https://tawzii.id/blog/${article.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'Tawzii Digital',
      logo: { '@type': 'ImageObject', url: 'https://tawzii.id/logo.png' },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: article.tags.join(', '),
  };

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-white pt-24 pb-20 md:pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#004532] hover:underline"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#a6f2d1] px-3 py-1 text-xs font-bold text-[#004532]">
              {article.category}
            </span>
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-medium text-[#3f4944]"
              >
                <Tag className="size-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-headline mt-6 text-3xl font-extrabold leading-tight text-[#191c1e] md:text-5xl">
            {article.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[#3f4944]/70">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {article.readMinutes} menit baca
            </span>
          </div>

          {/* Article body */}
          <div className="mt-10 space-y-6">
            {article.content.map((section, idx) => {
              if (section.type === 'heading') {
                return (
                  <h2
                    key={idx}
                    className="font-headline mt-10 text-2xl font-bold text-[#191c1e] md:text-3xl"
                  >
                    {section.text}
                  </h2>
                );
              }
              if (section.type === 'paragraph') {
                return (
                  <p
                    key={idx}
                    className="text-base leading-relaxed text-[#3f4944] md:text-lg"
                  >
                    {section.text}
                  </p>
                );
              }
              if (section.type === 'list') {
                const ListTag = section.ordered ? 'ol' : 'ul';
                return (
                  <ListTag
                    key={idx}
                    className={`space-y-2 pl-5 text-base text-[#3f4944] md:text-lg ${
                      section.ordered ? 'list-decimal' : 'list-disc'
                    }`}
                  >
                    {section.items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ListTag>
                );
              }
              if (section.type === 'quote') {
                return (
                  <blockquote
                    key={idx}
                    className="my-8 border-l-4 border-[#004532] bg-[#f0fbf4] px-6 py-5 italic text-[#191c1e]"
                  >
                    <p className="text-base md:text-lg">"{section.text}"</p>
                    {section.cite && (
                      <footer className="mt-3 text-sm not-italic text-[#3f4944]/70">
                        — {section.cite}
                      </footer>
                    )}
                  </blockquote>
                );
              }
              return null;
            })}
          </div>

          {/* CTA setelah artikel */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-8 text-center text-white md:p-12">
            <h3 className="font-headline text-2xl font-extrabold md:text-3xl">
              Siap modernisasi distribusi kurban masjid Anda?
            </h3>
            <p className="mt-3 text-base text-white/80">
              Coba Tawzii Digital gratis selama 3 hari. Tanpa kartu kredit.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-full bg-[#6ffbbe] px-8 py-4 font-bold text-[#002113] shadow-lg transition-all hover:bg-white"
            >
              Mulai Gratis Sekarang →
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-[#f7f9fb] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h3 className="font-headline mb-8 text-center text-2xl font-extrabold text-[#191c1e] md:text-3xl">
              Artikel lainnya
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#004532]">
                    {rel.category}
                  </span>
                  <h4 className="font-headline mt-2 text-lg font-bold text-[#191c1e] group-hover:text-[#004532]">
                    {rel.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm text-[#3f4944]">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
