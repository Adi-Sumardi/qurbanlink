import api from '@/lib/api';
import type { ApiResponse, DashboardStats, Scan } from '@/types';
import type { SubscriptionPlanInfo } from './subscription.service';

export const publicService = {
  async getPlans() {
    const res = await api.get<ApiResponse<SubscriptionPlanInfo[]>>(
      '/subscriptions/plans'
    );
    return res.data;
  },

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

