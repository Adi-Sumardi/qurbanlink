'use client';

import { useAuthStore } from '@/stores/auth.store';
import { ROLES } from '@/lib/constants';

export function usePermissions() {
  const { user, hasRole, hasPermission, hasAnyPermission } = useAuthStore();

  const isSuperAdmin = hasRole(ROLES.SUPER_ADMIN);
  const isTenantAdmin = hasRole(ROLES.TENANT_ADMIN);
  const isOperator = hasRole(ROLES.OPERATOR);
  const isViewer = hasRole(ROLES.VIEWER);

  const canManageEvents = hasAnyPermission(['create-events', 'edit-events', 'delete-events']);
  const canManageDonors = hasAnyPermission(['create-donors', 'edit-donors', 'delete-donors']);
  const canManageAnimals = hasAnyPermission(['create-animals', 'edit-animals', 'delete-animals']);
  const canManageRecipients = hasAnyPermission(['create-recipients', 'edit-recipients', 'delete-recipients']);
  const canManageCoupons = hasAnyPermission(['generate-coupons', 'void-coupons', 'regenerate-coupons']);
  const canScan = hasAnyPermission(['scan-coupons', 'manual-scan']);
  const canManageUsers = hasPermission('manage-tenant-users');
  const canManageSubscription = hasPermission('manage-subscription');
  const canViewReports = hasPermission('view-reports');
  const canExportReports = hasPermission('export-reports');

  return {
    user,
    isSuperAdmin,
    isTenantAdmin,
    isOperator,
    isViewer,
    canManageEvents,
    canManageDonors,
    canManageAnimals,
    canManageRecipients,
    canManageCoupons,
    canScan,
    canManageUsers,
    canManageSubscription,
    canViewReports,
    canExportReports,
    hasRole,
    hasPermission,
    hasAnyPermission,
  };
}
