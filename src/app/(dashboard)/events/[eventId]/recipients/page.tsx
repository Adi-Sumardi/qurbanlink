'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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
  Download,
  Loader2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { EmptyState } from '@/components/common/empty-state';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { recipientService } from '@/services/recipient.service';
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { formatNumber } from '@/lib/format';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import {
  recipientSchema,
  type RecipientFormValues,
} from '@/lib/validations/recipient';
import type { QueryParams, Recipient } from '@/types';

export default function RecipientsPage() {
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
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null
  );
  const [deleteRecipientId, setDeleteRecipientId] = useState<string | null>(
    null
  );

  // Fetch event to get category options from settings
  const { data: eventData } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => eventService.getById(eventId),
    enabled: !!eventId,
  });

  const categories = useMemo(() => {
    const cats = eventData?.data?.settings?.categories;
    if (Array.isArray(cats)) {
      return cats as { key: string; label: string; quota?: number }[];
    }
    return [];
  }, [eventData]);

  // Fetch recipients
  const { data, isLoading } = useQuery({
    queryKey: ['recipients', eventId, params],
    queryFn: () => recipientService.getAll(eventId, params),
    enabled: !!eventId,
  });

  const recipients = data?.data ?? [];
  const meta = data?.meta;

  // Form
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: '',
      nik: '',
      phone: '',
      address: '',
      rt_rw: '',
      kelurahan: '',
      kecamatan: '',
      category: '',
      portions: 1,
      notes: '',
    },
  });

  // Create recipient
  const createMutation = useMutation({
    mutationFn: (data: RecipientFormValues) =>
      recipientService.create(eventId, data),
    onSuccess: () => {
      toast.success('Penerima berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['recipients', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal menambahkan penerima');
    },
  });

  // Update recipient
  const updateMutation = useMutation({
    mutationFn: (data: RecipientFormValues) =>
      recipientService.update(eventId, editingRecipient!.id, data),
    onSuccess: () => {
      toast.success('Penerima berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['recipients', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal memperbarui penerima');
    },
  });

  // Delete recipient
  const deleteMutation = useMutation({
    mutationFn: (recipientId: string) =>
      recipientService.delete(eventId, recipientId),
    onSuccess: () => {
      toast.success('Penerima berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['recipients', eventId] });
      setDeleteRecipientId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus penerima');
    },
  });

  // Import recipients
  const importMutation = useMutation({
    mutationFn: (file: File) => recipientService.import(eventId, file),
    onSuccess: (result) => {
      const imported = result.data?.imported ?? 0;
      toast.success(`${imported} penerima berhasil diimpor`);
      queryClient.invalidateQueries({ queryKey: ['recipients', eventId] });
      if (result.data?.errors?.length) {
        toast.error(`${result.data.errors.length} baris gagal diimpor`);
      }
    },
    onError: () => {
      toast.error('Gagal mengimpor penerima');
    },
  });

  // Export recipients
  const exportMutation = useMutation({
    mutationFn: () => recipientService.export(eventId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `penerima-${eventId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Data penerima berhasil diekspor');
    },
    onError: () => {
      toast.error('Gagal mengekspor data penerima');
    },
  });

  function openAddDialog() {
    setEditingRecipient(null);
    form.reset({
      name: '',
      nik: '',
      phone: '',
      address: '',
      rt_rw: '',
      kelurahan: '',
      kecamatan: '',
      category: '',
      portions: 1,
      notes: '',
    });
    setDialogOpen(true);
  }

  function openEditDialog(recipient: Recipient) {
    setEditingRecipient(recipient);
    form.reset({
      name: recipient.name,
      nik: recipient.nik ?? '',
      phone: recipient.phone ?? '',
      address: recipient.address ?? '',
      rt_rw: recipient.rt_rw ?? '',
      kelurahan: recipient.kelurahan ?? '',
      kecamatan: recipient.kecamatan ?? '',
      category: recipient.category ?? '',
      portions: recipient.portions ?? 1,
      notes: recipient.notes ?? '',
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingRecipient(null);
    form.reset();
  }

  function onSubmit(data: RecipientFormValues) {
    if (editingRecipient) {
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
            <h1 className="text-2xl font-bold">Daftar Penerima</h1>
            <p className="text-muted-foreground">
              Kelola data penerima untuk event ini
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Download className="mr-2 size-4" />
              )}
              Ekspor
            </Button>
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
              Tambah Penerima
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Penerima</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari penerima..."
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
          ) : recipients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Belum ada penerima"
              description={!canEdit && mounted ? 'Belum ada data penerima' : 'Tambahkan penerima baru atau impor dari file'}
              actionLabel={!canEdit && mounted ? undefined : 'Tambah Penerima'}
              onAction={!canEdit && mounted ? undefined : openAddDialog}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Porsi</TableHead>
                      {canEdit && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell className="font-medium">
                          {recipient.name}
                        </TableCell>
                        <TableCell>{recipient.nik || '-'}</TableCell>
                        <TableCell>{recipient.phone || '-'}</TableCell>
                        <TableCell className="capitalize">
                          {categories.find((c) => c.key === recipient.category)?.label || recipient.category || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(recipient.portions)}
                        </TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(recipient)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeleteRecipientId(recipient.id)
                                }
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRecipient ? 'Edit Penerima' : 'Tambah Penerima'}
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
                      <Input placeholder="Nama penerima" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nomor Induk Kependudukan"
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
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="08xxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat penerima" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="rt_rw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RT/RW</FormLabel>
                      <FormControl>
                        <Input placeholder="001/002" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kelurahan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelurahan</FormLabel>
                      <FormControl>
                        <Input placeholder="Kelurahan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kecamatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Kecamatan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.key} value={cat.key}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="portions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Porsi</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber || 1)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  {editingRecipient ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteRecipientId}
        onOpenChange={(open) => !open && setDeleteRecipientId(null)}
        title="Hapus Penerima"
        description="Apakah Anda yakin ingin menghapus penerima ini? Kupon yang terkait juga akan terhapus."
        confirmLabel="Ya, hapus"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteRecipientId) {
            deleteMutation.mutate(deleteRecipientId);
          }
        }}
      />
    </div>
  );
}
