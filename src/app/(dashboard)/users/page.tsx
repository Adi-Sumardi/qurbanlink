'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Loader2, Plus, Shield, Pencil, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EmptyState } from '@/components/common/empty-state';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import type { User, QueryParams } from '@/types';

const userSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role wajib dipilih'),
});

type UserFormValues = z.infer<typeof userSchema>;

const ROLE_OPTIONS = [
  { value: 'tenant_admin', label: 'Admin' },
  { value: 'operator', label: 'Operator' },
  { value: 'viewer', label: 'Viewer' },
];

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 15 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', role: 'operator' },
  });

  const openCreate = () => {
    setEditUser(null);
    form.reset({ name: '', email: '', password: '', phone: '', role: 'operator' });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.roles?.[0] || 'operator',
    });
    setDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: UserFormValues) => userService.create(data),
    onSuccess: () => {
      toast.success('Pengguna berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDialogOpen(false);
    },
    onError: () => toast.error('Gagal menambahkan pengguna'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormValues }) =>
      userService.update(id, data),
    onSuccess: () => {
      toast.success('Pengguna berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDialogOpen(false);
    },
    onError: () => toast.error('Gagal memperbarui pengguna'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      toast.success('Pengguna berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Gagal menghapus pengguna'),
  });

  const onSubmit = (data: UserFormValues) => {
    if (editUser) {
      updateMutation.mutate({ id: editUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const users = data?.data ?? [];
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <p className="text-muted-foreground">Kelola pengguna organisasi</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="size-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="Belum ada pengguna"
              description="Tambahkan pengguna untuk mengelola organisasi"
              actionLabel="Tambah Pengguna"
              onAction={openCreate}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {user.roles?.[0]?.replace('_', ' ') || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openEdit(user)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </DialogTitle>
            <DialogDescription>
              {editUser ? 'Perbarui data pengguna' : 'Tambahkan pengguna baru ke organisasi'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password {editUser && <span className="text-muted-foreground">(kosongkan jika tidak diubah)</span>}
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="animate-spin" />}
                  {editUser ? 'Simpan' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus ${deleteTarget?.name}?`}
        confirmLabel="Ya, Hapus"
        variant="destructive"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
