import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      if (typeof window !== 'undefined') {
        isLoggingOut = true;
        // Gunakan Zustand logout agar auth-storage juga ter-clear
        useAuthStore.getState().logout();
        // Biarkan auth-provider yang handle redirect ke /login
        isLoggingOut = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
