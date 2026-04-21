'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, LogOut, User, CreditCard, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/use-auth';

const headerNav = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Event', href: '/events' },
  { label: 'Laporan', href: '/reports' },
];

export function AppHeader({ onMenuToggle }: { onMenuToggle?: () => void } = {}) {
  const { user } = useAuthStore();
  const logout = useLogout();
  const pathname = usePathname();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <header className="flex h-14 items-center gap-3 border-b border-[rgba(190,201,194,0.2)] bg-white px-4 md:px-5">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="flex size-9 items-center justify-center rounded-xl text-[#3f4944] transition-colors hover:bg-[#f2f4f6] md:hidden"
        aria-label="Buka menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Breadcrumb / Page indicator */}
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-black uppercase tracking-widest text-[#3f4944]/40 md:block">
          Tawzii Digital
        </span>
        <nav className="hidden items-center gap-1 md:flex">
          {headerNav.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-b-2 border-[#004532] pb-[5px] text-[#004532]'
                    : 'text-[#3f4944]/60 hover:text-[#004532]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button className="flex size-9 items-center justify-center rounded-xl text-[#3f4944] transition-colors hover:bg-[#f2f4f6]">
          <Bell className="size-4" />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className="flex size-9 items-center justify-center rounded-xl text-[#3f4944] transition-colors hover:bg-[#f2f4f6]"
        >
          <Settings className="size-4" />
        </Link>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6ffbbe] to-[#a6f2d1] text-xs font-bold text-[#003826] shadow-sm transition-all hover:scale-105">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-[#3f4944]/60">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="size-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <CreditCard className="size-4" />
                Langganan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout.mutate()}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
