'use client';

import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useDemoStore } from '@/stores/demo.store';

export function DemoBanner() {
  const reset = useDemoStore((s) => s.resetDemo);

  return (
    <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-xs md:px-6 md:text-sm">
        <AlertTriangle className="size-4 shrink-0 text-amber-600" />
        <p className="flex-1 truncate text-amber-900">
          <strong className="font-bold">Mode Demo</strong>
          <span className="hidden md:inline">
            {' '}— data simulasi, tidak tersimpan, reset saat refresh.
          </span>
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-900 ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
        >
          <RotateCcw className="size-3" />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <Link
          href="/register"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#004532] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#003524]"
        >
          Daftar Gratis
        </Link>
      </div>
    </div>
  );
}
