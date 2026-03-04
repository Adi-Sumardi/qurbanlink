import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import type { User } from '@/types';

const mockUser: User = {
  id: 'user-1',
  tenant_id: 'tenant-1',
  name: 'Ahmad',
  email: 'ahmad@example.com',
  phone: null,
  is_active: true,
  email_verified_at: '2025-01-01',
  last_login_at: null,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
  roles: ['tenant_admin'],
  permissions: ['view-events', 'create-events', 'edit-events'],
  tenant: {
    id: 'tenant-1',
    name: 'Masjid Al-Ikhlas',
    slug: 'masjid-al-ikhlas-abcd',
    domain: null,
    email: 'masjid@example.com',
    phone: null,
    address: null,
    city: null,
    province: null,
    logo_path: null,
    settings: {},
    is_active: true,
    suspended_at: null,
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  },
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  });

  it('setAuth sets user, token, and isAuthenticated', () => {
    useAuthStore.getState().setAuth(mockUser, 'test-token-123');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('test-token-123');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('test-token-123');
  });

  it('logout clears state and localStorage', () => {
    useAuthStore.getState().setAuth(mockUser, 'test-token-123');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('setUser updates only user', () => {
    useAuthStore.getState().setAuth(mockUser, 'token-1');
    const updatedUser = { ...mockUser, name: 'Ahmad Updated' };
    useAuthStore.getState().setUser(updatedUser);

    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('Ahmad Updated');
    expect(state.token).toBe('token-1');
  });

  it('hasRole returns true for matching role', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(useAuthStore.getState().hasRole('tenant_admin')).toBe(true);
  });

  it('hasRole returns false for non-matching role', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(useAuthStore.getState().hasRole('super_admin')).toBe(false);
  });

  it('hasPermission returns true for matching permission', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(useAuthStore.getState().hasPermission('view-events')).toBe(true);
  });

  it('hasPermission returns false for non-matching permission', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(useAuthStore.getState().hasPermission('delete-events')).toBe(false);
  });

  it('hasPermission always returns true for super_admin', () => {
    const superAdmin = { ...mockUser, roles: ['super_admin'], permissions: [] };
    useAuthStore.getState().setAuth(superAdmin, 'token');
    expect(useAuthStore.getState().hasPermission('anything')).toBe(true);
  });

  it('hasAnyPermission returns true if any permission matches', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(
      useAuthStore.getState().hasAnyPermission(['delete-events', 'view-events'])
    ).toBe(true);
  });

  it('hasAnyPermission returns false if none match', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(
      useAuthStore.getState().hasAnyPermission(['delete-events', 'manage-tenants'])
    ).toBe(false);
  });

  it('hasAnyPermission always returns true for super_admin', () => {
    const superAdmin = { ...mockUser, roles: ['super_admin'], permissions: [] };
    useAuthStore.getState().setAuth(superAdmin, 'token');
    expect(useAuthStore.getState().hasAnyPermission(['anything'])).toBe(true);
  });

  it('getTenant returns user tenant', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    expect(useAuthStore.getState().getTenant()?.name).toBe('Masjid Al-Ikhlas');
  });

  it('getTenant returns null when no user', () => {
    expect(useAuthStore.getState().getTenant()).toBeNull();
  });
});
