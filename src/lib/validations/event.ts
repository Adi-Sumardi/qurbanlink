import { z } from 'zod/v4';

export const eventSchema = z.object({
  name: z.string().min(2, 'Nama event minimal 2 karakter'),
  description: z.string().optional(),
  event_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  year: z.number().optional(),
  status: z.string().optional(),
});

export const locationSchema = z.object({
  name: z.string().min(2, 'Nama lokasi minimal 2 karakter'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_active: z.boolean().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
export type LocationFormValues = z.infer<typeof locationSchema>;
