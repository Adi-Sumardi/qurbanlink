export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  path: string;
  links: PaginationLink[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  turnstile_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  organization_name: string;
  phone?: string;
  event_name: string;
  event_date: string;
  event_description?: string;
  plan?: string;
  turnstile_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface AuthResponse {
  user: import('./models').User;
  token: string;
  event_id?: string;
}

export interface EventFormData {
  name: string;
  description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  year?: number;
  status?: string;
  settings?: Record<string, unknown>;
}

export interface DonorFormData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  nik?: string;
  submission_status?: string;
  notes?: string;
  kurban_type?: 'pribadi' | 'patungan';
  participants?: { name: string }[];
}

export interface AnimalFormData {
  donor_id: string;
  type: string;
  breed?: string;
  weight: number;
  color?: string;
  estimated_portions?: number;
  notes?: string;
}

export interface RecipientFormData {
  name: string;
  nik?: string;
  phone?: string;
  address?: string;
  rt_rw?: string;
  kelurahan?: string;
  kecamatan?: string;
  category?: string;
  portions?: number;
  notes?: string;
}

export interface LocationFormData {
  name: string;
  address?: string;
  is_active?: boolean;
}

export interface CouponGenerateData {
  recipient_ids?: string[];
  generate_all?: boolean;
}

export interface ScanRequest {
  qr_payload: string;
  location_id?: string;
  scan_method?: string;
  latitude?: number;
  longitude?: number;
  device_info?: string;
}

export interface ManualScanRequest {
  coupon_number: string;
  location_id?: string;
}

export interface DashboardStats {
  total_recipients: number;
  total_coupons: number;
  total_distributed: number;
  total_unclaimed: number;
  distribution_percentage: number;
  by_category: Record<string, { total: number; distributed: number }>;
  by_status: Record<string, number>;
  hourly_distribution: { hour: string; count: number }[];
}

export interface CouponPrintItem {
  id: string;
  coupon_number: string;
  qr_payload: string;
  status: string;
  expires_at: string;
  recipient: {
    name: string;
    address: string | null;
    rt_rw: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    category: string | null;
    portions: number;
  };
}

export interface CouponPrintData {
  event: {
    name: string;
    event_date: string | null;
    year: number | string;
  };
  tenant: {
    name: string;
    city: string;
    address: string;
  };
  coupons: CouponPrintItem[];
  total: number;
}

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  status?: string;
  [key: string]: unknown;
}
