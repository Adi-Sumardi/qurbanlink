'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Building2, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRegister } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

function SacredInput({
  icon: Icon,
  type = 'text',
  placeholder,
  autoComplete,
  field,
}: {
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  field: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl bg-[#f2f4f6] py-3 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
        {...field}
      />
    </div>
  );
}

export function RegisterForm() {
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organization_name: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
  });

  function onSubmit(data: RegisterFormValues) {
    register.mutate(data, {
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errors = error.response?.data?.errors;
          if (errors) {
            Object.entries(errors).forEach(([key, messages]) => {
              form.setError(key as keyof RegisterFormValues, {
                message: (messages as string[])[0],
              });
            });
          } else {
            toast.error(error.response?.data?.message || 'Registrasi gagal');
          }
        }
      },
    });
  }

  return (
    <div>
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#004532] shadow-lg shadow-[#004532]/25">
          <svg viewBox="0 0 24 24" className="size-6 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/>
          </svg>
        </div>
        <span className="font-headline text-lg font-bold text-[#004532]">Tawzii Digital <span className="font-normal text-[#3f4944]/50">by adilabs.id</span></span>
      </div>

      {/* Title */}
      <div className="mb-7">
        <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Daftar Akun</h1>
        <p className="mt-2 text-[#3f4944]">Daftarkan masjid Anda untuk mengelola distribusi kurban</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Mosque Name */}
          <FormField
            control={form.control}
            name="organization_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                  Nama Masjid / Organisasi
                </FormLabel>
                <FormControl>
                  <SacredInput icon={Building2} placeholder="Masjid Al-Ikhlas" field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                  Nama Admin
                </FormLabel>
                <FormControl>
                  <SacredInput icon={User} placeholder="Ahmad Fauzi" field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email + Phone row */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                    Email
                  </FormLabel>
                  <FormControl>
                    <SacredInput
                      icon={Mail}
                      type="email"
                      placeholder="name@mosque.org"
                      autoComplete="email"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                    Phone{' '}
                    <span className="normal-case font-normal text-[#3f4944]/50">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <SacredInput
                      icon={Phone}
                      type="tel"
                      placeholder="08123456789"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <SacredInput
                      icon={Lock}
                      type="password"
                      placeholder="Min. 8 karakter"
                      autoComplete="new-password"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                    Confirm
                  </FormLabel>
                  <FormControl>
                    <SacredInput
                      icon={Lock}
                      type="password"
                      placeholder="Ulangi kata sandi"
                      autoComplete="new-password"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Terms note */}
          <p className="text-xs text-[#3f4944]/60 leading-relaxed pt-1">
            Dengan mendaftar, Anda menyetujui{' '}
            <a href="#" className="text-[#004532] font-semibold hover:underline">Syarat & Ketentuan</a>
            {' '}dan mengonfirmasi bahwa organisasi ini adalah lembaga Islam yang sah.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={register.isPending}
            className="btn-gradient mt-1 flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
          >
            {register.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Buat Akun Sekarang
                <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </form>
      </Form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-[#3f4944]">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-[#004532] hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
