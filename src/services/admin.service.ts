import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Tenant,
  AuditLog,
  Payment,
} from '@/types';

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
};
