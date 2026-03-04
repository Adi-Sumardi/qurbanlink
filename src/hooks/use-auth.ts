'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      const isSuperAdmin = response.data.user.roles?.includes('super_admin');
      router.replace(isSuperAdmin ? '/admin' : '/dashboard');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      router.replace('/dashboard');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
      router.replace('/login');
    },
  });
}

export function useMe() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.me();
      setUser(response.data);
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      router.replace('/login');
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: () => authService.resendVerification(),
  });
}
