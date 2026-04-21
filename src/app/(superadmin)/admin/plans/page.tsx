'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  Loader2,
  Pencil,
  Check,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { adminService } from '@/services/admin.service';
import { formatCurrency, formatNumber } from '@/lib/format';
import { SUBSCRIPTION_PLAN_LABELS } from '@/lib/constants';
import { toast } from 'sonner';

interface PlanConfig {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  coupon_quota: number;
  features: Record<string, boolean>;
  is_active: boolean;
  sort_order: number;
}

interface PlanFormValues {
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  coupon_quota: number;
  features: Record<string, boolean>;
  is_active: boolean;
  sort_order: number;
}

const FEATURE_LABELS: Record<string, string> = {
  qr_code: 'QR Code Scan',
  manual_scan: 'Manual Scan',
  live_dashboard: 'Live Dashboard',
  export_pdf: 'Export PDF',
  export_excel: 'Export Excel',
  custom_branding: 'Custom Branding',
  email_notifications: 'Notifikasi Email',
  api_access: 'Akses API',
  priority_support: 'Priority Support',
};

const ALL_FEATURES = Object.keys(FEATURE_LABELS);

const EMPTY_FORM: PlanFormValues = {
  name: '',
  slug: '',
  price_monthly: 0,
  price_yearly: 0,
  coupon_quota: 500,
  features: Object.fromEntries(ALL_FEATURES.map((k) => [k, false])),
  is_active: true,
  sort_order: 99,
};

/* ─── Shared Form Dialog ─────────────────────────────────────── */

