'use client';

import { use, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { adminService } from '@/services/admin.service';
import { toast } from 'sonner';

const PERMISSION_GROUPS: Record<string, string[]> = {
  'Tenant & Subscription': [
    'view-tenant-profile', 'edit-tenant-profile', 'edit-tenant-settings',
    'manage-tenant-users', 'manage-subscription',
  ],
  'Event': [
    'view-events', 'create-events', 'edit-events', 'delete-events',
    'activate-events', 'complete-events', 'manage-locations',
  ],
  'Donatur': [
    'view-donors', 'create-donors', 'edit-donors', 'delete-donors', 'import-donors',
  ],
  'Hewan': [
    'view-animals', 'create-animals', 'edit-animals', 'delete-animals', 'update-animal-status',
  ],
  'Penerima': [
    'view-recipients', 'create-recipients', 'edit-recipients', 'delete-recipients',
    'import-recipients', 'export-recipients',
  ],
  'Kupon': [
    'view-coupons', 'generate-coupons', 'print-coupons', 'void-coupons', 'regenerate-coupons',
  ],
  'Scan Operasional': [
    'scan-coupons', 'manual-scan', 'view-scan-history', 'sync-offline-scans',
  ],
  'Dashboard & Laporan': [
    'view-dashboard', 'view-live-dashboard', 'view-reports', 'export-reports', 'generate-reports',
  ],
  'Manajemen Pengguna': [
    'view-users', 'create-users', 'edit-users', 'delete-users', 'assign-roles',
  ],
  'Administrasi Platform': [
    'view-all-tenants', 'manage-tenants', 'suspend-tenants',
    'view-platform-dashboard', 'manage-platform-settings',
    'view-audit-logs', 'manage-plans', 'manual-payment-activation',
  ],
};

const PERMISSION_LABEL: Record<string, string> = {
  'view-tenant-profile': 'Lihat profil tenant',
  'edit-tenant-profile': 'Edit profil tenant',
  'edit-tenant-settings': 'Edit pengaturan tenant',
  'manage-tenant-users': 'Kelola pengguna tenant',
  'manage-subscription': 'Kelola langganan',
  'view-events': 'Lihat event',
  'create-events': 'Buat event',
  'edit-events': 'Edit event',
  'delete-events': 'Hapus event',
  'activate-events': 'Aktifkan event',
  'complete-events': 'Selesaikan event',
  'manage-locations': 'Kelola lokasi',
  'view-donors': 'Lihat donatur',
  'create-donors': 'Tambah donatur',
  'edit-donors': 'Edit donatur',
  'delete-donors': 'Hapus donatur',
  'import-donors': 'Import donatur',
  'view-animals': 'Lihat hewan',
  'create-animals': 'Tambah hewan',
  'edit-animals': 'Edit hewan',
  'delete-animals': 'Hapus hewan',
  'update-animal-status': 'Update status hewan',
  'view-recipients': 'Lihat penerima',
  'create-recipients': 'Tambah penerima',
  'edit-recipients': 'Edit penerima',
  'delete-recipients': 'Hapus penerima',
  'import-recipients': 'Import penerima',
  'export-recipients': 'Export penerima',
  'view-coupons': 'Lihat kupon',
  'generate-coupons': 'Generate kupon',
  'print-coupons': 'Cetak kupon',
  'void-coupons': 'Void kupon',
  'regenerate-coupons': 'Regenerasi kupon',
  'scan-coupons': 'Scan kupon',
  'manual-scan': 'Scan manual',
  'view-scan-history': 'Lihat riwayat scan',
  'sync-offline-scans': 'Sinkron scan offline',
  'view-dashboard': 'Lihat dashboard',
  'view-live-dashboard': 'Lihat live dashboard',
  'view-reports': 'Lihat laporan',
  'export-reports': 'Export laporan',
  'generate-reports': 'Generate laporan',
  'view-users': 'Lihat pengguna',
  'create-users': 'Tambah pengguna',
  'edit-users': 'Edit pengguna',
  'delete-users': 'Hapus pengguna',
  'assign-roles': 'Tetapkan role',
  'view-all-tenants': 'Lihat semua tenant',
  'manage-tenants': 'Kelola tenant',
  'suspend-tenants': 'Suspend tenant',
  'view-platform-dashboard': 'Dashboard platform',
  'manage-platform-settings': 'Pengaturan platform',
  'view-audit-logs': 'Lihat audit log',
  'manage-plans': 'Kelola paket',
  'manual-payment-activation': 'Aktivasi pembayaran manual',
};

const SYSTEM_ROLES = ['super_admin', 'tenant_admin', 'operator', 'viewer'];

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => adminService.getRoles(),
  });

  const roles = (rolesData?.data as import('@/services/admin.service').RoleWithPermissions[] | undefined) ?? [];
  const role = roles.find((r) => String(r.id) === id);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) setSelected(new Set(role.permissions));
  }, [role]);

  const saveMutation = useMutation({
    mutationFn: () => adminService.updateRolePermissions(Number(id), Array.from(selected)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      toast.success('Permission berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan permission'),
  });

  function toggle(perm: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return next;
    });
  }

  function toggleGroup(perms: string[], value: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      perms.forEach((p) => (value ? next.add(p) : next.delete(p)));
      return next;
    });
  }

  const isSystem = role ? SYSTEM_ROLES.includes(role.name) : false;
  const isDirty = role
    ? JSON.stringify([...selected].sort()) !== JSON.stringify([...role.permissions].sort())
    : false;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Role tidak ditemukan.{' '}
        <Link href="/admin/roles" className="underline">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/roles">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{role.name}</h1>
          <p className="text-sm text-muted-foreground">{selected.size} permission aktif</p>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!isDirty || saveMutation.isPending}
          size="sm"
        >
          {saveMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Simpan
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
          const groupSelected = perms.filter((p) => selected.has(p));
          const allChecked = groupSelected.length === perms.length;
          const someChecked = groupSelected.length > 0 && !allChecked;

          return (
            <div key={group} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
                <Checkbox
                  id={`group-${group}`}
                  checked={allChecked}
                  data-state={someChecked ? 'indeterminate' : undefined}
                  onCheckedChange={(v) => toggleGroup(perms, !!v)}
                />
                <label
                  htmlFor={`group-${group}`}
                  className="text-sm font-semibold cursor-pointer select-none"
                >
                  {group}
                </label>
                <span className="ml-auto text-xs text-muted-foreground">
                  {groupSelected.length}/{perms.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0">
                {perms.map((perm, i) => (
                  <div
                    key={perm}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/20 ${
                      i % 2 === 0 ? 'sm:border-r' : ''
                    } ${i < perms.length - 2 ? 'sm:border-b' : ''} ${
                      i < perms.length - 1 && i % 2 === 0 ? 'sm:border-b' : ''
                    }`}
                  >
                    <Checkbox
                      id={perm}
                      checked={selected.has(perm)}
                      onCheckedChange={() => toggle(perm)}
                    />
                    <label htmlFor={perm} className="text-sm cursor-pointer select-none flex-1">
                      {PERMISSION_LABEL[perm] ?? perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isDirty && (
        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Simpan Perubahan
          </Button>
        </div>
      )}
    </div>
  );
}
