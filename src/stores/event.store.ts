import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event } from '@/types';

interface EventState {
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      activeEvent: null,
      setActiveEvent: (event) => set({ activeEvent: event }),
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({
        activeEvent: state.activeEvent,
      }),
    }
  )
);
