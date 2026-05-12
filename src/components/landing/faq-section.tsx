'use client';

import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/content/faq';

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative bg-white py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      {/* FAQPage Schema.org structured data — boost rich snippet di Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-[#a6f2d1] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#004532]">
            Pertanyaan Umum
          </span>
          <h2
            id="faq-heading"
            className="font-headline mt-4 text-4xl font-extrabold text-[#191c1e] md:text-5xl"
          >
            Punya pertanyaan?
          </h2>
          <p className="mt-3 text-base text-[#3f4944] md:text-lg">
            Jawaban untuk pertanyaan yang paling sering ditanyakan tentang Tawzii Digital.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-[#e2e8f0] bg-white px-5 py-4 transition-all hover:border-[#004532]/30 hover:shadow-sm open:border-[#004532]/40 open:bg-[#f0fbf4]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-headline font-bold text-[#191c1e] [&::-webkit-details-marker]:hidden">
                <span className="text-base md:text-lg">{item.question}</span>
                <ChevronDown className="size-5 shrink-0 text-[#004532] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#3f4944] md:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-[#3f4944]/70">
          Masih ada pertanyaan?{' '}
          <a
            href="mailto:halo@tawzii.id"
            className="font-semibold text-[#004532] hover:underline"
          >
            Hubungi kami via email
          </a>
        </div>
      </div>
    </section>
  );
}
