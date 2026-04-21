'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Loader2,
  Search,
  Ban,
  CheckCircle,
  ChevronDown,
  Building2,
  ShieldCheck,
  ShieldOff,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { EmptyState } from '@/components/common/empty-state';
import { adminService } from '@/services/admin.service';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import type { Tenant, QueryParams } from '@/types';

export default function TenantAdminsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 15 });
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [dialogAction, setDialogAction] = useState<'suspend' | 'unsuspend' | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tenants', params],
    queryFn: () => adminService.getTenants({ ...params, search: search || undefined }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminService.suspendTenant(id),
    onSuccess: () => {
      toast.success('Akses tenant admin berhasil di-suspend');
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      closeDialog();
    },
    onError: () => toast.error('Gagal men-suspend akses tenant'),
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id: string) => adminService.unsuspendTenant(id),
    onSuccess: () => {
      toast.success('Akses tenant admin berhasil diaktifkan kembali');
      queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
      closeDialog();
    },
    onError: () => toast.error('Gagal mengaktifkan kembali akses tenant'),
  });

  const tenants: Tenant[] = data?.data ?? [];
  const isPending = suspendMutation.isPending || unsuspendMutation.isPending;

  function openDialog(tenant: Tenant, action: 'suspend' | 'unsuspend') {
    setSelectedTenant(tenant);
    setDialogAction(action);
  }

  function closeDialog() {
    setSelectedTenant(null);
    setDialogAction(null);
  }

  function handleConfirm() {
    if (!selectedTenant) return;
    if (dialogAction === 'suspend') {
      suspendMutation.mutate(selectedTenant.id);
    } else if (dialogAction === 'unsuspend') {
      unsuspendMutation.mutate(selectedTenant.id);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParams((p) => ({ ...p, page: 1 }));
    queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
  }

  const activeCount = tenants.filter((t) => t.is_active).length;
  const suspendedCount = tenants.filter((t) => !t.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Akses Tenant Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola dan atur hak akses administrator untuk setiap tenant aktif
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Building2 className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tenant</p>
              <p className="text-2xl font-bold">{data?.meta?.total ?? tenants.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Akses Aktif</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="rounded-xl bg-red-50 p-2.5">
              <ShieldOff className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Akses Disuspend</p>
              <p className="text-2xl font-bold">{suspendedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Daftar Tenant Admin</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau slug..."
                  className="pl-9 w-60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">
                Cari
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="pb-6">
              <EmptyState icon={Users} title="Tidak ada tenant ditemukan" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Tenant</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead>Status Akses</TableHead>
                      <TableHead>Terdaftar</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{tenant.name}</p>
                            <p className="text-xs text-muted-foreground">/{tenant.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {tenant.email && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail className="size-3" />
                                {tenant.email}
                              </div>
                            )}
                            {tenant.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Phone className="size-3" />
                                {tenant.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tenant.city || '-'}
                          {tenant.province ? `, ${tenant.province}` : ''}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tenant.is_active ? 'default' : 'destructive'}>
                            {tenant.is_active ? 'Aktif' : 'Suspend'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(tenant.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1">
                                Kelola
                                <ChevronDown className="size-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuSeparator />
                              {tenant.is_active ? (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openDialog(tenant, 'suspend')}
                                >
                                  <Ban className="size-4" />
                                  Suspend Akses
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => openDialog(tenant, 'unsuspend')}
                                >
                                  <CheckCircle className="size-4" />
                                  Aktifkan Kembali
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data?.meta && (
                <div className="p-4">
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

      {/* Confirm Dialog */}
      <Dialog open={!!selectedTenant && !!dialogAction} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'suspend'
                ? 'Suspend Akses Tenant Admin'
                : 'Aktifkan Kembali Akses Tenant Admin'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'suspend'
                ? `Aksi ini akan menonaktifkan seluruh akses admin untuk tenant "${selectedTenant?.name}". Admin tenant tidak dapat login hingga akses diaktifkan kembali.`
                : `Aksi ini akan mengaktifkan kembali akses admin untuk tenant "${selectedTenant?.name}". Admin tenant dapat login dan menggunakan platform.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeDialog} disabled={isPending}>
              Batal
            </Button>
            <Button
              variant={dialogAction === 'suspend' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {dialogAction === 'suspend' ? 'Ya, Suspend' : 'Ya, Aktifkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
