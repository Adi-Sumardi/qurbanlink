'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function DataTablePagination({
  meta,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="shrink-0 text-center text-sm text-muted-foreground sm:text-left">
        Menampilkan {meta.from ?? 0}-{meta.to ?? 0} dari {meta.total} data
      </p>
      <div className="flex items-center justify-center gap-3 sm:justify-end">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-muted-foreground">Per halaman</span>
          <Select
            value={String(meta.per_page)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
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
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(1)}
            disabled={meta.current_page <= 1}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(meta.current_page - 1)}
            disabled={meta.current_page <= 1}
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-16 px-2 text-center text-sm tabular-nums">
            {meta.current_page} / {meta.last_page}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(meta.current_page + 1)}
            disabled={meta.current_page >= meta.last_page}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(meta.last_page)}
            disabled={meta.current_page >= meta.last_page}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
