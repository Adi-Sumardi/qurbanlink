import api from '@/lib/api';
import type { ApiResponse, Subscription, Payment } from '@/types';

export interface SubscriptionPlanInfo {
  id?: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  coupon_quota: number;
  features: Record<string, boolean>;
  is_active?: boolean;
}

interface SubscribeRequest {
  plan: string;
  billing_cycle: 'monthly' | 'yearly';
}

export interface MidtransPaymentResult {
  snap_token: string | null;
  payment_url: string | null;
  invoice_number: string | null;
  amount: number;
  is_free: boolean;
}

export const subscriptionService = {
  async getPlans() {
    const res = await api.get<ApiResponse<SubscriptionPlanInfo[]>>('/subscriptions/plans');
    return res.data;
  },

  async getCurrent() {
    const res = await api.get<ApiResponse<Subscription>>('/subscriptions/current');
    return res.data;
  },

  /** Creates a Midtrans Snap session — endpoint: POST /subscriptions/subscribe */
  async createPayment(data: SubscribeRequest) {
    const res = await api.post<ApiResponse<MidtransPaymentResult>>(
      '/subscriptions/subscribe',
      data
    );
    return res.data;
  },

  /** Poll payment status by invoice number */
  async getPaymentStatus(invoiceNumber: string) {
    const res = await api.get<ApiResponse<{ status: string; paid_at: string | null }>>
      (`/subscriptions/payment-status?invoice=${invoiceNumber}`);
    return res.data;
  },

  async getPayments() {
    const res = await api.get<ApiResponse<Payment[]>>('/subscriptions/payments');
    return res.data;
  },

  /** Re-generate Snap token for an existing pending payment */
  async resumePayment(paymentId: string) {
    const res = await api.post<ApiResponse<MidtransPaymentResult>>(
      `/subscriptions/payments/${paymentId}/resume`
    );
    return res.data;
  },

  /** Cancel a pending payment (user-initiated) */
  async cancelPayment(paymentId: string) {
    const res = await api.post<ApiResponse<null>>(
      `/subscriptions/payments/${paymentId}/cancel`
    );
    return res.data;
  },

  /** Create Midtrans Snap payment for coupon top-up. quantity must be multiple of 10. */
  async couponTopup(quantity: number) {
    const res = await api.post<ApiResponse<MidtransPaymentResult & { quantity: number }>>(
      '/subscriptions/topup-coupon',
      { quantity }
    );
    return res.data;
  },

  /** Re-activate subscription for paid payment that was not activated (webhook failure recovery). */
  async syncSubscription() {
    const res = await api.post<ApiResponse<Subscription>>('/subscriptions/sync');
    return res.data;
  },
};
