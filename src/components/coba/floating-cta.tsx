'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useDemoStore } from '@/stores/demo.store';

/**
 * Floating CTA muncul setelah visitor melakukan minimal 1 scan.
 * Bisa di-dismiss dengan tombol X (state hanya untuk sesi ini).
 */
export function FloatingCta() {
  const scanCount = useDemoStore((s) => s.scanCount);
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (scanCount >= 1 && !dismissed) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, [scanCount, dismissed]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 md:right-6">
      <div className="relative rounded-2xl bg-[#004532] p-5 text-white shadow-2xl shadow-[#004532]/40">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup"
          className="absolute right-3 top-3 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <p className="font-headline pr-6 text-base font-extrabold leading-tight">
          {scanCount === 1
            ? 'Wah, scan pertama berhasil!'
            : `${scanCount} scan tanpa kendala 👍`}
        </p>
        <p className="mt-1.5 text-sm text-white/80">
          Mau pakai untuk masjid Anda sekarang? Gratis, tanpa kartu kredit.
        </p>
        <Link
          href="/register"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#004532] transition-all hover:opacity-90 active:scale-95"
        >
          Daftar Gratis
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
