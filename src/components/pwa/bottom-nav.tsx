'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  ScanLine,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useEventStore } from '@/stores/event.store';

export function BottomNav() {
  const pathname = usePathname();
  const { activeEvent } = useEventStore();

  const items = [
    { title: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    {
      title: 'Event',
      href: activeEvent ? `/events/${activeEvent.id}` : '/events',
      matchHref: '/events',
      icon: Calendar,
    },
    { title: 'Scan', href: '/scan', icon: ScanLine, primary: true },
    { title: 'Laporan', href: '/reports', icon: BarChart3 },
    { title: 'Setelan', href: '/settings', icon: Settings },
  ];

  function isActive(href: string, matchHref?: string) {
    const check = matchHref ?? href;
    if (check === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(check);
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(190,201,194,0.3)] bg-white md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end h-16">
        {items.map((item) => {
          const active = isActive(item.href, item.matchHref);

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-end pb-2"
              >
                {/* Raised FAB button */}
                <div className="relative -top-3 flex size-14 items-center justify-center rounded-full bg-[#004532] shadow-xl shadow-[#004532]/40 ring-4 ring-white transition-transform active:scale-95">
                  <ScanLine className={`size-6 ${active ? 'text-[#6ffbbe]' : 'text-white'}`} />
                </div>
                <span
                  className={`-mt-1 text-[10px] font-black uppercase tracking-wide ${
                    active ? 'text-[#004532]' : 'text-[#3f4944]/50'
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <div
                className={`flex size-7 items-center justify-center rounded-xl transition-colors ${
                  active ? 'bg-[#004532]/10' : ''
                }`}
              >
                <item.icon
                  className={`size-5 transition-colors ${
                    active ? 'text-[#004532]' : 'text-[#3f4944]/50'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wide transition-colors ${
                  active ? 'text-[#004532]' : 'text-[#3f4944]/50'
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
