import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  User,
} from '@/types';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
}

export const userService = {
  async getAll(params?: QueryParams) {
    const res = await api.get<PaginatedResponse<User>>('/users', { params });
    return res.data;
  },

  async create(data: UserFormData) {
    const res = await api.post<ApiResponse<User>>('/users', data);
    return res.data;
  },

  async getById(userId: string) {
    const res = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return res.data;
  },

  async update(userId: string, data: Partial<UserFormData>) {
    const res = await api.put<ApiResponse<User>>(`/users/${userId}`, data);
    return res.data;
  },

  async delete(userId: string) {
    const res = await api.delete<ApiResponse<null>>(`/users/${userId}`);
    return res.data;
  },

  async updateRole(userId: string, data: { role: string }) {
    const res = await api.patch<ApiResponse<User>>(`/users/${userId}/role`, data);
    return res.data;
  },
};
