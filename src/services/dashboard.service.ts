import api from '@/lib/api';
import type { ApiResponse, DashboardStats, Scan } from '@/types';

export const dashboardService = {
  async getStats(eventId: string) {
    const res = await api.get<ApiResponse<DashboardStats>>(
      `/events/${eventId}/dashboard/stats`
    );
    return res.data;
  },

  async getLiveFeed(eventId: string) {
    const res = await api.get<ApiResponse<Scan[]>>(
      `/events/${eventId}/dashboard/live-feed`
    );
    return res.data;
  },
};
