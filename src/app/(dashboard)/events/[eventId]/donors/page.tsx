'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  HandCoins,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { donorService } from '@/services/donor.service';
import { usePermissions } from '@/hooks/use-permissions';
import { DONOR_STATUS_LABELS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { donorSchema, type DonorFormValues } from '@/lib/validations/donor';
import type { QueryParams, Donor } from '@/types';

export default function DonorsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isViewer, isOperator } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canEdit = mounted && !isViewer && !isOperator;

  const [params, setParams] = useState<QueryParams>({
    page: 1,
    per_page: DEFAULT_PAGE_SIZE,
    search: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [deleteDonorId, setDeleteDonorId] = useState<string | null>(null);

  // Fetch donors
  const { data, isLoading } = useQuery({
    queryKey: ['donors', eventId, params],
    queryFn: () => donorService.getAll(eventId, params),
    enabled: !!eventId,
  });

  const donors = data?.data ?? [];
  const meta = data?.meta;

  // Form
  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      nik: '',
      notes: '',
    },
  });

  // Create donor
  const createMutation = useMutation({
    mutationFn: (data: DonorFormValues) => donorService.create(eventId, data),
    onSuccess: () => {
      toast.success('Donatur berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal menambahkan donatur');
    },
  });

  // Update donor
  const updateMutation = useMutation({
    mutationFn: (data: DonorFormValues) =>
      donorService.update(eventId, editingDonor!.id, data),
    onSuccess: () => {
      toast.success('Donatur berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal memperbarui donatur');
    },
  });

  // Delete donor
  const deleteMutation = useMutation({
    mutationFn: (donorId: string) => donorService.delete(eventId, donorId),
    onSuccess: () => {
      toast.success('Donatur berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      setDeleteDonorId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus donatur');
    },
  });

  // Import donors
  const importMutation = useMutation({
    mutationFn: (file: File) => donorService.import(eventId, file),
    onSuccess: (result) => {
      const imported = result.data?.imported ?? 0;
      toast.success(`${imported} donatur berhasil diimpor`);
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      if (result.data?.errors?.length) {
        toast.error(`${result.data.errors.length} baris gagal diimpor`);
      }
    },
    onError: () => {
      toast.error('Gagal mengimpor donatur');
    },
  });

  function openAddDialog() {
    setEditingDonor(null);
    form.reset({
      name: '',
      phone: '',
      email: '',
      address: '',
      nik: '',
      notes: '',
    });
    setDialogOpen(true);
  }

  function openEditDialog(donor: Donor) {
    setEditingDonor(donor);
    form.reset({
      name: donor.name,
      phone: donor.phone ?? '',
      email: donor.email ?? '',
      address: donor.address ?? '',
      nik: donor.nik ?? '',
      notes: donor.notes ?? '',
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingDonor(null);
    form.reset();
  }

  function onSubmit(data: DonorFormValues) {
    if (editingDonor) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      importMutation.mutate(file);
      e.target.value = '';
    }
  }

  function handleSearch(value: string) {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  }

  function handlePageChange(page: number) {
    setParams((prev) => ({ ...prev, page }));
  }

  function handlePageSizeChange(size: number) {
    setParams((prev) => ({ ...prev, per_page: size, page: 1 }));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/events/${eventId}`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Daftar Donatur</h1>
            <p className="text-muted-foreground">
              Kelola data donatur untuk event ini
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              variant="outline"
              onClick={handleImport}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 size-4" />
              )}
              Impor
            </Button>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 size-4" />
              Tambah Donatur
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Donatur</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari donatur..."
                className="pl-9"
                value={params.search ?? ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : donors.length === 0 ? (
            <EmptyState
              icon={HandCoins}
              title="Belum ada donatur"
              description={!canEdit && mounted ? 'Belum ada data donatur' : 'Tambahkan donatur baru atau impor dari file'}
              actionLabel={!canEdit && mounted ? undefined : 'Tambah Donatur'}
              onAction={!canEdit && mounted ? undefined : openAddDialog}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead className="text-center">Hewan</TableHead>
                      <TableHead>Status</TableHead>
                      {canEdit && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">
                          {donor.name}
                        </TableCell>
                        <TableCell>{donor.phone || '-'}</TableCell>
                        <TableCell className="text-center">
                          {donor.animals_count ?? 0}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={donor.submission_status}
                            label={
                              DONOR_STATUS_LABELS[donor.submission_status]
                            }
                          />
                        </TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(donor)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteDonorId(donor.id)}
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta && (
                <div className="mt-4">
                  <DataTablePagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDonor ? 'Edit Donatur' : 'Tambah Donatur'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama donatur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" {...field} />
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
                          placeholder="email@contoh.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Kependudukan" {...field} />
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
                      <Input placeholder="Alamat donatur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Catatan tambahan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  {editingDonor ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteDonorId}
        onOpenChange={(open) => !open && setDeleteDonorId(null)}
        title="Hapus Donatur"
        description="Apakah Anda yakin ingin menghapus donatur ini? Data hewan yang terkait juga akan terhapus."
        confirmLabel="Ya, hapus"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteDonorId) {
            deleteMutation.mutate(deleteDonorId);
          }
        }}
      />
    </div>
  );
}
