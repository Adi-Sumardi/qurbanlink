import { describe, it, expect } from 'vitest';
import {
  ANIMAL_TYPE_LABELS,
  ANIMAL_STATUS_LABELS,
  EVENT_STATUS_LABELS,
  COUPON_STATUS_LABELS,
  SCAN_RESULT_LABELS,
  PAYMENT_STATUS_LABELS,
  SUBSCRIPTION_PLAN_LABELS,
  DONOR_STATUS_LABELS,
  ROLES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../constants';

describe('Label maps', () => {
  it('ANIMAL_TYPE_LABELS has all types', () => {
    expect(Object.keys(ANIMAL_TYPE_LABELS)).toEqual(
      expect.arrayContaining(['sapi', 'kambing', 'domba', 'unta'])
    );
  });

  it('ANIMAL_STATUS_LABELS has all statuses', () => {
    expect(Object.keys(ANIMAL_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['registered', 'slaughtered', 'processed', 'distributed'])
    );
  });

  it('EVENT_STATUS_LABELS has all statuses', () => {
    expect(Object.keys(EVENT_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['draft', 'active', 'ongoing', 'completed', 'archived'])
    );
  });

  it('COUPON_STATUS_LABELS has all statuses', () => {
    expect(Object.keys(COUPON_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['generated', 'claimed', 'voided', 'expired'])
    );
  });

  it('SCAN_RESULT_LABELS has all results', () => {
    expect(Object.keys(SCAN_RESULT_LABELS)).toEqual(
      expect.arrayContaining(['success', 'already_claimed', 'invalid', 'expired', 'voided'])
    );
  });

  it('PAYMENT_STATUS_LABELS has all statuses', () => {
    expect(Object.keys(PAYMENT_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['pending', 'paid', 'failed', 'expired', 'refunded'])
    );
  });

  it('SUBSCRIPTION_PLAN_LABELS has all plans', () => {
    expect(Object.keys(SUBSCRIPTION_PLAN_LABELS)).toEqual(
      expect.arrayContaining(['free', 'starter', 'professional', 'enterprise'])
    );
  });

  it('DONOR_STATUS_LABELS has all statuses', () => {
    expect(Object.keys(DONOR_STATUS_LABELS)).toEqual(
      expect.arrayContaining(['pending', 'submitted'])
    );
  });
});

describe('ROLES', () => {
  it('has correct role values', () => {
    expect(ROLES.SUPER_ADMIN).toBe('super_admin');
    expect(ROLES.TENANT_ADMIN).toBe('tenant_admin');
    expect(ROLES.OPERATOR).toBe('operator');
    expect(ROLES.VIEWER).toBe('viewer');
  });
});

describe('Pagination', () => {
  it('DEFAULT_PAGE_SIZE is 15', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(15);
  });

  it('PAGE_SIZE_OPTIONS includes common sizes', () => {
    expect(PAGE_SIZE_OPTIONS).toContain(10);
    expect(PAGE_SIZE_OPTIONS).toContain(15);
    expect(PAGE_SIZE_OPTIONS).toContain(25);
    expect(PAGE_SIZE_OPTIONS).toContain(50);
  });
});
