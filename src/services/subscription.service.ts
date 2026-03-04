import api from '@/lib/api';
import type { ApiResponse, Subscription, Payment } from '@/types';

interface SubscriptionPlanInfo {
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  coupon_quota: number;
  features: Record<string, unknown>;
}

interface SubscribeRequest {
  plan: string;
  billing_cycle: string;
}

export const subscriptionService = {
  async getPlans() {
    const res = await api.get<ApiResponse<SubscriptionPlanInfo[]>>(
      '/subscriptions/plans'
    );
    return res.data;
  },

  async getCurrent() {
    const res = await api.get<ApiResponse<Subscription>>('/subscriptions/current');
    return res.data;
  },

  async subscribe(data: SubscribeRequest) {
    const res = await api.post<ApiResponse<Subscription>>(
      '/subscriptions/subscribe',
      data
    );
    return res.data;
  },

  async getPayments() {
    const res = await api.get<ApiResponse<Payment[]>>('/subscriptions/payments');
    return res.data;
  },
};
