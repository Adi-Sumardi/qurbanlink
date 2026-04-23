'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScrollText,
  TrendingUp,
  UserCog,
  Package,
  ShieldCheck,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/use-auth';

const adminNav = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Audit Log', href: '/admin/audit-logs', icon: ScrollText },
  { title: 'Penghasilan SaaS', href: '/admin/revenue', icon: TrendingUp },
  { title: 'Akses Tenant Admin', href: '/admin/tenant-admins', icon: UserCog },
  { title: 'Kelola Paket', href: '/admin/plans', icon: Package },
  { title: 'Role & Permission', href: '/admin/roles', icon: ShieldCheck },
];

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { user } = useAuthStore();
  const logout = useLogout();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="flex flex-col gap-1">
          <img src="/logo.png" alt="Tawzii Digital" className="h-10 w-10 rounded-full object-cover" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Super Admin Panel</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              // /admin is exact-match only; all other nav items use startsWith
              (item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href))
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      <Separator />

      <div className="p-3">
        <div className="flex items-center gap-2.5 rounded-md px-3 py-2">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start text-destructive hover:text-destructive"
          onClick={() => logout.mutate()}
        >
          <LogOut className="size-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:block">
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menu Navigasi Admin</SheetTitle>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-muted-foreground">Super Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
