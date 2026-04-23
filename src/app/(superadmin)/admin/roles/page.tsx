'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Plus, Trash2, Pencil, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { adminService } from '@/services/admin.service';
import type { RoleWithPermissions } from '@/services/admin.service';
import Link from 'next/link';
import { toast } from 'sonner';

const SYSTEM_ROLES = ['super_admin', 'tenant_admin', 'operator', 'viewer'];

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  tenant_admin: 'Tenant Admin',
  operator: 'Operator',
  viewer: 'Viewer',
};

export default function RolesPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<RoleWithPermissions | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => adminService.getRoles(),
  });

  const roles: RoleWithPermissions[] = (data?.data as RoleWithPermissions[] | undefined) ?? [];

  const createMutation = useMutation({
    mutationFn: (name: string) => adminService.createRole(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setCreateOpen(false);
      setNewRoleName('');
      toast.success('Role berhasil dibuat');
    },
    onError: () => toast.error('Gagal membuat role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (roleId: number) => adminService.deleteRole(roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setDeleteTarget(null);
      toast.success('Role berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus role'),
  });

  function handleCreate() {
    const trimmed = newRoleName.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
            Manajemen Akses
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Role & Permission</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola role dan hak akses pengguna platform
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="size-4" />
          Tambah Role
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {roles.map((role) => {
              const isSystem = SYSTEM_ROLES.includes(role.name);
              return (
                <div
                  key={role.id}
                  className="flex items-center gap-4 px-4 py-4 sm:px-6"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {isSystem ? (
                      <Lock className="size-4 text-primary" />
                    ) : (
                      <ShieldCheck className="size-4 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">
                        {ROLE_LABELS[role.name] ?? role.name}
                      </p>
                      {isSystem && (
                        <Badge variant="secondary" className="text-[10px]">
                          Sistem
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {role.permissions.length} permission
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8" asChild>
                      <Link href={`/admin/roles/${role.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    {!isSystem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(role)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Tambah Role Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Nama role (e.g. kasir)"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Gunakan huruf kecil dan underscore, contoh: <code>kasir_gudang</code>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newRoleName.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Membuat...' : 'Buat Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Role <strong>{deleteTarget?.name}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
