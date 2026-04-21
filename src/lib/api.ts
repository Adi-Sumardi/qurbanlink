import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000, // 15s request timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ── Request interceptor: attach Bearer token ──────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor: handle auth & rate-limit errors ─────────────────
// Use a flag + queue to ensure ONE logout across parallel 401 responses
let sessionExpiredHandled = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      // Only handle once — parallel requests may all return 401 simultaneously
      if (!sessionExpiredHandled && typeof window !== 'undefined') {
        sessionExpiredHandled = true;
        useAuthStore.getState().logout();
        toast.error('Sesi habis. Silakan login kembali.', { id: 'session-expired' });
        // Replace navigation so user cannot press Back to protected page
        setTimeout(() => {
          window.location.replace('/login');
        }, 1200);
      }
    } else if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      const waitMsg = retryAfter ? ` Coba lagi dalam ${retryAfter} detik.` : '';
      toast.error(message ?? `Terlalu banyak permintaan.${waitMsg}`, { id: 'rate-limited' });
    } else if (status === 403) {
      toast.error(message ?? 'Anda tidak memiliki akses ke fitur ini.', { id: 'forbidden' });
    }

    return Promise.reject(error);
  }
);

export default api;
