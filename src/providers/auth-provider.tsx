'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/kebijakan-privasi',
  '/syarat-ketentuan',
  '/laporan-keberlanjutan',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Tunggu sampai Zustand selesai baca dari localStorage.
    // Tanpa ini, pada refresh isAuthenticated sempat false → redirect ke /login → bounce.
    if (!_hasHydrated) return;

    const isPublicPath = pathname === '/' || PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    const isLivePath = pathname.startsWith('/live/');
    const isPrintPath = pathname.startsWith('/print/');
    const isAdminPath = pathname.startsWith('/admin');
    const isSuperAdmin = user?.roles?.includes('super_admin');

    if (isLivePath || isPrintPath) return;

    if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isPublicPath) {
      router.replace(isSuperAdmin ? '/admin' : '/dashboard');
      return;
    }

    if (isAdminPath && !isSuperAdmin) {
      router.replace('/dashboard');
      return;
    }

    // Super admin tanpa tenant tidak boleh akses dashboard tenant
    const isDashboardPath =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/events') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/users') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/scan');
    if (isAuthenticated && isSuperAdmin && !user?.tenant && isDashboardPath) {
      router.replace('/admin');
    }
  }, [pathname, isAuthenticated, user, router, _hasHydrated]);

  // Selalu render children — tidak ada conditional render = tidak ada hydration mismatch
  return <>{children}</>;
}
