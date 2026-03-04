'use client';

import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <CardTitle>Verifikasi Email</CardTitle>
        <CardDescription>
          Kami telah mengirim link verifikasi ke{' '}
          <span className="font-medium text-foreground">
            {user?.email || 'email Anda'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm text-muted-foreground">
          Klik link yang kami kirim untuk mengaktifkan akun Anda. Jika tidak
          menemukan emailnya, cek folder spam.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resend.isPending}
        >
          {resend.isPending && <Loader2 className="animate-spin" />}
          Kirim Ulang Email
        </Button>
        <button
          onClick={() => logout.mutate()}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Logout
        </button>
      </CardFooter>
    </Card>
  );
}
