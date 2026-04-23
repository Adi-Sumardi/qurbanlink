'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2, Building2, User, Mail, Phone, Lock,
  ArrowRight, ArrowLeft, Calendar, FileText, CheckCircle2,
} from 'lucide-react';
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

const STEP1_FIELDS = [
  'organization_name', 'name', 'email', 'phone', 'password', 'password_confirmation',
] as const;

export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
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
      event_name: '',
      event_date: '',
      event_description: '',
    },
  });

  async function goToStep2() {
    const valid = await form.trigger(STEP1_FIELDS);
    if (valid) setStep(2);
  }

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
            // If error is on step 1 fields, go back
            const hasStep1Error = STEP1_FIELDS.some((f) => errors[f]);
            if (hasStep1Error) setStep(1);
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
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tawzii Digital" className="h-14 w-14 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="font-headline text-xl font-extrabold text-[#004532]">Tawzii Digital</p>
            <p className="text-xs text-[#3f4944]/60">by adilabs.id</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-4">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              step === 1
                ? 'bg-[#004532] text-white'
                : 'bg-[#a6f2d1] text-[#004532]'
            }`}>
              {step > 1 ? <CheckCircle2 className="size-4" /> : '1'}
            </div>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-[#191c1e]' : 'text-[#3f4944]/50'}`}>
              Akun
            </span>
          </div>

          <div className="h-px flex-1 bg-[#3f4944]/20" />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              step === 2
                ? 'bg-[#004532] text-white'
                : 'bg-[#f2f4f6] text-[#3f4944]/40'
            }`}>
              2
            </div>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-[#191c1e]' : 'text-[#3f4944]/40'}`}>
              Event Kurban
            </span>
          </div>
        </div>

        {step === 1 ? (
          <>
            <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Daftar Akun</h1>
            <p className="mt-2 text-[#3f4944]">Daftarkan masjid Anda untuk mengelola distribusi kurban</p>
          </>
        ) : (
          <>
            <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Setup Event Kurban</h1>
            <p className="mt-2 text-[#3f4944]">Buat event distribusi pertama Anda — bisa diubah kapan saja</p>
          </>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
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
                        <SacredInput icon={Mail} type="email" placeholder="name@mosque.org" autoComplete="email" field={field} />
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
                        Phone <span className="normal-case font-normal text-[#3f4944]/50">(opsional)</span>
                      </FormLabel>
                      <FormControl>
                        <SacredInput icon={Phone} type="tel" placeholder="08123456789" field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <SacredInput icon={Lock} type="password" placeholder="Min. 8 karakter" autoComplete="new-password" field={field} />
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
                        <SacredInput icon={Lock} type="password" placeholder="Ulangi kata sandi" autoComplete="new-password" field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs text-[#3f4944]/60 leading-relaxed pt-1">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="/syarat-ketentuan" className="text-[#004532] font-semibold hover:underline">Syarat & Ketentuan</a>
                {' '}dan mengonfirmasi bahwa organisasi ini adalah lembaga Islam yang sah.
              </p>

              <button
                type="button"
                onClick={goToStep2}
                className="btn-gradient mt-1 flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95"
              >
                Lanjutkan
                <ArrowRight className="size-5" />
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Nama Event
                    </FormLabel>
                    <FormControl>
                      <SacredInput icon={Building2} placeholder="Kurban Masjid Al-Ikhlas 1446H" field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Tanggal Distribusi
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#3f4944]/40" />
                        <input
                          type="date"
                          className="w-full rounded-xl bg-[#f2f4f6] py-3 pl-11 pr-4 text-sm text-[#191c1e] outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#3f4944]">
                      Keterangan <span className="normal-case font-normal text-[#3f4944]/50">(opsional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 size-4 text-[#3f4944]/40" />
                        <textarea
                          placeholder="Contoh: Distribusi kurban idul adha untuk warga sekitar masjid"
                          rows={3}
                          className="w-full rounded-xl bg-[#f2f4f6] py-3 pl-11 pr-4 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532] resize-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 rounded-full border border-[#004532]/20 px-5 py-4 text-sm font-semibold text-[#004532] transition-all hover:bg-[#004532]/5"
                >
                  <ArrowLeft className="size-4" />
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={register.isPending}
                  className="btn-gradient flex flex-1 items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
                >
                  {register.isPending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      Daftar & Mulai
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
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
