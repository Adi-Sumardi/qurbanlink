import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Scan,
  ScanRequest,
  ManualScanRequest,
} from '@/types';

export const scanService = {
  async scan(eventId: string, data: ScanRequest) {
    const res = await api.post<ApiResponse<Scan>>(
      `/events/${eventId}/scan`,
      data
    );
    return res.data;
  },

  async manualScan(eventId: string, data: ManualScanRequest) {
    const res = await api.post<ApiResponse<Scan>>(
      `/events/${eventId}/scan/manual`,
      data
    );
    return res.data;
  },

  async getAll(eventId: string, params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Scan>>(
      `/events/${eventId}/scans`,
      { params }
    );
    return res.data;
  },

  async sync(eventId: string, scans: ScanRequest[]) {
    const res = await api.post<ApiResponse<{ synced: number; errors: string[] }>>(
      `/events/${eventId}/scans/sync`,
      scans
    );
    return res.data;
  },
};
