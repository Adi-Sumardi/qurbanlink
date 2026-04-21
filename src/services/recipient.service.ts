import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Recipient,
  RecipientFormData,
} from '@/types';

export const recipientService = {
  async getAll(eventId: string, params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Recipient>>(
      `/events/${eventId}/recipients`,
      { params }
    );
    return res.data;
  },

  async create(eventId: string, data: RecipientFormData) {
    const res = await api.post<ApiResponse<Recipient>>(
      `/events/${eventId}/recipients`,
      data
    );
    return res.data;
  },

  async getById(eventId: string, recipientId: string) {
    const res = await api.get<ApiResponse<Recipient>>(
      `/events/${eventId}/recipients/${recipientId}`
    );
    return res.data;
  },

  async update(eventId: string, recipientId: string, data: RecipientFormData) {
    const res = await api.put<ApiResponse<Recipient>>(
      `/events/${eventId}/recipients/${recipientId}`,
      data
    );
    return res.data;
  },

  async delete(eventId: string, recipientId: string) {
    const res = await api.delete<ApiResponse<null>>(
      `/events/${eventId}/recipients/${recipientId}`
    );
    return res.data;
  },

  async import(eventId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<{ imported: number; errors: string[] }>>(
      `/events/${eventId}/recipients/import`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  },

  async export(eventId: string) {
    const res = await api.get<Blob>(
      `/events/${eventId}/recipients/export`,
      { responseType: 'blob' }
    );
    return res.data;
  },

  async downloadTemplate() {
    const res = await api.get<Blob>(
      `/recipients/template`,
      { responseType: 'blob' }
    );
    return res.data;
  },

  async checkDuplicates(eventId: string) {
    const res = await api.post<ApiResponse<{ duplicates: Recipient[] }>>(
      `/events/${eventId}/recipients/check-duplicates`
    );
    return res.data;
  },
};
