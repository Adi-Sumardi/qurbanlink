'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForgotPassword } from '@/hooks/use-auth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/lib/validations/auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        toast.success('Link reset password telah dikirim ke email Anda');
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message || 'Gagal mengirim link reset'
          );
        }
      },
    });
  }

  return (
    <div>
      {/* Brand Header */}
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
      {forgotPassword.isSuccess ? (
        <div className="space-y-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#a6f2d1]">
            <CheckCircle className="size-7 text-[#004532]" />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-extrabold text-[#191c1e]">Cek Email Anda</h1>
            <p className="mt-2 text-[#3f4944]">
              Kami telah mengirimkan link reset kata sandi ke alamat email Anda. Silakan cek kotak masuk.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f2f4f6] p-4 text-sm text-[#3f4944]">
            Tidak menerima email? Cek folder spam atau coba lagi dalam beberapa menit.
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#004532] hover:underline"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="mb-7">
            <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Lupa Kata Sandi</h1>
            <p className="mt-2 text-[#3f4944]">
              Masukkan email Anda untuk menerima link reset kata sandi
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
                        <input
                          type="email"
                          placeholder="name@mosque.org"
                          autoComplete="email"
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
                disabled={forgotPassword.isPending}
                className="btn-gradient flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
              >
                {forgotPassword.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  'Kirim Link Reset'
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3f4944] hover:text-[#004532] transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
