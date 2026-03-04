import api from '@/lib/api';
import type { ApiResponse, Tenant } from '@/types';

export const tenantService = {
  async getProfile() {
    const res = await api.get<ApiResponse<Tenant>>('/tenant/profile');
    return res.data;
  },

  async updateProfile(data: Partial<Tenant>) {
    const res = await api.put<ApiResponse<Tenant>>('/tenant/profile', data);
    return res.data;
  },

  async updateSettings(data: Record<string, unknown>) {
    const res = await api.put<ApiResponse<Tenant>>('/tenant/settings', data);
    return res.data;
  },
};