function PlanFormDialog({
  open,
  onOpenChange,
  title,
  description,
  defaultValues,
  onSubmit,
  isPending,
  isEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  defaultValues: PlanFormValues;
  onSubmit: (data: PlanFormValues) => void;
  isPending: boolean;
  isEdit: boolean;
}) {
  const form = useForm<PlanFormValues>({ defaultValues });

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) form.reset(defaultValues);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Paket</FormLabel>
                    <FormControl><Input placeholder="Professional" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                rules={{
                  required: 'Wajib diisi',
                  pattern: { value: /^[a-z0-9-]+$/, message: 'Huruf kecil, angka, tanda hubung' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="professional"
                        {...field}
                        readOnly={isEdit}
                        className={isEdit ? 'opacity-60 cursor-not-allowed' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price_monthly" render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Bulanan (Rp)</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="price_yearly" render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Tahunan (Rp)</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Coupon Quota & Sort */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="coupon_quota" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuota Kupon</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sort_order" render={({ field }) => (
                <FormItem>
                  <FormLabel>Urutan Tampil</FormLabel>
                  <FormControl><Input type="number" min={0} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Features */}
            <div>
              <p className="mb-3 text-sm font-medium">Fitur yang Tersedia</p>
              <div className="space-y-3 rounded-xl border p-4">
                {ALL_FEATURES.map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`features.${key}` as `features.${string}`}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0">
                        <FormLabel className="cursor-pointer text-sm font-normal">
                          {FEATURE_LABELS[key]}
                        </FormLabel>
                        <FormControl>
                          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border px-4 py-3 space-y-0">
                <div className="flex items-center gap-2">
                  {field.value
                    ? <ToggleRight className="size-5 text-emerald-600" />
                    : <ToggleLeft className="size-5 text-muted-foreground" />}
                  <FormLabel className="cursor-pointer font-medium">Paket Aktif</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {isEdit ? 'Simpan' : 'Buat Paket'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function AdminPlansPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<PlanConfig | null>(null);

  const { data: plansRes, isLoading } = useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => adminService.getPlans(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
    queryClient.invalidateQueries({ queryKey: ['subscription', 'plans'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: PlanFormValues) => adminService.createPlan(data as never),
    onSuccess: () => { toast.success('Paket berhasil dibuat'); invalidate(); setShowCreate(false); },
    onError: () => toast.error('Gagal membuat paket'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlanFormValues }) =>
      adminService.updatePlan(id, data),
    onSuccess: () => { toast.success('Paket berhasil diperbarui'); invalidate(); setEditingPlan(null); },
    onError: () => toast.error('Gagal memperbarui paket'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deletePlan(id),
    onSuccess: () => { toast.success('Paket berhasil dihapus'); invalidate(); setDeletingPlan(null); },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Gagal menghapus paket');
      setDeletingPlan(null);
    },
  });

  function extractPlans(raw: unknown): PlanConfig[] {
    if (Array.isArray(raw)) return raw as PlanConfig[];
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r?.data)) return r.data as PlanConfig[];
    return [];
  }

  const plans = extractPlans(plansRes);

  function planToForm(plan: PlanConfig): PlanFormValues {
    const features: Record<string, boolean> = {};
    ALL_FEATURES.forEach((key) => { features[key] = plan.features?.[key] ?? false; });
    return {
      name: plan.name, slug: plan.slug,
      price_monthly: plan.price_monthly, price_yearly: plan.price_yearly,
      coupon_quota: plan.coupon_quota, features,
      is_active: plan.is_active, sort_order: plan.sort_order,
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Paket Langganan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            CRUD paket — perubahan langsung tampil di landing page dan halaman tenant
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="size-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Plan Cards */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-20 text-center text-muted-foreground">
          <p className="font-medium">Belum ada paket terdaftar</p>
          <Button variant="outline" onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="size-4" />Tambah Paket Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => {
            const enabled = ALL_FEATURES.filter((k) => plan.features?.[k]).length;
            return (
              <Card key={plan.id} className={`relative ${!plan.is_active ? 'opacity-60' : ''}`}>
                {!plan.is_active && (
                  <div className="absolute right-3 top-3">
                    <Badge variant="outline" className="text-[10px]">Nonaktif</Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {SUBSCRIPTION_PLAN_LABELS[plan.slug] || plan.name}
                  </CardTitle>
                  <p className="font-mono text-xs text-muted-foreground">{plan.slug}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-muted/50 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground">Bulanan</p>
                      <p className="text-sm font-bold">
                        {plan.price_monthly === 0 ? 'Gratis' : formatCurrency(plan.price_monthly)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground">Tahunan</p>
                      <p className="text-sm font-bold">
                        {plan.price_yearly === 0 ? 'Gratis' : formatCurrency(plan.price_yearly)}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/50 px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">Kuota Kupon</p>
                    <p className="text-sm font-bold">
                      {plan.coupon_quota === 0 ? 'Unlimited' : formatNumber(plan.coupon_quota)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Fitur ({enabled}/{ALL_FEATURES.length} aktif)
                    </p>
                    <div className="space-y-1">
                      {ALL_FEATURES.map((key) => {
                        const on = plan.features?.[key] ?? false;
                        return (
                          <div key={key} className={`flex items-center gap-2 text-xs ${on ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                            {on ? <Check className="size-3 shrink-0 text-emerald-600" /> : <X className="size-3 shrink-0" />}
                            {FEATURE_LABELS[key]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => setEditingPlan(plan)}>
                      <Pencil className="size-3.5" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeletingPlan(plan)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <PlanFormDialog
        open={showCreate} onOpenChange={setShowCreate}
        title="Tambah Paket Baru"
        description="Buat paket langganan baru dengan harga dan fitur yang dikustomisasi."
        defaultValues={EMPTY_FORM}
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
        isEdit={false}
      />

      {/* Edit Dialog */}
      <PlanFormDialog
        open={!!editingPlan}
        onOpenChange={(open) => { if (!open) setEditingPlan(null); }}
        title={`Edit — ${SUBSCRIPTION_PLAN_LABELS[editingPlan?.slug ?? ''] || editingPlan?.name || ''}`}
        description="Perubahan langsung tampil di landing page dan halaman langganan tenant."
        defaultValues={editingPlan ? planToForm(editingPlan) : EMPTY_FORM}
        onSubmit={(data) => editingPlan && updateMutation.mutate({ id: editingPlan.id, data })}
        isPending={updateMutation.isPending}
        isEdit={true}
      />

      {/* Delete Confirm */}
      <Dialog open={!!deletingPlan} onOpenChange={(open) => { if (!open) setDeletingPlan(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Paket</DialogTitle>
            <DialogDescription>
              Hapus paket <strong>{SUBSCRIPTION_PLAN_LABELS[deletingPlan?.slug ?? ''] || deletingPlan?.name}</strong>?
              Tindakan ini tidak bisa dibatalkan. Paket yang masih digunakan tenant aktif tidak bisa dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingPlan(null)}>Batal</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deletingPlan && deleteMutation.mutate(deletingPlan.id)}
              className="gap-2"
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Hapus Paket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
