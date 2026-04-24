'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Printer, RefreshCw, Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/common/status-badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { couponService } from '@/services/coupon.service';
import { locationService } from '@/services/location.service';
import { COUPON_STATUS_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/use-permissions';
import type { Coupon, QueryParams } from '@/types';

export default function CouponsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 15 });
  const [search, setSearch] = useState('');
  const [generateOpen, setGenerateOpen] = useState(false);
  const [voidTarget, setVoidTarget] = useState<Coupon | null>(null);
  const { hasPermission } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canGenerate = mounted && hasPermission('generate-coupons');
  const canVoid = mounted && hasPermission('void-coupons');
  const canRegenerate = mounted && hasPermission('regenerate-coupons');
  const canPrint = mounted && hasPermission('print-coupons');

  const { data: locationsData } = useQuery({
    queryKey: ['locations', eventId],
    queryFn: () => locationService.getAll(eventId),
    enabled: !!eventId,
  });

  // Redirect to locations page if no locations have been set up yet
  useEffect(() => {
    if (!locationsData) return;
    const locations = locationsData.data ?? [];
    if (locations.length === 0) {
      toast.info('Tambahkan lokasi distribusi terlebih dahulu');
      router.replace(`/events/${eventId}/locations`);
    }
  }, [locationsData, eventId, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['coupons', eventId, params, search],
    queryFn: () =>
      couponService.getAll(eventId, { ...params, search: search || undefined }),
  });

  const generateMutation = useMutation({
    mutationFn: () => couponService.generate(eventId, { generate_all: true }),
    onSuccess: () => {
      toast.success('Kupon berhasil di-generate');
      queryClient.invalidateQueries({ queryKey: ['coupons', eventId] });
      setGenerateOpen(false);
    },
    onError: () => toast.error('Gagal generate kupon'),
  });

  const voidMutation = useMutation({
    mutationFn: (couponId: string) =>
      couponService.void(eventId, couponId, { reason: 'Dibatalkan oleh admin' }),
    onSuccess: () => {
      toast.success('Kupon berhasil dibatalkan');
      queryClient.invalidateQueries({ queryKey: ['coupons', eventId] });
      setVoidTarget(null);
    },
    onError: () => toast.error('Gagal membatalkan kupon'),
  });

  const regenerateMutation = useMutation({
    mutationFn: (couponId: string) => couponService.regenerate(eventId, couponId),
    onSuccess: () => {
      toast.success('Kupon berhasil di-regenerate');
      queryClient.invalidateQueries({ queryKey: ['coupons', eventId] });
    },
    onError: () => toast.error('Gagal regenerate kupon'),
  });

  const coupons = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kupon</h1>
          <p className="text-muted-foreground">Kelola kupon distribusi</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canPrint && (
            <Button
              variant="outline"
              onClick={() => router.push(`/print/events/${eventId}/coupons`)}
            >
              <Printer className="size-4" />
              Cetak
            </Button>
          )}
          {canGenerate && (
            <Button onClick={() => setGenerateOpen(true)}>
              <Ticket className="size-4" />
              Generate Kupon
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Cari nomor kupon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="Belum ada kupon"
              description="Generate kupon untuk penerima yang sudah terdaftar"
              actionLabel={canGenerate ? 'Generate Kupon' : undefined}
              onAction={canGenerate ? () => setGenerateOpen(true) : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Kupon</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Diklaim</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon: Coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono text-sm">
                        {coupon.coupon_number}
                      </TableCell>
                      <TableCell>{coupon.recipient?.name ?? '-'}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={coupon.status}
                          label={COUPON_STATUS_LABELS[coupon.status]}
                        />
                      </TableCell>
                      <TableCell>{formatDateTime(coupon.claimed_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {coupon.status === 'generated' && canVoid && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setVoidTarget(coupon)}
                              title="Batalkan"
                            >
                              <Ban className="size-3.5" />
                            </Button>
                          )}
                          {coupon.status === 'voided' && canRegenerate && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => regenerateMutation.mutate(coupon.id)}
                              title="Regenerate"
                            >
                              <RefreshCw className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              {data?.meta && (
                <div className="mt-4">
                  <DataTablePagination
                    meta={data.meta}
                    onPageChange={(page) => setParams((p) => ({ ...p, page }))}
                    onPageSizeChange={(per_page) =>
                      setParams((p) => ({ ...p, per_page, page: 1 }))
                    }
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Kupon</DialogTitle>
            <DialogDescription>
              Generate kupon QR untuk semua penerima yang belum memiliki kupon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending && <Loader2 className="animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!voidTarget}
        onOpenChange={() => setVoidTarget(null)}
        title="Batalkan Kupon"
        description={`Apakah Anda yakin ingin membatalkan kupon ${voidTarget?.coupon_number}?`}
        confirmLabel="Ya, Batalkan"
        variant="destructive"
        onConfirm={() => voidTarget && voidMutation.mutate(voidTarget.id)}
        loading={voidMutation.isPending}
      />
    </div>
  );
}
