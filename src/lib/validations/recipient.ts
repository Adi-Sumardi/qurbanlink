import { z } from 'zod/v4';

export const recipientSchema = z.object({
  name: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  nik: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  rt_rw: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  category: z.string().optional(),
  portions: z.number().min(1).optional(),
  notes: z.string().optional(),
});

export type RecipientFormValues = z.infer<typeof recipientSchema>;
