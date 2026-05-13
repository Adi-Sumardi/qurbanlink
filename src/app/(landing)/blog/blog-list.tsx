'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Article } from '@/content/articles';

const CATEGORY_COLORS: Record<string, string> = {
  Panduan: 'bg-[#a6f2d1] text-[#004532]',
  Tips: 'bg-amber-100 text-amber-800',
  Edukasi: 'bg-blue-100 text-blue-800',
};

const PAGE_SIZE = 6;

export function BlogList({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('Semua');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return ['Semua', ...Array.from(set)];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCategory = category === 'Semua' || a.category === category;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <>
      {/* Filter Bar */}
      <section className="px-6 pt-2">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => resetPage(setQuery)(e.target.value)}
                  placeholder="Cari artikel, topik, atau tag…"
                  className="w-full rounded-full border border-[#eceef0] bg-[#f7f9fb] py-2.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder:text-[#3f4944]/50 focus:border-[#004532] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6f2d1]"
                  aria-label="Cari artikel"
                />
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = c === category;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => resetPage(setCategory)(c)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                        active
                          ? 'bg-[#004532] text-white'
                          : 'bg-[#f2f4f6] text-[#3f4944] hover:bg-[#e6e8ea]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-xs text-[#3f4944]/60">
              Menampilkan {paged.length} dari {filtered.length} artikel
              {category !== 'Semua' && ` di kategori "${category}"`}
              {query && ` untuk pencarian "${query}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          {paged.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <p className="font-headline text-lg font-bold text-[#191c1e]">
                Tidak ada artikel yang cocok
              </p>
              <p className="mt-2 text-sm text-[#3f4944]">
                Coba kata kunci lain atau ubah filter kategori.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('Semua');
                  setPage(1);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#004532] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#003524]"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paged.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 w-full bg-gradient-to-br from-[#004532] to-[#065f46]">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl font-extrabold text-white/10">
                      {article.title.charAt(0)}
                    </div>
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                        CATEGORY_COLORS[article.category] ??
                        'bg-white text-[#004532]'
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
                        {new Date(article.publishedAt).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[#004532] shadow-sm transition-colors hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const active = n === currentPage;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      active
                        ? 'bg-[#004532] text-white shadow-md'
                        : 'bg-white text-[#3f4944] shadow-sm hover:bg-[#f2f4f6]'
                    }`}
                    aria-current={active ? 'page' : undefined}
                    aria-label={`Halaman ${n}`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex size-10 items-center justify-center rounded-full bg-white text-[#004532] shadow-sm transition-colors hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
