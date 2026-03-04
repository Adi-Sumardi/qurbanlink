'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle>Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk menerima link reset password
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {forgotPassword.isSuccess ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center text-sm text-primary">
                Link reset password telah dikirim. Silakan cek email Anda.
              </div>
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {!forgotPassword.isSuccess && (
              <Button
                type="submit"
                className="w-full"
                disabled={forgotPassword.isPending}
              >
                {forgotPassword.isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Kirim Link Reset
              </Button>
            )}
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Kembali ke halaman masuk
            </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
