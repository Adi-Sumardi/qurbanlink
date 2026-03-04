import api from '@/lib/api';
import type { ApiResponse, DashboardStats, Scan } from '@/types';

export const publicService = {
  async getLiveDashboard(tenantSlug: string, eventSlug: string) {
    const res = await api.get<ApiResponse<DashboardStats>>(
      `/live/${tenantSlug}/${eventSlug}`
    );
    return res.data;
  },

  async getLiveFeed(tenantSlug: string, eventSlug: string) {
    const res = await api.get<ApiResponse<Scan[]>>(
      `/live/${tenantSlug}/${eventSlug}/feed`
    );
    return res.data;
  },
};
