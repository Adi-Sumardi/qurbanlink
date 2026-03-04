import api from '@/lib/api';
import type {
  ApiResponse,
  DistributionLocation,
  LocationFormData,
} from '@/types';

export const locationService = {
  async getAll(eventId: string) {
    const res = await api.get<ApiResponse<DistributionLocation[]>>(
      `/events/${eventId}/locations`
    );
    return res.data;
  },

  async create(eventId: string, data: LocationFormData) {
    const res = await api.post<ApiResponse<DistributionLocation>>(
      `/events/${eventId}/locations`,
      data
    );
    return res.data;
  },

  async getById(eventId: string, locationId: string) {
    const res = await api.get<ApiResponse<DistributionLocation>>(
      `/events/${eventId}/locations/${locationId}`
    );
    return res.data;
  },

  async update(eventId: string, locationId: string, data: LocationFormData) {
    const res = await api.put<ApiResponse<DistributionLocation>>(
      `/events/${eventId}/locations/${locationId}`,
      data
    );
    return res.data;
  },

  async delete(eventId: string, locationId: string) {
    const res = await api.delete<ApiResponse<null>>(
      `/events/${eventId}/locations/${locationId}`
    );
    return res.data;
  },
};
