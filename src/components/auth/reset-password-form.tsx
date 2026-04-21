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
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#004532] shadow-lg shadow-[#004532]/25">
          <svg viewBox="0 0 24 24" className="size-6 fill-white">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/>
          </svg>
        </div>
        <span className="font-headline text-lg font-bold text-[#004532]">Tawzii Digital <span className="font-normal text-[#3f4944]/50">by adilabs.id</span></span>
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
