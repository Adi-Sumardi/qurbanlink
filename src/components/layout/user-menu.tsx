'use client';

import { LogOut, User, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/use-auth';

export function UserMenu() {
  const { user, hasRole } = useAuthStore();
  const logout = useLogout();
  const isSuperAdmin = hasRole('super_admin');

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="w-full">
          <Avatar className="size-6">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left leading-tight">
            <span className="truncate text-sm font-medium">{user?.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="top">
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
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldCheck className="size-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
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
  );
}
