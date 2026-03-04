import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Donor,
  DonorFormData,
} from '@/types';

export const donorService = {
  async getAll(eventId: string, params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Donor>>(
      `/events/${eventId}/donors`,
      { params }
    );
    return res.data;
  },

  async create(eventId: string, data: DonorFormData) {
    const res = await api.post<ApiResponse<Donor>>(
      `/events/${eventId}/donors`,
      data
    );
    return res.data;
  },

  async getById(eventId: string, donorId: string) {
    const res = await api.get<ApiResponse<Donor>>(
      `/events/${eventId}/donors/${donorId}`
    );
    return res.data;
  },

  async update(eventId: string, donorId: string, data: DonorFormData) {
    const res = await api.put<ApiResponse<Donor>>(
      `/events/${eventId}/donors/${donorId}`,
      data
    );
    return res.data;
  },

  async delete(eventId: string, donorId: string) {
    const res = await api.delete<ApiResponse<null>>(
      `/events/${eventId}/donors/${donorId}`
    );
    return res.data;
  },

  async import(eventId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<{ imported: number; errors: string[] }>>(
      `/events/${eventId}/donors/import`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  },

  async updateStatus(eventId: string, donorId: string, data: { status: string }) {
    const res = await api.patch<ApiResponse<Donor>>(
      `/events/${eventId}/donors/${donorId}/status`,
      data
    );
    return res.data;
  },
};
