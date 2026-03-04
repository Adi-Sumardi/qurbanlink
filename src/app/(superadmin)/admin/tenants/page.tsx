'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Loader2, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EmptyState } from '@/components/common/empty-state';
import { adminService } from '@/services/admin.service';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import type { Tenant, QueryParams } from '@/types';

export default function AdminTenantsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 15 });
  const [suspendTarget, setSuspendTarget] = useState<Tenant | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<Tenant | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tenants', params],
    queryFn: () => adminService.getTenants(params),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminService.suspendTenant(id),
    onSuccess: () => {
      toast.success('Tenant berhasil di-suspend');
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      setSuspendTarget(null);
    },
    onError: () => toast.error('Gagal suspend tenant'),
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id: string) => adminService.unsuspendTenant(id),
    onSuccess: () => {
      toast.success('Tenant berhasil diaktifkan kembali');
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      setUnsuspendTarget(null);
    },
    onError: () => toast.error('Gagal mengaktifkan tenant'),
  });

  const tenants = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Tenant</h1>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : tenants.length === 0 ? (
            <EmptyState icon={Building2} title="Belum ada tenant" />
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant: Tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell className="text-muted-foreground">{tenant.slug}</TableCell>
                      <TableCell>
                        <Badge variant={tenant.is_active ? 'default' : 'destructive'}>
                          {tenant.is_active ? 'Aktif' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(tenant.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {tenant.is_active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSuspendTarget(tenant)}
                          >
                            <Ban className="size-4" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUnsuspendTarget(tenant)}
                          >
                            <CheckCircle className="size-4" />
                            Aktifkan
                          </Button>
                        )}
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

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={() => setSuspendTarget(null)}
        title="Suspend Tenant"
        description={`Apakah Anda yakin ingin men-suspend ${suspendTarget?.name}?`}
        confirmLabel="Ya, Suspend"
        variant="destructive"
        onConfirm={() => suspendTarget && suspendMutation.mutate(suspendTarget.id)}
        loading={suspendMutation.isPending}
      />

      <ConfirmDialog
        open={!!unsuspendTarget}
        onOpenChange={() => setUnsuspendTarget(null)}
        title="Aktifkan Tenant"
        description={`Aktifkan kembali ${unsuspendTarget?.name}?`}
        confirmLabel="Ya, Aktifkan"
        onConfirm={() => unsuspendTarget && unsuspendMutation.mutate(unsuspendTarget.id)}
        loading={unsuspendMutation.isPending}
      />
    </div>
  );
}
