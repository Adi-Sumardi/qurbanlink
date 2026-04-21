export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Tawzii Digital';

export const ANIMAL_TYPE_LABELS: Record<string, string> = {
  sapi: 'Sapi',
  kambing: 'Kambing',
  domba: 'Domba',
  unta: 'Unta',
};

export const ANIMAL_STATUS_LABELS: Record<string, string> = {
  registered: 'Terdaftar',
  slaughtered: 'Disembelih',
  processed: 'Diproses',
  distributed: 'Didistribusikan',
};

export const EVENT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Aktif',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  archived: 'Diarsipkan',
};

export const COUPON_STATUS_LABELS: Record<string, string> = {
  generated: 'Dibuat',
  claimed: 'Diklaim',
  voided: 'Dibatalkan',
  expired: 'Kadaluarsa',
};

export const SCAN_RESULT_LABELS: Record<string, string> = {
  success: 'Berhasil',
  already_claimed: 'Sudah Diklaim',
  invalid: 'Tidak Valid',
  expired: 'Kadaluarsa',
  voided: 'Dibatalkan',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  failed: 'Gagal',
  expired: 'Kadaluarsa',
  refunded: 'Dikembalikan',
};

export const SUBSCRIPTION_PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

export const DONOR_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  submitted: 'Terkirim',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const;

export const DEFAULT_PAGE_SIZE = 15;
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const;
