'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Beef,
  UserCheck,
  Ticket,
  ScanLine,
  BarChart3,
  Settings,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePermissions } from '@/hooks/use-permissions';
import { useEventStore } from '@/stores/event.store';
import { EventSwitcher } from './event-switcher';
import { UserMenu } from './user-menu';

const mainNav = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Event',
    href: '/events',
    icon: Calendar,
    permission: 'view-events',
  },
];

function getEventNav(eventId: string) {
  return [
    {
      title: 'Donatur',
      href: `/events/${eventId}/donors`,
      icon: Users,
      permission: 'view-donors',
    },
    {
      title: 'Hewan',
      href: `/events/${eventId}/animals`,
      icon: Beef,
      permission: 'view-animals',
    },
    {
      title: 'Penerima',
      href: `/events/${eventId}/recipients`,
      icon: UserCheck,
      permission: 'view-recipients',
    },
    {
      title: 'Kupon',
      href: `/events/${eventId}/coupons`,
      icon: Ticket,
      permission: 'view-coupons',
    },
    {
      title: 'Scan QR',
      href: '/scan',
      icon: ScanLine,
      permission: 'scan-coupons',
    },
    {
      title: 'Laporan',
      href: '/reports',
      icon: BarChart3,
      permission: 'view-reports',
    },
  ];
}

const settingsNav = [
  {
    title: 'Pengaturan',
    href: '/settings',
    icon: Settings,
    permission: 'edit-tenant-settings',
  },
  {
    title: 'Pengguna',
    href: '/users',
    icon: Shield,
    permission: 'manage-tenant-users',
  },
];

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin, isViewer } = usePermissions();
  const { activeEvent } = useEventStore();

  useEffect(() => setMounted(true), []);

  const eventNav = activeEvent ? getEventNav(activeEvent.id) : [];

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  function canAccess(permission?: string) {
    if (!mounted || !permission) return true;
    return isSuperAdmin || hasPermission(permission);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            Q
          </div>
          <span className="text-lg font-bold">QurbanLink</span>
        </div>
        <EventSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.filter((item) => canAccess(item.permission)).map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeEvent && !isViewer && eventNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Event Aktif</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {eventNav.filter((item) => canAccess(item.permission)).map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(() => {
          const visibleSettings = settingsNav.filter((item) => canAccess(item.permission));
          const showAdminPanel = mounted && isSuperAdmin;
          if (visibleSettings.length === 0 && !showAdminPanel) return null;
          return (
            <SidebarGroup>
              <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleSettings.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {showAdminPanel && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin">
                          <ShieldCheck />
                          <span>Admin Panel</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })()}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
