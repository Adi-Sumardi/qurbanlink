'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEventStore } from '@/stores/event.store';
import { eventService } from '@/services/event.service';
import type { Event } from '@/types';

export function EventSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { activeEvent, setActiveEvent } = useEventStore();

  const { data } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => eventService.getAll({ per_page: 50 }),
    enabled: mounted, // Only fetch after hydration
    retry: false,
    throwOnError: false,
  });

  // Prevent SSR / client hydration mismatch from Zustand persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const events = data?.data ?? [];

  // Auto-select first event jika belum ada event aktif atau event yang tersimpan sudah tidak ada
  useEffect(() => {
    if (!mounted || events.length === 0) return;
    const stillValid = activeEvent && events.some((e: Event) => e.id === activeEvent.id);
    if (!stillValid) setActiveEvent(events[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, events.length]);

  // Render a stable placeholder on SSR / before hydration
  if (!mounted) {
    return (
      <button
        className="flex w-full items-center justify-between rounded-xl bg-[#f2f4f6] px-3 py-2.5 text-left text-sm text-[#191c1e]"
        type="button"
        disabled
      >
        <span className="truncate font-medium text-muted-foreground">Pilih Event</span>
        <ChevronsUpDown className="ml-2 size-3.5 shrink-0 text-[#3f4944]/50" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-xl bg-[#f2f4f6] px-3 py-2.5 text-left text-sm text-[#191c1e] transition-colors hover:bg-[#e6e8ea]">
          <span className="truncate font-medium">
            {activeEvent?.name || 'Pilih Event'}
          </span>
          <ChevronsUpDown className="ml-2 size-3.5 shrink-0 text-[#3f4944]/50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
        {events.map((event: Event) => (
          <DropdownMenuItem
            key={event.id}
            onClick={() => setActiveEvent(event)}
          >
            <span className="truncate">{event.name}</span>
            {activeEvent?.id === event.id && (
              <Check className="ml-auto size-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
