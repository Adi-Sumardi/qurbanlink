'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Beef,
  UserCheck,
  Ticket,
  ScanLine,
  BarChart3,
  Settings,
  Shield,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { useEventStore } from '@/stores/event.store';
import { useLogout } from '@/hooks/use-auth';
import { EventSwitcher } from './event-switcher';

const mainNav = [
  { title: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Event', href: '/events', icon: Calendar, permission: 'view-events' },
];

function getEventNav(eventId: string) {
  return [
    { title: 'Penerima', href: `/events/${eventId}/recipients`, icon: UserCheck, permission: 'view-recipients' },
    { title: 'Hewan Kurban', href: `/events/${eventId}/animals`, icon: Beef, permission: 'view-animals' },
    { title: 'Distribusi', href: `/events/${eventId}/coupons`, icon: Ticket, permission: 'view-coupons' },
    { title: 'Scan QR', href: '/scan', icon: ScanLine, permission: 'scan-coupons' },
    { title: 'Laporan', href: '/reports', icon: BarChart3, permission: 'view-reports' },
  ];
}

const settingsNav = [
  { title: 'Pengaturan', href: '/settings', icon: Settings, permission: 'edit-tenant-settings' },
  { title: 'Pengguna', href: '/users', icon: Shield, permission: 'manage-tenant-users' },
  { title: 'Langganan', href: '/subscription', icon: CreditCard, permission: 'edit-tenant-settings' },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin, isViewer } = usePermissions();
  const { activeEvent } = useEventStore();
  const logout = useLogout();

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
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-white border-r border-[rgba(190,201,194,0.2)]">
      {/* Header: Logo + Org Name */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tawzii Digital" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="font-headline text-sm font-extrabold text-[#004532]">Tawzii Digital</p>
            <p className="text-[10px] text-[#3f4944]/60">by adilabs.id</p>
          </div>
        </div>

        {/* Event Switcher */}
        <div className="mt-4">
          <EventSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {/* Main Nav */}
        {mainNav.filter((item) => canAccess(item.permission)).map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onNavigate} />
        ))}

        {/* Event Nav */}
        {activeEvent && !isViewer && eventNav.length > 0 && (
          <>
            <div className="px-3 pb-1 pt-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/40">
                Event Aktif
              </p>
            </div>
            {eventNav.filter((item) => canAccess(item.permission)).map((item) => (
              <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onNavigate} />
            ))}
          </>
        )}

        {/* Settings Nav */}
        {(() => {
          const visible = settingsNav.filter((item) => canAccess(item.permission));
          const showAdmin = mounted && isSuperAdmin;
          if (visible.length === 0 && !showAdmin) return null;
          return (
            <>
              <div className="px-3 pb-1 pt-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#3f4944]/40">
                  Pengaturan
                </p>
              </div>
              {visible.map((item) => (
                <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onNavigate} />
              ))}
              {showAdmin && (
                <NavItem
                  item={{ title: 'Panel Admin', href: '/admin', icon: ShieldCheck }}
                  active={pathname.startsWith('/admin')}
                  onClick={onNavigate}
                />
              )}
            </>
          );
        })()}
      </nav>

      {/* Scan Kupon CTA */}
      <div className="px-3 pb-4">
        <Link
          href="/scan"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004532] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95"
        >
          <ScanLine className="size-4" />
          Scan Kupon
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(190,201,194,0.2)] px-3 py-3 space-y-0.5">
        <a
          href="https://wa.me/6285121379697?text=Halo%2C%20saya%20butuh%20bantuan%20mengenai%20Tawzii%20Digital"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#3f4944] transition-colors hover:bg-[#f2f4f6] hover:text-[#004532]"
        >
          <HelpCircle className="size-4" />
          <span>Bantuan</span>
        </a>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#3f4944] transition-colors hover:bg-[#f2f4f6] hover:text-[#004532]"
        >
          <LogOut className="size-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { title: string; href: string; icon: React.ComponentType<{ className?: string }> };
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
        active
          ? 'bg-[#f2f4f6] text-[#004532]'
          : 'text-[#3f4944] hover:bg-[#f2f4f6] hover:text-[#004532]'
      }`}
    >
      <item.icon className="size-4 flex-shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
}
