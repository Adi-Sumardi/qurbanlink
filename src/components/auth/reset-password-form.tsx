'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useResetPassword } from '@/hooks/use-auth';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/validations/auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      token: searchParams.get('token') || '',
      password: '',
      password_confirmation: '',
    },
  });

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword.mutate(data, {
      onSuccess: () => {
        toast.success('Password berhasil direset. Silakan login.');
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || 'Gagal mereset password'
          );
        }
      },
    });
  }

  return (
    <div>
      {/* Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tawzii Digital" className="h-14 w-14 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="font-headline text-xl font-extrabold text-[#004532]">Tawzii Digital</p>
            <p className="text-xs text-[#3f4944]/60">by adilabs.id</p>
          </div>
        </div>
      </div>

      {/* Success State */}
      {resetPassword.isSuccess ? (
        <div className="space-y-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#a6f2d1]">
            <CheckCircle className="size-7 text-[#004532]" />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-extrabold text-[#191c1e]">Kata Sandi Diperbarui</h1>
            <p className="mt-2 text-[#3f4944]">
              Kata sandi Anda berhasil diubah. Silakan masuk menggunakan kata sandi baru Anda.
            </p>
          </div>
          <Link
            href="/login"
            className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold"
          >
            Masuk ke Dashboard
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Buat Kata Sandi Baru</h1>
            <p className="mt-2 text-[#3f4944]">Buat kata sandi baru yang kuat untuk akun Anda</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email (read-only) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Email Akun
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/30" />
                        <input
                          type="email"
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl bg-[#eceef0] py-3.5 pl-11 pr-4 text-sm text-[#3f4944]/60 outline-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Kata Sandi Baru
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
                        <input
                          type="password"
                          placeholder="Min. 8 karakter"
                          autoComplete="new-password"
                          className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Konfirmasi Kata Sandi
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
                        <input
                          type="password"
                          placeholder="Ulangi kata sandi baru"
                          autoComplete="new-password"
                          className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={resetPassword.isPending}
                className="btn-gradient flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
              >
                {resetPassword.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Perbarui Kata Sandi
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
