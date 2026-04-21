'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { eventSchema, type EventFormValues } from '@/lib/validations/event';

export default function CreateEventPage() {
  const router = useRouter();
  const { isViewer, isOperator } = usePermissions();

  // Cek apakah sudah ada event — jika ya, redirect ke daftar event
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', { per_page: 1 }],
    queryFn: () => eventService.getAll({ per_page: 1 }),
  });

  useEffect(() => {
    if (isViewer || isOperator) {
      router.replace('/events');
      return;
    }
    if (!eventsLoading && (eventsData?.data?.length ?? 0) >= 1) {
      toast.info('Tenant hanya diizinkan memiliki 1 event');
      router.replace('/events');
    }
  }, [isViewer, isOperator, eventsLoading, eventsData, router]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: EventFormValues) => eventService.create(data),
    onSuccess: () => {
      toast.success('Event berhasil dibuat');
      router.push('/events');
    },
    onError: () => {
      toast.error('Gagal membuat event. Pastikan semua field terisi dengan benar.');
    },
  });

  function onSubmit(data: EventFormValues) {
    // Hapus year dari payload — backend menghitung otomatis dari event_date
    const { year: _year, ...payload } = data;
    createMutation.mutate(payload as EventFormValues);
  }

  // Tampilkan loader saat masih mengecek
  if (eventsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#004532]/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/events">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Buat Event Baru</h1>
          <p className="text-muted-foreground">Tambahkan event distribusi hewan kurban</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <h2 className="font-headline mb-5 text-lg font-bold text-[#191c1e]">Informasi Event</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Nama */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Event <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <input
                      placeholder="Contoh: Idul Adha 1447H"
                      className="w-full rounded-xl bg-[#f2f4f6] px-4 py-3 text-sm text-[#191c1e] placeholder-[#3f4944]/40 outline-none transition-all focus:bg-white focus:ring-1 focus:ring-[#004532]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi */}
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
                      className="rounded-xl bg-[#f2f4f6] text-sm resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Event <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Waktu */}
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

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg shadow-[#004532]/20 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                {createMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Simpan Event
              </button>
              <Link
                href="/events"
                className="inline-flex items-center rounded-xl border border-[rgba(190,201,194,0.5)] px-6 py-3 text-sm font-semibold text-[#3f4944] transition-colors hover:bg-[#f2f4f6]"
              >
                Batal
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
