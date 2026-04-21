'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLogin } from '@/hooks/use-auth';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function LoginForm() {
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    login.mutate(data, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Login gagal');
        }
      },
    });
  }

  return (
    <div>
      {/* Brand Header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#004532] shadow-lg shadow-[#004532]/25">
          <svg viewBox="0 0 24 24" className="size-6 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/>
          </svg>
        </div>
        <span className="font-headline text-lg font-bold text-[#004532]">Tawzii Digital <span className="font-normal text-[#3f4944]/50">by adilabs.id</span></span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Masuk ke Akun</h1>
        <p className="mt-2 text-[#3f4944]">Masukkan email dan kata sandi Anda</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
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
                      className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none ring-0 transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                    Kata Sandi
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#004532] hover:underline"
                  >
                    Lupa Kata Sandi?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none ring-0 transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              className="size-4 rounded border-[#e0e3e5] accent-[#004532] cursor-pointer"
            />
            <label htmlFor="remember" className="cursor-pointer text-sm text-[#3f4944]">
              Ingat saya
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={login.isPending}
            className="btn-gradient mt-2 flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
          >
            {login.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </form>
      </Form>

      {/* Register link */}
      <p className="mt-8 text-center text-sm text-[#3f4944]">
        Belum punya akun?{' '}
        <Link href="/register" className="font-bold text-[#004532] hover:underline">
          Daftar Sekarang
        </Link>
      </p>

    </div>
  );
}
