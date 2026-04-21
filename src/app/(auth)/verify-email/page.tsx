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
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#004532] shadow-lg shadow-[#004532]/25">
          <svg viewBox="0 0 24 24" className="size-6 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"/>
          </svg>
        </div>
        <span className="font-headline text-lg font-bold text-[#004532]">Tawzii Digital <span className="font-normal text-[#3f4944]/50">by adilabs.id</span></span>
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
