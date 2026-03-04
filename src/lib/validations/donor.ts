import { z } from 'zod/v4';

export const donorSchema = z.object({
  name: z.string().min(2, 'Nama donatur minimal 2 karakter'),
  phone: z.string().optional(),
  email: z.email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  nik: z.string().optional(),
  notes: z.string().optional(),
});

export type DonorFormValues = z.infer<typeof donorSchema>;
