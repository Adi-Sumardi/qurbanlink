'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useEventStore } from '@/stores/event.store';
import { eventService } from '@/services/event.service';
import type { Event } from '@/types';

export function EventSwitcher() {
  const { activeEvent, setActiveEvent } = useEventStore();

  const { data } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => eventService.getAll({ per_page: 50 }),
  });

  const events = data?.data ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="w-full justify-between">
          <span className="truncate text-sm">
            {activeEvent?.name || 'Pilih Event'}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </SidebarMenuButton>
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
        {events.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          <Link href="/events/new">
            <Plus className="size-4" />
            <span>Buat Event Baru</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
