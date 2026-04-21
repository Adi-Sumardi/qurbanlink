'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginationMeta } from '@/types';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants';

interface DataTablePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function PaginationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-xl text-[#3f4944] transition-colors hover:bg-[#f2f4f6] hover:text-[#004532] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function DataTablePagination({
  meta,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="shrink-0 text-center text-xs text-[#3f4944]/60 sm:text-left">
        Showing {meta.from ?? 0}–{meta.to ?? 0} of{' '}
        <span className="font-semibold text-[#191c1e]">{meta.total}</span> entries
      </p>

      <div className="flex items-center justify-center gap-3 sm:justify-end">
        {/* Per page selector */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-[#3f4944]/60">Per page</span>
          <Select
            value={String(meta.per_page)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px] rounded-xl border-0 bg-[#f2f4f6] text-xs text-[#191c1e]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={meta.current_page <= 1}
          >
            <ChevronsLeft className="size-4" />
          </PaginationButton>
          <PaginationButton
            onClick={() => onPageChange(meta.current_page - 1)}
            disabled={meta.current_page <= 1}
          >
            <ChevronLeft className="size-4" />
          </PaginationButton>

          <span className="min-w-16 px-2 text-center text-xs font-semibold text-[#3f4944] tabular-nums">
            {meta.current_page} / {meta.last_page}
          </span>

          <PaginationButton
            onClick={() => onPageChange(meta.current_page + 1)}
            disabled={meta.current_page >= meta.last_page}
          >
            <ChevronRight className="size-4" />
          </PaginationButton>
          <PaginationButton
            onClick={() => onPageChange(meta.last_page)}
            disabled={meta.current_page >= meta.last_page}
          >
            <ChevronsRight className="size-4" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}
