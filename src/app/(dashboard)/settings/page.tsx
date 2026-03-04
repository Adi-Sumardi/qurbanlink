'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  Building2,
  User,
  Lock,
  CreditCard,
  Check,
  X,
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
import { subscriptionService } from '@/services/subscription.service';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency, formatDate } from '@/lib/format';
import { SUBSCRIPTION_PLAN_LABELS } from '@/lib/constants';
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

  const { data: subscription, isLoading: loadingSub } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrent(),
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

  const sub = subscription?.data;
  const quotaUsed = sub ? sub.coupon_used : 0;
  const quotaTotal = sub ? sub.coupon_quota : 1;
  const quotaPct =
    quotaTotal > 0 ? Math.round((quotaUsed / quotaTotal) * 100) : 0;

  const features = (sub?.plan_details as Record<string, unknown>)?.features as
    | Record<string, boolean>
    | undefined;

  const FEATURE_LABELS: Record<string, string> = {
    qr_code: 'QR Code Scan',
    manual_scan: 'Manual Scan',
    live_dashboard: 'Live Dashboard',
    export_pdf: 'Export PDF',
    export_excel: 'Export Excel',
    custom_branding: 'Custom Branding',
    email_notifications: 'Notifikasi Email',
    api_access: 'API Access',
    priority_support: 'Priority Support',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola profil, akun, dan langganan organisasi
        </p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" />
            Profil Akun
          </CardTitle>
          <CardDescription>Informasi akun pengguna Anda</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button
                type="submit"
                size="sm"
                disabled={profileMutation.isPending}
              >
                {profileMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Simpan Profil
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4" />
            Ubah Password
          </CardTitle>
          <CardDescription>
            Pastikan password Anda kuat dan unik
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button
                type="submit"
                size="sm"
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Ubah Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Tenant Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Profil Organisasi
          </CardTitle>
          <CardDescription>Informasi dasar organisasi Anda</CardDescription>
        </CardHeader>
        <CardContent>
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
                <Button
                  type="submit"
                  size="sm"
                  disabled={tenantMutation.isPending}
                >
                  {tenantMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Simpan Organisasi
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="size-4" />
            Langganan
          </CardTitle>
          <CardDescription>Status langganan Anda saat ini</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSub ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : sub ? (
            <div className="space-y-5">
              {/* Plan & Status */}
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">
                  {SUBSCRIPTION_PLAN_LABELS[sub.plan] || sub.plan}
                </span>
                <StatusBadge status={sub.status} />
              </div>

              {/* Quota Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kuota Kupon</span>
                  <span className="font-medium">
                    {quotaUsed} / {quotaTotal} ({quotaPct}%)
                  </span>
                </div>
                <Progress value={quotaPct} className="h-2" />
              </div>

              {/* Plan Details Grid */}
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between rounded-lg border p-3">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-medium">
                    {formatCurrency(Number(sub.price))}
                    <span className="text-xs text-muted-foreground">
                      /{sub.billing_cycle === 'yearly' ? 'tahun' : 'bulan'}
                    </span>
                  </span>
                </div>
                {sub.starts_at && (
                  <div className="flex justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">Mulai</span>
                    <span className="font-medium">
                      {formatDate(sub.starts_at)}
                    </span>
                  </div>
                )}
                {sub.expires_at && (
                  <div className="flex justify-between rounded-lg border p-3">
                    <span className="text-muted-foreground">Berakhir</span>
                    <span className="font-medium">
                      {formatDate(sub.expires_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              {features && Object.keys(features).length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Fitur
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {Object.entries(features).map(([key, enabled]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-sm"
                      >
                        {enabled ? (
                          <Check className="size-4 text-green-500" />
                        ) : (
                          <X className="size-4 text-muted-foreground/40" />
                        )}
                        <span
                          className={
                            enabled ? '' : 'text-muted-foreground/60'
                          }
                        >
                          {FEATURE_LABELS[key] || key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tidak ada data langganan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
