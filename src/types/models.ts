import {
  AnimalStatus,
  AnimalType,
  CouponStatus,
  DonorSubmissionStatus,
  EventStatus,
  PaymentStatus,
  PaymentType,
  ScanMethod,
  ScanResult,
  SubscriptionPlan,
  SubscriptionStatus,
} from './enums';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  logo_path: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_path: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  roles: string[];
  permissions: string[];
  tenant: Tenant | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  coupon_quota: number;
  coupon_used: number;
  coupon_remaining: number;
  price: number;
  billing_cycle: string;
  starts_at: string | null;
  expires_at: string | null;
  grace_ends_at: string | null;
  cancelled_at: string | null;
  plan_details: Record<string, unknown> | null;
  created_at: string;
}

export interface Payment {
  id: string;
  payment_type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  invoice_number: string;
  invoice_url: string | null;
  paid_at: string | null;
  expired_at: string | null;
  created_at: string;
}

export interface DistributionLocation {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

export interface Event {
  id: string;
  slug: string;
  tenant_slug: string | null;
  name: string;
  description: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  year: number | string;
  status: EventStatus;
  settings: Record<string, unknown>;
  total_coupons: number;
  distributed: number;
  locations: DistributionLocation[] | null;
  created_by: User | null;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  nik: string | null;
  submission_status: DonorSubmissionStatus;
  notes: string | null;
  animals: Animal[] | null;
  animals_count: number | null;
  created_at: string;
}

export interface Animal {
  id: string;
  type: AnimalType;
  breed: string | null;
  weight: number;
  color: string | null;
  estimated_portions: number;
  status: AnimalStatus;
  slaughtered_at: string | null;
  photo_path: string | null;
  notes: string | null;
  donor: Donor | null;
  created_at: string;
}

export interface Recipient {
  id: string;
  name: string;
  nik: string | null;
  phone: string | null;
  address: string | null;
  rt_rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  category: string | null;
  portions: number;
  notes: string | null;
  coupons: Coupon[] | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  coupon_number: string;
  status: CouponStatus;
  generated_at: string;
  claimed_at: string | null;
  voided_at: string | null;
  void_reason: string | null;
  expires_at: string;
  recipient: Recipient | null;
  scan: Scan | null;
  created_at: string;
}

export interface Scan {
  id: string;
  scan_method: ScanMethod;
  scan_result: ScanResult;
  device_info: string | null;
  latitude: number | null;
  longitude: number | null;
  scanned_at: string;
  synced_at: string | null;
  scanned_by: User | null;
  coupon: Coupon | null;
  location: DistributionLocation | null;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  auditable_type: string;
  auditable_id: string;
  event: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  user: User | null;
  created_at: string;
}
