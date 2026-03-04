export enum SubscriptionPlan {
  Free = 'free',
  Starter = 'starter',
  Professional = 'professional',
  Enterprise = 'enterprise',
}

export enum SubscriptionStatus {
  Active = 'active',
  Expired = 'expired',
  Cancelled = 'cancelled',
  Suspended = 'suspended',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Expired = 'expired',
  Refunded = 'refunded',
}

export enum PaymentType {
  Subscription = 'subscription',
  AddonCoupon = 'addon_coupon',
}

export enum EventStatus {
  Draft = 'draft',
  Active = 'active',
  Ongoing = 'ongoing',
  Completed = 'completed',
  Archived = 'archived',
}

export enum AnimalType {
  Sapi = 'sapi',
  Kambing = 'kambing',
  Domba = 'domba',
  Unta = 'unta',
}

export enum AnimalStatus {
  Registered = 'registered',
  Slaughtered = 'slaughtered',
  Processed = 'processed',
  Distributed = 'distributed',
}

export enum DonorSubmissionStatus {
  Pending = 'pending',
  Submitted = 'submitted',
}

export enum CouponStatus {
  Generated = 'generated',
  Claimed = 'claimed',
  Voided = 'voided',
  Expired = 'expired',
}

export enum ScanMethod {
  Qr = 'qr',
  Manual = 'manual',
}

export enum ScanResult {
  Success = 'success',
  AlreadyClaimed = 'already_claimed',
  Invalid = 'invalid',
  Expired = 'expired',
  Voided = 'voided',
}
