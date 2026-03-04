import { describe, it, expect, beforeEach } from 'vitest';
import { useEventStore } from '../event.store';
import type { Event } from '@/types';

const mockEvent: Event = {
  id: 'event-1',
  tenant_id: 'tenant-1',
  created_by: 'user-1',
  name: 'Kurban 2025',
  description: null,
  event_date: '2025-06-15',
  start_time: null,
  end_time: null,
  year: 2025,
  status: 'active',
  settings: {},
  total_coupons: 100,
  distributed: 25,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
};

describe('useEventStore', () => {
  beforeEach(() => {
    useEventStore.setState({ activeEvent: null });
  });

  it('setActiveEvent sets the active event', () => {
    useEventStore.getState().setActiveEvent(mockEvent);
    expect(useEventStore.getState().activeEvent).toEqual(mockEvent);
  });

  it('setActiveEvent with null clears the event', () => {
    useEventStore.getState().setActiveEvent(mockEvent);
    useEventStore.getState().setActiveEvent(null);
    expect(useEventStore.getState().activeEvent).toBeNull();
  });

  it('preserves event data correctly', () => {
    useEventStore.getState().setActiveEvent(mockEvent);
    const stored = useEventStore.getState().activeEvent;
    expect(stored?.name).toBe('Kurban 2025');
    expect(stored?.total_coupons).toBe(100);
    expect(stored?.distributed).toBe(25);
  });
});
