'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Pencil,
  Play,
  CheckCircle,
  MapPin,
  Ticket,
  Users,
  HandCoins,
  Plus,
  Trash2,
  Loader2,
  PawPrint,
  QrCode,
  MonitorPlay,
  ScanLine,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { eventService } from '@/services/event.service';
import { locationService } from '@/services/location.service';
import { usePermissions } from '@/hooks/use-permissions';
import { formatDate, formatNumber } from '@/lib/format';
import { EVENT_STATUS_LABELS } from '@/lib/constants';
import { locationSchema, type LocationFormValues } from '@/lib/validations/event';
import type { DistributionLocation, EventStatus } from '@/types';

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isViewer, isOperator } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canEdit = mounted && !isViewer && !isOperator;

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DistributionLocation | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);

  // Fetch event
  const {
    data: eventData,
    isLoading: eventLoading,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getById(eventId),
    enabled: !!eventId,
  });

  const event = eventData?.data;

  // Fetch locations
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', eventId],
    queryFn: () => locationService.getAll(eventId),
    enabled: !!eventId,
  });

  const locations = locationsData?.data ?? [];

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: () => eventService.activate(eventId),
    onSuccess: () => {
      toast.success('Event berhasil diaktifkan');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: () => {
      toast.error('Gagal mengaktifkan event');
    },
  });

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: () => eventService.complete(eventId),
    onSuccess: () => {
      toast.success('Event berhasil diselesaikan');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: () => {
      toast.error('Gagal menyelesaikan event');
    },
  });

  // Location form
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      is_active: true,
    },
  });

  // Create location
  const createLocationMutation = useMutation({
    mutationFn: (data: LocationFormValues) =>
      locationService.create(eventId, data),
    onSuccess: () => {
      toast.success('Lokasi berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['locations', eventId] });
      closeLocationDialog();
    },
    onError: () => {
      toast.error('Gagal menambahkan lokasi');
    },
  });

  // Update location
  const updateLocationMutation = useMutation({
    mutationFn: (data: LocationFormValues) =>
      locationService.update(eventId, editingLocation!.id, data),
    onSuccess: () => {
      toast.success('Lokasi berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['locations', eventId] });
      closeLocationDialog();
    },
    onError: () => {
      toast.error('Gagal memperbarui lokasi');
    },
  });

  // Delete location
  const deleteLocationMutation = useMutation({
    mutationFn: (locationId: string) =>
      locationService.delete(eventId, locationId),
    onSuccess: () => {
      toast.success('Lokasi berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['locations', eventId] });
      setDeleteLocationId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus lokasi');
    },
  });

  function openAddLocation() {
    setEditingLocation(null);
    locationForm.reset({ name: '', address: '', is_active: true });
    setLocationDialogOpen(true);
  }

  function openEditLocation(location: DistributionLocation) {
    setEditingLocation(location);
    locationForm.reset({
      name: location.name,
      address: location.address ?? '',
      latitude: location.latitude ?? undefined,
      longitude: location.longitude ?? undefined,
      is_active: location.is_active,
    });
    setLocationDialogOpen(true);
  }

  function closeLocationDialog() {
    setLocationDialogOpen(false);
    setEditingLocation(null);
    locationForm.reset();
  }

  function onLocationSubmit(data: LocationFormValues) {
    if (editingLocation) {
      updateLocationMutation.mutate(data);
    } else {
      createLocationMutation.mutate(data);
    }
  }

  const locationSaving =
    createLocationMutation.isPending || updateLocationMutation.isPending;

  if (eventLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <EmptyState
        icon={Ticket}
        title="Event tidak ditemukan"
        description="Event yang Anda cari tidak tersedia"
        actionLabel="Kembali ke Daftar Event"
        onAction={() => router.push('/events')}
      />
    );
  }

  const canActivate = event.status === ('draft' as EventStatus);
  const canComplete =
    event.status === ('active' as EventStatus) ||
    event.status === ('ongoing' as EventStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/events">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{event.name}</h1>
              <StatusBadge
                status={event.status}
                label={EVENT_STATUS_LABELS[event.status]}
              />
            </div>
            <p className="text-muted-foreground">
              {event.description || 'Tidak ada deskripsi'}
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            {canActivate && (
              <Button
                onClick={() => activateMutation.mutate()}
                disabled={activateMutation.isPending}
              >
                {activateMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Play className="mr-2 size-4" />
                )}
                Aktifkan
              </Button>
            )}
            {canComplete && (
              <Button
                variant="outline"
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 size-4" />
                )}
                Selesaikan
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/events/${eventId}/edit`}>
                <Pencil className="mr-2 size-4" />
                Edit
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Event Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="font-medium">{formatDate(event.event_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Waktu</p>
              <p className="font-medium">
                {event.start_time && event.end_time
                  ? `${event.start_time} - ${event.end_time}`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tahun</p>
              <p className="font-medium">{event.year || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dibuat</p>
              <p className="font-medium">{formatDate(event.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="ringkasan">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="ringkasan" className="flex-1 sm:flex-none">Ringkasan</TabsTrigger>
          <TabsTrigger value="lokasi" className="flex-1 sm:flex-none">Lokasi</TabsTrigger>
          <TabsTrigger value="navigasi" className="flex-1 sm:flex-none">Navigasi</TabsTrigger>
        </TabsList>

        {/* Ringkasan Tab */}
        <TabsContent value="ringkasan" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <Ticket className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Kupon</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(event.total_coupons)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-50 p-2.5">
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terdistribusi</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(event.distributed)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-amber-50 p-2.5">
                    <MapPin className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi Distribusi</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(locations.length)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lokasi Tab */}
        <TabsContent value="lokasi" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lokasi Distribusi</CardTitle>
                {canEdit && (
                  <Button size="sm" onClick={openAddLocation}>
                    <Plus className="mr-2 size-4" />
                    Tambah Lokasi
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {locationsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title="Belum ada lokasi"
                  description={!canEdit && mounted ? 'Belum ada lokasi distribusi' : 'Tambahkan lokasi distribusi untuk event ini'}
                  actionLabel={!canEdit && mounted ? undefined : 'Tambah Lokasi'}
                  onAction={!canEdit && mounted ? undefined : openAddLocation}
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Lokasi</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Status</TableHead>
                        {canEdit && <TableHead className="text-right">Aksi</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">
                            {location.name}
                          </TableCell>
                          <TableCell>{location.address || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                location.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-500'
                              }
                            >
                              {location.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                          </TableCell>
                          {canEdit && (
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditLocation(location)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteLocationId(location.id)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigasi Tab */}
        <TabsContent value="navigasi" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <Link href={`/events/${eventId}/donors`}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-purple-50 p-3">
                    <HandCoins className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Donatur</p>
                    <p className="text-sm text-muted-foreground">
                      Kelola data donatur
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link href={`/events/${eventId}/animals`}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-orange-50 p-3">
                    <PawPrint className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Hewan Kurban</p>
                    <p className="text-sm text-muted-foreground">
                      Kelola data hewan kurban
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link href={`/events/${eventId}/recipients`}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-teal-50 p-3">
                    <Users className="size-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">Penerima</p>
                    <p className="text-sm text-muted-foreground">
                      Kelola data penerima
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link href={`/events/${eventId}/coupons`}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <QrCode className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Kupon</p>
                    <p className="text-sm text-muted-foreground">
                      Generate & kelola kupon QR
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link
                href={event.tenant_slug && event.slug ? `/live/${event.tenant_slug}/${event.slug}` : `/events/${eventId}/live-dashboard`}
                target="_blank"
              >
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <MonitorPlay className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Live Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      Pantau distribusi real-time
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link href="/scan">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-lg bg-rose-50 p-3">
                    <ScanLine className="size-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium">Scan QR</p>
                    <p className="text-sm text-muted-foreground">
                      Scan kupon untuk distribusi
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}
            </DialogTitle>
          </DialogHeader>
          <Form {...locationForm}>
            <form
              onSubmit={locationForm.handleSubmit(onLocationSubmit)}
              className="space-y-4"
            >
              <FormField
                control={locationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lokasi *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Masjid Al-Ikhlas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={locationForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat lokasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 grid-cols-2">
                <FormField
                  control={locationForm.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="-6.2088"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={locationForm.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="106.8456"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeLocationDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={locationSaving}>
                  {locationSaving && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  {editingLocation ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Location Confirmation */}
      <ConfirmDialog
        open={!!deleteLocationId}
        onOpenChange={(open) => !open && setDeleteLocationId(null)}
        title="Hapus Lokasi"
        description="Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, hapus"
        variant="destructive"
        loading={deleteLocationMutation.isPending}
        onConfirm={() => {
          if (deleteLocationId) {
            deleteLocationMutation.mutate(deleteLocationId);
          }
        }}
      />
    </div>
  );
}
