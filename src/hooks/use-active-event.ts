'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEventStore } from '@/stores/event.store';
import { eventService } from '@/services/event.service';
import { useAuthStore } from '@/stores/auth.store';

export function useActiveEvent() {
  const { isAuthenticated } = useAuthStore();
  const { activeEvent, setActiveEvent } = useEventStore();

  const { data } = useQuery({
    queryKey: ['events', 'list'],
    queryFn: () => eventService.getAll({ per_page: 50 }),
    enabled: isAuthenticated,
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (!data?.data) return;

    const events = data.data;

    // Kalau activeEvent ada tapi sudah tidak ada di daftar (misal setelah migrate:fresh), reset
    if (activeEvent) {
      const stillExists = events.some((e) => e.id === activeEvent.id);
      if (!stillExists) {
        setActiveEvent(events.length > 0 ? events[0] : null);
        return;
      }
    }

    // Kalau belum ada activeEvent, pilih yang pertama
    if (!activeEvent && events.length > 0) {
      setActiveEvent(events[0]);
    }
  }, [activeEvent, data, setActiveEvent]);

  return { activeEvent, setActiveEvent, events: data?.data ?? [] };
}
