import api from '@/lib/api';
import type { ApiResponse } from '@/types';

export const reportService = {
  async getDistribution(eventId: string) {
    const res = await api.get<ApiResponse<Record<string, unknown>>>(
      `/events/${eventId}/reports/distribution`
    );
    return res.data;
  },

  async getUnclaimed(eventId: string) {
    const res = await api.get<ApiResponse<Record<string, unknown>>>(
      `/events/${eventId}/reports/unclaimed`
    );
    return res.data;
  },

  async getPerAnimal(eventId: string) {
    const res = await api.get<ApiResponse<Record<string, unknown>>>(
      `/events/${eventId}/reports/per-animal`
    );
    return res.data;
  },

  async export(eventId: string, params: { format: 'pdf' | 'excel' }) {
    const res = await api.get<Blob>(
      `/events/${eventId}/reports/export`,
      { params, responseType: 'blob' }
    );
    return res.data;
  },
};
