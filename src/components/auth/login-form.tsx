'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
        <img src="/logo.png" alt="Tawzii Digital" className="h-14 w-14 rounded-full object-cover" />
        <div className="leading-tight">
          <p className="font-headline text-xl font-extrabold text-[#004532]">Tawzii Digital</p>
          <p className="text-xs text-[#3f4944]/60">by adilabs.id</p>
        </div>
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
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40 pointer-events-none" />
                  <FormControl>
                    <input
                      type="email"
                      placeholder="name@mosque.org"
                      autoComplete="email"
                      className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none ring-0 transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                      {...field}
                    />
                  </FormControl>
                </div>
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
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40 pointer-events-none" />
                  <FormControl>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl bg-[#f2f4f6] py-3.5 pl-11 pr-11 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none ring-0 transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3f4944]/40 transition-colors hover:text-[#3f4944]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
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
