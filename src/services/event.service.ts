import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Event,
  EventFormData,
} from '@/types';

export const eventService = {
  async getAll(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Event>>('/events', { params });
    return res.data;
  },

  async create(data: EventFormData) {
    const res = await api.post<ApiResponse<Event>>('/events', data);
    return res.data;
  },

  async getById(eventId: string) {
    const res = await api.get<ApiResponse<Event>>(`/events/${eventId}`);
    return res.data;
  },

  async update(eventId: string, data: EventFormData) {
    const res = await api.put<ApiResponse<Event>>(`/events/${eventId}`, data);
    return res.data;
  },

  async delete(eventId: string) {
    const res = await api.delete<ApiResponse<null>>(`/events/${eventId}`);
    return res.data;
  },

  async activate(eventId: string) {
    const res = await api.patch<ApiResponse<Event>>(`/events/${eventId}/activate`);
    return res.data;
  },

  async complete(eventId: string) {
    const res = await api.patch<ApiResponse<Event>>(`/events/${eventId}/complete`);
    return res.data;
  },
};
