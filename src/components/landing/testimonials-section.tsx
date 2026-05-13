'use client';

import { Quote, Star } from 'lucide-react';
import { motion as m, useInView } from 'motion/react';
import { useRef } from 'react';
import { TESTIMONIALS } from '@/content/testimonials';

const AVATAR_COLORS = [
  'bg-[#a6f2d1] text-[#004532]',
  'bg-amber-100 text-amber-800',
  'bg-blue-100 text-blue-800',
  'bg-rose-100 text-rose-800',
  'bg-violet-100 text-violet-800',
  'bg-emerald-100 text-emerald-800',
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      id="testimoni"
      ref={ref}
      className="bg-white py-20 md:py-28"
      aria-labelledby="testimoni-heading"
    >
      {/* Review JSON-LD untuk rich snippet (aggregateRating + reviews) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Tawzii Digital',
            description:
              'Platform distribusi kurban digital berbasis QR Code untuk masjid Indonesia.',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: TESTIMONIALS.length.toString(),
              bestRating: '5',
            },
            review: TESTIMONIALS.map((t) => ({
              '@type': 'Review',
              author: { '@type': 'Person', name: t.name },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5',
              },
              reviewBody: t.quote,
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <m.div
          className="mx-auto mb-14 max-w-3xl space-y-4 text-center md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#004532]">
            Cerita Panitia
          </p>
          <h2
            id="testimoni-heading"
            className="font-headline text-3xl font-extrabold leading-tight text-[#191c1e] md:text-5xl"
          >
            Dipakai panitia masjid <br className="hidden md:block" />
            di puluhan kota Indonesia
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[#3f4944] md:text-lg">
            Dari masjid kampung hingga masjid raya — Tawzii membantu pengurus
            DKM mengelola distribusi kurban dengan lebih tenang, transparan,
            dan terdokumentasi.
          </p>
        </m.div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <m.article
              key={`${t.masjid}-${t.name}`}
              className="group relative flex flex-col rounded-3xl bg-[#f7f9fb] p-7 transition-all hover:bg-white hover:shadow-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              {/* Decorative quote glyph */}
              <Quote
                className="absolute right-6 top-6 size-8 text-[#004532]/10 transition-colors group-hover:text-[#004532]/20"
                strokeWidth={2.5}
              />

              {/* Stars */}
              <div className="mb-4 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="flex-1 text-sm leading-relaxed text-[#3f4944] md:text-base">
                {t.quote}
              </p>

              {/* Highlight metric */}
              {t.highlight && (
                <p className="mt-5 rounded-xl bg-[#a6f2d1]/30 px-3 py-2 text-xs font-bold text-[#004532]">
                  {t.highlight}
                </p>
              )}

              {/* Footer: author */}
              <div className="mt-5 flex items-center gap-3 border-t border-[#eceef0] pt-5">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full font-extrabold ${
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  }`}
                >
                  {t.initials.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-headline truncate text-sm font-extrabold text-[#191c1e]">
                    {t.name}
                  </p>
                  <p className="truncate text-xs text-[#3f4944]/70">
                    {t.role} · {t.masjid}, {t.location}
                  </p>
                </div>
              </div>
            </m.article>
          ))}
        </div>

        {/* Trust strip */}
        <m.div
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center text-sm text-[#3f4944]/70"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="flex items-center gap-2">
            <span className="font-headline text-2xl font-extrabold text-[#004532]">
              50+
            </span>
            <span>masjid pengguna</span>
          </span>
          <span className="hidden h-6 w-px bg-[#eceef0] md:block" />
          <span className="flex items-center gap-2">
            <span className="font-headline text-2xl font-extrabold text-[#004532]">
              15rb+
            </span>
            <span>kupon ter-scan</span>
          </span>
          <span className="hidden h-6 w-px bg-[#eceef0] md:block" />
          <span className="flex items-center gap-2">
            <span className="font-headline text-2xl font-extrabold text-[#004532]">
              99.8%
            </span>
            <span>uptime hari-H</span>
          </span>
        </m.div>
      </div>
    </section>
  );
}
