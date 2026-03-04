import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const registerSchema = z
  .object({
    tenant_name: z.string().min(2, 'Nama masjid/organisasi minimal 2 karakter'),
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.email('Email tidak valid'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation'],
  });

export const forgotPasswordSchema = z.object({
  email: z.email('Email tidak valid'),
});

export const resetPasswordSchema = z
  .object({
    email: z.email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi'),
    token: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
