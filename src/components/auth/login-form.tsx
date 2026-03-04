'use client';

import Link from 'next/link';
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
    <Card>
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Masuk ke akun QurbanLink Anda
        </CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Lupa password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Masuk
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Daftar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
