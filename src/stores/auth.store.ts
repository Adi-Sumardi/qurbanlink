import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Tenant } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getTenant: () => Tenant | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoggingOut: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isLoggingOut: false });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({ isLoggingOut: true });
        localStorage.removeItem('token');
        localStorage.removeItem('event-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },

      getTenant: () => get().user?.tenant ?? null,

      hasRole: (role) => {
        const user = get().user;
        return user?.roles?.includes(role) ?? false;
      },

      hasPermission: (permission) => {
        const user = get().user;
        if (user?.roles?.includes('super_admin')) return true;
        return user?.permissions?.includes(permission) ?? false;
      },

      hasAnyPermission: (permissions) => {
        const user = get().user;
        if (user?.roles?.includes('super_admin')) return true;
        return permissions.some((p) => user?.permissions?.includes(p) ?? false);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
