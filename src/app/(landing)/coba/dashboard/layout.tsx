'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  Ticket,
  Beef,
  FileBarChart2,
  Calendar,
  HeartHandshake,
  UserCheck,
  MapPin,
  Settings,
  Shield,
  CreditCard,
  ArrowLeft,
  Monitor,
} from 'lucide-react';
import { DemoBanner } from '@/components/coba/demo-banner';
import { FloatingCta } from '@/components/coba/floating-cta';

// Selaras dengan menu di dashboard tenant (src/components/layout/app-sidebar.tsx)
const NAV = [
  { href: '/coba/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/coba/dashboard/kupon', label: 'Distribusi', icon: Ticket },
  { href: '/coba/dashboard/scan', label: 'Scan QR', icon: ScanLine, highlight: true },
  { href: '/coba/dashboard/live', label: 'Live Dashboard', icon: Monitor },
];

const NAV_DISABLED = [
  { label: 'Event', icon: Calendar },
  { label: 'Donatur', icon: HeartHandshake },
  { label: 'Penerima', icon: UserCheck },
  { label: 'Hewan Kurban', icon: Beef },
  { label: 'Lokasi', icon: MapPin },
  { label: 'Laporan', icon: FileBarChart2 },
  { label: 'Pengaturan', icon: Settings },
  { label: 'Pengguna', icon: Shield },
  { label: 'Langganan', icon: CreditCard },
];

export default function DemoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      <DemoBanner />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 rounded-3xl bg-white p-4 shadow-sm">
            <Link
              href="/coba"
              className="mb-4 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#3f4944] transition-colors hover:bg-[#f2f4f6] hover:text-[#004532]"
            >
              <ArrowLeft className="size-3.5" />
              Keluar Demo
            </Link>

            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-[#3f4944]/60">
              Menu
            </p>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#004532] text-white shadow-sm'
                        : 'text-[#3f4944] hover:bg-[#f2f4f6] hover:text-[#004532]'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.highlight && !active && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                        COBA
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <p className="mb-2 mt-5 px-2 text-[10px] font-bold uppercase tracking-wider text-[#3f4944]/60">
              Tersedia setelah daftar
            </p>
            <ul className="flex flex-col gap-0.5">
              {NAV_DISABLED.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    title="Fitur ini aktif setelah Anda mendaftar"
                    className="flex cursor-not-allowed items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#3f4944]/40"
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Mobile horizontal nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#eceef0] bg-white px-2 py-1.5 lg:hidden">
          <nav className="mx-auto flex max-w-md justify-around">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-bold transition-colors ${
                    active
                      ? 'text-[#004532]'
                      : 'text-[#3f4944]/60 hover:text-[#004532]'
                  }`}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main */}
        <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      <FloatingCta />
    </div>
  );
}
