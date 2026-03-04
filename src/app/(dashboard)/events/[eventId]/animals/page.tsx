'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
  PawPrint,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { animalService } from '@/services/animal.service';
import { donorService } from '@/services/donor.service';
import { usePermissions } from '@/hooks/use-permissions';
import { formatNumber } from '@/lib/format';
import {
  ANIMAL_STATUS_LABELS,
  ANIMAL_TYPE_LABELS,
  DEFAULT_PAGE_SIZE,
} from '@/lib/constants';
import { animalSchema, type AnimalFormValues } from '@/lib/validations/animal';
import type { QueryParams, Animal, AnimalStatus } from '@/types';

const ANIMAL_STATUS_FLOW: Record<string, string[]> = {
  registered: ['slaughtered'],
  slaughtered: ['processed'],
  processed: ['distributed'],
  distributed: [],
};

export default function AnimalsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
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
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [deleteAnimalId, setDeleteAnimalId] = useState<string | null>(null);
  const [statusDialogAnimal, setStatusDialogAnimal] = useState<Animal | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Fetch animals
  const { data, isLoading } = useQuery({
    queryKey: ['animals', eventId, params],
    queryFn: () => animalService.getAll(eventId, params),
    enabled: !!eventId,
  });

  const animals = data?.data ?? [];
  const meta = data?.meta;

  // Fetch donors for the select dropdown
  const { data: donorsData } = useQuery({
    queryKey: ['donors', eventId, { per_page: 100 }],
    queryFn: () => donorService.getAll(eventId, { per_page: 100 }),
    enabled: !!eventId,
  });

  const donors = donorsData?.data ?? [];

  // Form
  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      donor_id: '',
      type: '',
      breed: '',
      weight: 0,
      color: '',
      estimated_portions: 0,
      notes: '',
    },
  });

  // Create animal
  const createMutation = useMutation({
    mutationFn: (data: AnimalFormValues) => animalService.create(eventId, data),
    onSuccess: () => {
      toast.success('Hewan kurban berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['animals', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal menambahkan hewan kurban');
    },
  });

  // Update animal
  const updateMutation = useMutation({
    mutationFn: (data: AnimalFormValues) =>
      animalService.update(eventId, editingAnimal!.id, data),
    onSuccess: () => {
      toast.success('Hewan kurban berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['animals', eventId] });
      closeDialog();
    },
    onError: () => {
      toast.error('Gagal memperbarui hewan kurban');
    },
  });

  // Delete animal
  const deleteMutation = useMutation({
    mutationFn: (animalId: string) => animalService.delete(eventId, animalId),
    onSuccess: () => {
      toast.success('Hewan kurban berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['animals', eventId] });
      setDeleteAnimalId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus hewan kurban');
    },
  });

  // Update status
  const statusMutation = useMutation({
    mutationFn: ({ animalId, status }: { animalId: string; status: string }) =>
      animalService.updateStatus(eventId, animalId, { status }),
    onSuccess: () => {
      toast.success('Status hewan berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['animals', eventId] });
      setStatusDialogAnimal(null);
      setSelectedStatus('');
    },
    onError: () => {
      toast.error('Gagal memperbarui status hewan');
    },
  });

  function openAddDialog() {
    setEditingAnimal(null);
    form.reset({
      donor_id: '',
      type: '',
      breed: '',
      weight: 0,
      color: '',
      estimated_portions: 0,
      notes: '',
    });
    setDialogOpen(true);
  }

  function openEditDialog(animal: Animal) {
    setEditingAnimal(animal);
    form.reset({
      donor_id: animal.donor?.id ?? '',
      type: animal.type,
      breed: animal.breed ?? '',
      weight: animal.weight,
      color: animal.color ?? '',
      estimated_portions: animal.estimated_portions ?? 0,
      notes: animal.notes ?? '',
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingAnimal(null);
    form.reset();
  }

  function onSubmit(data: AnimalFormValues) {
    if (editingAnimal) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  function openStatusDialog(animal: Animal) {
    const nextStatuses = ANIMAL_STATUS_FLOW[animal.status] ?? [];
    if (nextStatuses.length === 0) {
      toast.info('Status hewan sudah final');
      return;
    }
    setStatusDialogAnimal(animal);
    setSelectedStatus(nextStatuses[0]);
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
            <h1 className="text-2xl font-bold">Daftar Hewan Kurban</h1>
            <p className="text-muted-foreground">
              Kelola data hewan kurban untuk event ini
            </p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Tambah Hewan
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Hewan Kurban</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari hewan..."
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
          ) : animals.length === 0 ? (
            <EmptyState
              icon={PawPrint}
              title="Belum ada hewan kurban"
              description={!canEdit && mounted ? 'Belum ada data hewan kurban' : 'Tambahkan data hewan kurban untuk event ini'}
              actionLabel={!canEdit && mounted ? undefined : 'Tambah Hewan'}
              onAction={!canEdit && mounted ? undefined : openAddDialog}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Ras/Breed</TableHead>
                      <TableHead className="text-right">Berat (kg)</TableHead>
                      <TableHead>Donatur</TableHead>
                      <TableHead>Status</TableHead>
                      {canEdit && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">
                          {ANIMAL_TYPE_LABELS[animal.type] || animal.type}
                        </TableCell>
                        <TableCell>{animal.breed || '-'}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(animal.weight)}
                        </TableCell>
                        <TableCell>{animal.donor?.name || '-'}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={animal.status}
                            label={ANIMAL_STATUS_LABELS[animal.status]}
                          />
                        </TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {(ANIMAL_STATUS_FLOW[animal.status]?.length ?? 0) >
                                0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openStatusDialog(animal)}
                                  title="Ubah Status"
                                >
                                  <RefreshCw className="size-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(animal)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteAnimalId(animal.id)}
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
              {editingAnimal ? 'Edit Hewan Kurban' : 'Tambah Hewan Kurban'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="donor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donatur *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih donatur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {donors.map((donor) => (
                          <SelectItem key={donor.id} value={donor.id}>
                            {donor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Hewan *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ANIMAL_TYPE_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ras/Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Brahman" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat (kg) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warna</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Coklat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimated_portions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi Porsi</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Jumlah porsi"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
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
                  {editingAnimal ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={!!statusDialogAnimal}
        onOpenChange={(open) => {
          if (!open) {
            setStatusDialogAnimal(null);
            setSelectedStatus('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Status Hewan</DialogTitle>
          </DialogHeader>
          {statusDialogAnimal && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Hewan</p>
                <p className="font-medium">
                  {ANIMAL_TYPE_LABELS[statusDialogAnimal.type] ||
                    statusDialogAnimal.type}{' '}
                  - {statusDialogAnimal.breed || 'Tidak ada ras'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status Saat Ini</p>
                <StatusBadge
                  status={statusDialogAnimal.status}
                  label={ANIMAL_STATUS_LABELS[statusDialogAnimal.status]}
                />
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Status Baru
                </p>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status baru" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      ANIMAL_STATUS_FLOW[statusDialogAnimal.status] ?? []
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {ANIMAL_STATUS_LABELS[status] || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusDialogAnimal(null);
                    setSelectedStatus('');
                  }}
                >
                  Batal
                </Button>
                <Button
                  disabled={!selectedStatus || statusMutation.isPending}
                  onClick={() => {
                    if (statusDialogAnimal && selectedStatus) {
                      statusMutation.mutate({
                        animalId: statusDialogAnimal.id,
                        status: selectedStatus,
                      });
                    }
                  }}
                >
                  {statusMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Ubah Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteAnimalId}
        onOpenChange={(open) => !open && setDeleteAnimalId(null)}
        title="Hapus Hewan Kurban"
        description="Apakah Anda yakin ingin menghapus data hewan kurban ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, hapus"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteAnimalId) {
            deleteMutation.mutate(deleteAnimalId);
          }
        }}
      />
    </div>
  );
}
