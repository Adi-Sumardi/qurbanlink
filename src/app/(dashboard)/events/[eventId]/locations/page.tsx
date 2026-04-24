'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { locationService } from '@/services/location.service';
import { usePermissions } from '@/hooks/use-permissions';
import type { DistributionLocation } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Nama lokasi wajib diisi').max(255),
  address: z.string().max(500).optional().or(z.literal('')),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function LocationsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { isViewer, isOperator } = usePermissions();
  const canEdit = !isViewer && !isOperator;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DistributionLocation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DistributionLocation | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['locations', eventId],
    queryFn: () => locationService.getAll(eventId),
    enabled: !!eventId,
  });

  const locations: DistributionLocation[] = data?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '', is_active: true },
  });

  function openAdd() {
    form.reset({ name: '', address: '', is_active: true });
    setEditTarget(null);
    setDialogOpen(true);
  }

  function openEdit(loc: DistributionLocation) {
    form.reset({
      name: loc.name,
      address: loc.address ?? '',
      is_active: loc.is_active,
    });
    setEditTarget(loc);
    setDialogOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = { name: values.name, address: values.address || undefined, is_active: values.is_active };
      return editTarget
        ? locationService.update(eventId, editTarget.id, payload)
        : locationService.create(eventId, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations', eventId] });
      setDialogOpen(false);
      toast.success(editTarget ? 'Lokasi berhasil diperbarui' : 'Lokasi berhasil ditambahkan');
    },
    onError: () => toast.error('Gagal menyimpan lokasi'),
  });

  const deleteMutation = useMutation({
    mutationFn: (loc: DistributionLocation) => locationService.delete(eventId, loc.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['locations', eventId] });
      setDeleteTarget(null);
      toast.success('Lokasi berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus lokasi'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <p className="mb-0.5 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
              Manajemen Event
            </p>
            <h1 className="font-headline text-2xl font-extrabold text-[#191c1e] md:text-3xl">
              Lokasi Distribusi
            </h1>
            <p className="mt-0.5 text-sm text-[#3f4944]">
              Kelola titik-titik distribusi untuk event ini
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-[#004532] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95 whitespace-nowrap"
          >
            <Plus className="size-4" />
            Tambah Lokasi
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white editorial-shadow overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-[#a6f2d1] mb-5">
              <MapPin className="size-10 text-[#004532]" />
            </div>
            <h3 className="font-headline text-xl font-bold text-[#191c1e]">
              Belum Ada Lokasi Distribusi
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[#3f4944]">
              Tambahkan lokasi distribusi terlebih dahulu sebelum melanjutkan ke proses distribusi kupon. Lokasi digunakan untuk mengelompokkan titik pembagian hewan kurban.
            </p>
            {canEdit && (
              <Button
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#004532] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95"
              >
                <Plus className="size-4" />
                Tambah Lokasi Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[rgba(190,201,194,0.2)]">
            {/* Table header */}
            <div className="hidden md:grid md:grid-cols-[1fr_200px_100px_80px] items-center gap-4 px-6 py-3 bg-[#f8faf9]">
              {['NAMA LOKASI', 'ALAMAT', 'STATUS', 'AKSI'].map((h) => (
                <p key={h} className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/50">
                  {h}
                </p>
              ))}
            </div>

            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#f8faf9] md:grid md:grid-cols-[1fr_200px_100px_80px] md:items-center md:gap-4 md:px-6"
              >
                {/* Name + icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a6f2d1]">
                    <MapPin className="size-5 text-[#004532]" />
                  </div>
                  <p className="truncate text-sm font-semibold text-[#191c1e]">{loc.name}</p>
                </div>

                {/* Address */}
                <p className="truncate text-sm text-[#3f4944] md:block">
                  {loc.address || <span className="text-[#3f4944]/40">—</span>}
                </p>

                {/* Status badge */}
                <div>
                  {loc.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="size-3" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                      <XCircle className="size-3" />
                      Nonaktif
                    </span>
                  )}
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center gap-1 md:justify-end">
                    <button
                      onClick={() => openEdit(loc)}
                      className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-[#eceef0] hover:text-[#004532]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(loc)}
                      className="flex size-8 items-center justify-center rounded-lg text-[#3f4944] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Lokasi' : 'Tambah Lokasi Distribusi'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lokasi <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Masjid An-Nur, RW 03" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jl. Mawar No. 5, Kelurahan ..."
                        rows={3}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-[rgba(190,201,194,0.3)] p-4">
                    <div>
                      <FormLabel className="text-sm font-semibold">Lokasi Aktif</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Lokasi nonaktif tidak muncul saat scan kupon
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                  {editTarget ? 'Simpan Perubahan' : 'Tambah Lokasi'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lokasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Lokasi <strong>{deleteTarget?.name}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
