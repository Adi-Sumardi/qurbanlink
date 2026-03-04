'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { eventSchema, type EventFormValues } from '@/lib/validations/event';

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isViewer, isOperator } = usePermissions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (isViewer || isOperator) router.replace(`/events/${eventId}`);
  }, [isViewer, isOperator, router, eventId]);

  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getById(eventId),
    enabled: !!eventId,
  });

  const event = eventData?.data;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      year: new Date().getFullYear(),
    },
  });

  // Populate form when event data loads
  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name,
        description: event.description ?? '',
        event_date: event.event_date ?? '',
        start_time: event.start_time ?? '',
        end_time: event.end_time ?? '',
        year: typeof event.year === 'string' ? parseInt(event.year) : event.year,
      });
    }
  }, [event, form]);

  const updateMutation = useMutation({
    mutationFn: (data: EventFormValues) => eventService.update(eventId, data),
    onSuccess: () => {
      toast.success('Event berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push(`/events/${eventId}`);
    },
    onError: () => {
      toast.error('Gagal memperbarui event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventService.delete(eventId),
    onSuccess: () => {
      toast.success('Event berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push('/events');
    },
    onError: () => {
      toast.error('Gagal menghapus event');
    },
  });

  function onSubmit(data: EventFormValues) {
    updateMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-96 max-w-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Event tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/events">Kembali ke Daftar Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/events/${eventId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-muted-foreground">{event.name}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Event</CardTitle>
          <CardDescription>
            Perbarui data event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Event *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Kurban Idul Adha 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deskripsi singkat tentang event"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Event</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2026" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Mulai</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Selesai</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Hapus
                </Button>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/events/${eventId}`}>Batal</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Event"
        description="Apakah Anda yakin ingin menghapus event ini? Semua data terkait termasuk donatur, hewan, penerima, dan kupon akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, hapus event"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
