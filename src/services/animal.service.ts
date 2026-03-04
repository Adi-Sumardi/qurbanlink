import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Animal,
  AnimalFormData,
} from '@/types';

export const animalService = {
  async getAll(eventId: string, params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Animal>>(
      `/events/${eventId}/animals`,
      { params }
    );
    return res.data;
  },

  async create(eventId: string, data: AnimalFormData) {
    const res = await api.post<ApiResponse<Animal>>(
      `/events/${eventId}/animals`,
      data
    );
    return res.data;
  },

  async getById(eventId: string, animalId: string) {
    const res = await api.get<ApiResponse<Animal>>(
      `/events/${eventId}/animals/${animalId}`
    );
    return res.data;
  },

  async update(eventId: string, animalId: string, data: AnimalFormData) {
    const res = await api.put<ApiResponse<Animal>>(
      `/events/${eventId}/animals/${animalId}`,
      data
    );
    return res.data;
  },

  async delete(eventId: string, animalId: string) {
    const res = await api.delete<ApiResponse<null>>(
      `/events/${eventId}/animals/${animalId}`
    );
    return res.data;
  },

  async updateStatus(eventId: string, animalId: string, data: { status: string }) {
    const res = await api.patch<ApiResponse<Animal>>(
      `/events/${eventId}/animals/${animalId}/status`,
      data
    );
    return res.data;
  },
};
