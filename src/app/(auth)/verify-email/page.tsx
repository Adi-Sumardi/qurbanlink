'use client';

import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useResendVerification, useLogout } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { user } = useAuthStore();
  const resend = useResendVerification();
  const logout = useLogout();

  function handleResend() {
    resend.mutate(undefined, {
      onSuccess: () => {
        toast.success('Email verifikasi telah dikirim ulang');
      },
      onError: () => {
        toast.error('Gagal mengirim ulang email verifikasi');
      },
    });
  }

  return (
    <div>
      {/* Brand Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tawzii Digital" className="h-14 w-14 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="font-headline text-xl font-extrabold text-[#004532]">Tawzii Digital</p>
            <p className="text-xs text-[#3f4944]/60">by adilabs.id</p>
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#a6f2d1]">
          <Mail className="size-10 text-[#004532]" />
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Verifikasi Email</h1>
        <p className="mt-3 text-[#3f4944]">
          Kami telah mengirim link verifikasi ke{' '}
          <span className="font-semibold text-[#191c1e]">
            {user?.email || 'email Anda'}
          </span>
        </p>
        <p className="mt-2 text-sm text-[#3f4944]/70">
          Klik link yang kami kirim untuk mengaktifkan akun Anda. Jika tidak menemukan emailnya, cek folder spam.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleResend}
          disabled={resend.isPending}
          className="btn-gradient flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-bold font-headline shadow-xl shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
        >
          {resend.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Mail className="size-5" />
          )}
          Kirim Ulang Email Verifikasi
        </button>

        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#3f4944] transition-colors hover:text-[#004532]"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
