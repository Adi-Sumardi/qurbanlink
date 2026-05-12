import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Tenant,
  AuditLog,
  Payment,
} from '@/types';

export interface ErrorLogEntry {
  id: string;
  method: string | null;
  url: string | null;
  route: string | null;
  status_code: number | null;
  exception_class: string | null;
  message: string;
  stack_trace: string | null;
  request_data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  user_id: string | null;
  user: { id: string; name: string; email: string } | null;
  environment: string;
  occurred_at: string;
}

export interface ErrorStats {
  total: number;
  today: number;
  errors_500: number;
  errors_404: number;
  top_routes: { route: string; total: number }[];
  recent_trend: { date: string; total: number }[];
  by_status: { status_code: number; total: number }[];
}

export interface RoleWithPermissions {
  id: number;
  name: string;
  permissions: string[];
}

interface AdminDashboard {
  total_tenants: number;
  total_events: number;
  total_users: number;
  total_revenue: number;
  recent_registrations: Tenant[];
  subscription_breakdown: Record<string, number>;
}

interface PlanConfig {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  coupon_quota: number;
  features: Record<string, unknown>;
  is_active: boolean;
}

export const adminService = {
  async getDashboard() {
    const res = await api.get<ApiResponse<AdminDashboard>>('/admin/dashboard');
    return res.data;
  },

  async getTenants(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Tenant>>(
      '/admin/tenants',
      { params }
    );
    return res.data;
  },

  async getTenantById(tenantId: string) {
    const res = await api.get<ApiResponse<Tenant>>(`/admin/tenants/${tenantId}`);
    return res.data;
  },

  async updateTenant(tenantId: string, data: Partial<Tenant>) {
    const res = await api.put<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}`,
      data
    );
    return res.data;
  },

  async suspendTenant(tenantId: string) {
    const res = await api.patch<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}/suspend`
    );
    return res.data;
  },

  async unsuspendTenant(tenantId: string) {
    const res = await api.patch<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}/unsuspend`
    );
    return res.data;
  },

  async getAuditLogs(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<AuditLog>>(
      '/admin/audit-logs',
      { params }
    );
    return res.data;
  },

  async getPlans() {
    const res = await api.get<ApiResponse<PlanConfig[]>>('/admin/plans');
    return res.data;
  },

  async createPlan(data: Omit<PlanConfig, 'id'>) {
    const res = await api.post<ApiResponse<PlanConfig>>('/admin/plans', data);
    return res.data;
  },

  async updatePlan(planId: string, data: Partial<PlanConfig>) {
    const res = await api.put<ApiResponse<PlanConfig>>(
      `/admin/plans/${planId}`,
      data
    );
    return res.data;
  },

  async deletePlan(planId: string) {
    const res = await api.delete<ApiResponse<null>>(`/admin/plans/${planId}`);
    return res.data;
  },

  async activatePayment(paymentId: string) {
    const res = await api.post<ApiResponse<Payment>>(
      `/admin/payments/${paymentId}/activate`
    );
    return res.data;
  },

  async getPayments(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Payment>>(
      '/admin/payments',
      { params }
    );
    return res.data;
  },

  async getRoles() {
    const res = await api.get<ApiResponse<RoleWithPermissions[]>>('/admin/roles');
    return res.data;
  },

  async getPermissions() {
    const res = await api.get<ApiResponse<string[]>>('/admin/permissions');
    return res.data;
  },

  async updateRolePermissions(roleId: number, permissions: string[]) {
    const res = await api.put<ApiResponse<RoleWithPermissions>>(
      `/admin/roles/${roleId}/permissions`,
      { permissions }
    );
    return res.data;
  },

  async createRole(name: string, permissions?: string[]) {
    const res = await api.post<ApiResponse<RoleWithPermissions>>('/admin/roles', { name, permissions });
    return res.data;
  },

  async deleteRole(roleId: number) {
    const res = await api.delete<ApiResponse<null>>(`/admin/roles/${roleId}`);
    return res.data;
  },

  // Error monitoring
  async getErrorLogs(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<ErrorLogEntry>>('/admin/error-logs', { params });
    return res.data;
  },

  async getErrorStats() {
    const res = await api.get<ApiResponse<ErrorStats>>('/admin/error-logs/stats');
    return res.data;
  },

  async deleteErrorLog(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/admin/error-logs/${id}`);
    return res.data;
  },

  async clearErrorLogs() {
    const res = await api.delete<ApiResponse<null>>('/admin/error-logs/clear');
    return res.data;
  },
};
