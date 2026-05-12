'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { BottomNav } from '@/components/pwa/bottom-nav';
import { PostRegisterPayment } from '@/components/layout/post-register-payment';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f2f4f6]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0 [&>button]:hidden">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <AppSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader onMenuToggle={() => setSidebarOpen(true)} />
        {/* pb-20 on mobile to clear the bottom nav bar */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {/* Auto-trigger payment if user just registered with a paid plan */}
          <PostRegisterPayment />
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
