import { z } from 'zod/v4';

export const participantSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
});

export const donorSchema = z.object({
  name: z.string().min(2, 'Nama donatur minimal 2 karakter'),
  phone: z.string().optional(),
  email: z.email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  nik: z.string().optional(),
  notes: z.string().optional(),
  kurban_type: z.enum(['pribadi', 'patungan']),
  participants: z.array(participantSchema).optional(),
});

export type DonorFormValues = z.infer<typeof donorSchema>;
export type ParticipantFormValues = z.infer<typeof participantSchema>;
