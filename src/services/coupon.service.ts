import api from '@/lib/api';
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  Coupon,
  CouponGenerateData,
  CouponPrintData,
} from '@/types';

export const couponService = {
  async getAll(eventId: string, params?: QueryParams) {
    const res = await api.get<PaginatedResponse<Coupon>>(
      `/events/${eventId}/coupons`,
      { params }
    );
    return res.data;
  },

  async generate(eventId: string, data: CouponGenerateData) {
    const res = await api.post<ApiResponse<{ generated: number }>>(
      `/events/${eventId}/coupons/generate`,
      data
    );
    return res.data;
  },

  async printData(eventId: string) {
    const res = await api.get<ApiResponse<CouponPrintData>>(
      `/events/${eventId}/coupons/print`
    );
    return res.data;
  },

  async void(eventId: string, couponId: string, data?: { reason?: string }) {
    const res = await api.patch<ApiResponse<Coupon>>(
      `/events/${eventId}/coupons/${couponId}/void`,
      data
    );
    return res.data;
  },

  async regenerate(eventId: string, couponId: string) {
    const res = await api.post<ApiResponse<Coupon>>(
      `/events/${eventId}/coupons/${couponId}/regenerate`
    );
    return res.data;
  },
};
