'use client';

import dynamic from 'next/dynamic';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';

const AppSidebar = dynamic(
  () => import('@/components/layout/app-sidebar').then((m) => m.AppSidebar),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
