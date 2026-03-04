'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Masukkan password baru Anda</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      {...field}
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
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ulangi password baru"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
