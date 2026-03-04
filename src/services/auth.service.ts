import api from '@/lib/api';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '@/types';

export const authService = {
  async register(data: RegisterRequest) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  async login(data: LoginRequest) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  async logout() {
    const res = await api.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  async me() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    const res = await api.post<ApiResponse<null>>('/auth/forgot-password', data);
    return res.data;
  },

  async resetPassword(data: ResetPasswordRequest) {
    const res = await api.post<ApiResponse<null>>('/auth/reset-password', data);
    return res.data;
  },

  async resendVerification() {
    const res = await api.post<ApiResponse<null>>('/auth/verify-email/resend');
    return res.data;
  },
};
