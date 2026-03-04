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
import { useRegister } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function RegisterForm() {
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenant_name: '',
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
    <Card>
      <CardHeader>
        <CardTitle>Daftar</CardTitle>
        <CardDescription>
          Buat akun QurbanLink untuk organisasi Anda
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tenant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Masjid / Organisasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masjid Al-Ikhlas" {...field} />
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
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmad Fauzi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    No. Telepon{' '}
                    <span className="text-muted-foreground">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="08123456789"
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
                  <FormLabel>Password</FormLabel>
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
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
            >
              {register.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Daftar
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
