'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { tenantService } from '@/services/tenant.service';
import { useAuthStore } from '@/stores/auth.store';
import { formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/common/status-badge';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const { data: tenant, isLoading: loadingTenant } = useQuery({
    queryKey: ['tenant', 'profile'],
    queryFn: () => tenantService.getProfile(),
  });


  // --- Tenant profile form ---
  const tenantForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
    },
  });

  useEffect(() => {
    if (tenant?.data) {
      tenantForm.reset({
        name: tenant.data.name || '',
        email: tenant.data.email || '',
        phone: tenant.data.phone || '',
        address: tenant.data.address || '',
        city: tenant.data.city || '',
        province: tenant.data.province || '',
      });
    }
  }, [tenant, tenantForm]);

  const tenantMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      tenantService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profil organisasi berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
    onError: () => toast.error('Gagal memperbarui profil organisasi'),
  });

  // --- User profile form ---
  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, profileForm]);

  const profileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; phone: string }) => {
      const res = await api.put('/auth/profile', data);
      return res.data;
    },
    onSuccess: (res) => {
      if (res.data) setUser(res.data);
      toast.success('Profil akun berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui profil akun'),
  });

  // --- Password form ---
  const [showPasswords, setShowPasswords] = useState(false);
  const passwordForm = useForm({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: {
      current_password: string;
      password: string;
      password_confirmation: string;
    }) => {
      const res = await api.put('/auth/password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password berhasil diubah');
      passwordForm.reset();
    },
    onError: () =>
      toast.error('Gagal mengubah password. Pastikan password lama benar.'),
  });


  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
          Account Management
        </p>
        <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Settings</h1>
        <p className="mt-1 text-sm text-[#3f4944]">
          Manage your profile and account security
        </p>
      </div>

      {/* User Profile */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#a6f2d1]">
            <User className="size-5 text-[#004532]" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-[#191c1e]">Account Profile</h2>
            <p className="text-xs text-[#3f4944]/60">Your personal account information</p>
          </div>
        </div>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit((data) =>
                profileMutation.mutate(data)
              )}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
              >
                {profileMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Save Profile
              </button>
            </form>
          </Form>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#ffdad6]">
            <Lock className="size-5 text-[#652925]" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-[#191c1e]">Security Password</h2>
            <p className="text-xs text-[#3f4944]/60">Ensure your password is strong and unique</p>
          </div>
        </div>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit((data) =>
                passwordMutation.mutate(data)
              )}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Lama</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          placeholder="Masukkan password lama"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru</FormLabel>
                      <FormControl>
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          placeholder="Minimal 8 karakter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          placeholder="Ulangi password baru"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
              >
                {passwordMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Update Password
              </button>
            </form>
          </Form>
      </div>

      {/* Tenant Profile */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#a6f2d1]">
            <Building2 className="size-5 text-[#004532]" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-[#191c1e]">Organization Profile</h2>
            <p className="text-xs text-[#3f4944]/60">Basic information about your mosque</p>
          </div>
        </div>
          {loadingTenant ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <Form {...tenantForm}>
              <form
                onSubmit={tenantForm.handleSubmit((data) =>
                  tenantMutation.mutate(data)
                )}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={tenantForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Organisasi</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tenantForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tenantForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tenantForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tenantForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={tenantForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={tenantMutation.isPending}
                  className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
                >
                  {tenantMutation.isPending && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Save Organization
                </button>
              </form>
            </Form>
          )}
      </div>
    </div>
  );
}
