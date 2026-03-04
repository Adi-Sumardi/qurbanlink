import { z } from 'zod/v4';

export const animalSchema = z.object({
  donor_id: z.string().min(1, 'Donatur wajib dipilih'),
  type: z.string().min(1, 'Jenis hewan wajib dipilih'),
  breed: z.string().optional(),
  weight: z.number().min(1, 'Berat hewan wajib diisi'),
  color: z.string().optional(),
  estimated_portions: z.number().optional(),
  notes: z.string().optional(),
});

export type AnimalFormValues = z.infer<typeof animalSchema>;
