'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
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
import { eventService } from '@/services/event.service';
import { usePermissions } from '@/hooks/use-permissions';
import { eventSchema, type EventFormValues } from '@/lib/validations/event';

export default function CreateEventPage() {
  const router = useRouter();
  const { isViewer, isOperator } = usePermissions();

  useEffect(() => {
    if (isViewer || isOperator) router.replace('/events');
  }, [isViewer, isOperator, router]);

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

  const createMutation = useMutation({
    mutationFn: (data: EventFormValues) => eventService.create(data),
    onSuccess: () => {
      toast.success('Event berhasil dibuat');
      router.push('/events');
    },
    onError: () => {
      toast.error('Gagal membuat event');
    },
  });

  function onSubmit(data: EventFormValues) {
    createMutation.mutate(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/events">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Buat Event Baru</h1>
          <p className="text-muted-foreground">
            Tambahkan event distribusi hewan kurban
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Event</CardTitle>
          <CardDescription>
            Isi data event yang akan dibuat
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
                        <Input
                          type="number"
                          placeholder="2026"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
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

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Simpan
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/events">Batal</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
