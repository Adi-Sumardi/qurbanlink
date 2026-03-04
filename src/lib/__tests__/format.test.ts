import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatPercentage,
  formatWeight,
} from '../format';

describe('formatCurrency', () => {
  it('formats number as IDR currency', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('1.000.000');
    expect(result).toMatch(/Rp/);
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/Rp/);
    expect(result).toContain('0');
  });
});

describe('formatNumber', () => {
  it('formats number with Indonesian locale', () => {
    expect(formatNumber(1234567)).toBe('1.234.567');
  });

  it('formats small number', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('formatDate', () => {
  it('formats valid date string', () => {
    const result = formatDate('2025-06-15');
    expect(result).toContain('2025');
    expect(result).not.toBe('-');
  });

  it('returns dash for null', () => {
    expect(formatDate(null)).toBe('-');
  });
});

describe('formatDateTime', () => {
  it('formats valid datetime', () => {
    const result = formatDateTime('2025-06-15T10:30:00');
    expect(result).toContain('2025');
    expect(result).not.toBe('-');
  });

  it('returns dash for null', () => {
    expect(formatDateTime(null)).toBe('-');
  });
});

describe('formatTime', () => {
  it('formats valid time', () => {
    const result = formatTime('2025-06-15T14:30:00');
    expect(result).not.toBe('-');
  });

  it('returns dash for null', () => {
    expect(formatTime(null)).toBe('-');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Baru saja" for less than 60 seconds ago', () => {
    expect(formatRelativeTime('2025-06-15T11:59:30Z')).toBe('Baru saja');
  });

  it('returns minutes ago', () => {
    expect(formatRelativeTime('2025-06-15T11:55:00Z')).toBe('5 menit lalu');
  });

  it('returns hours ago', () => {
    expect(formatRelativeTime('2025-06-15T09:00:00Z')).toBe('3 jam lalu');
  });

  it('returns days ago', () => {
    expect(formatRelativeTime('2025-06-13T12:00:00Z')).toBe('2 hari lalu');
  });

  it('falls back to formatDate for 7+ days', () => {
    const result = formatRelativeTime('2025-06-01T12:00:00Z');
    expect(result).toContain('2025');
  });
});

describe('formatPercentage', () => {
  it('calculates percentage', () => {
    expect(formatPercentage(75, 100)).toBe('75%');
  });

  it('returns 0% for zero total', () => {
    expect(formatPercentage(0, 0)).toBe('0%');
  });

  it('rounds to nearest integer', () => {
    expect(formatPercentage(1, 3)).toBe('33%');
  });
});

describe('formatWeight', () => {
  it('formats weight with kg suffix', () => {
    expect(formatWeight(150)).toContain('150');
    expect(formatWeight(150)).toContain('kg');
  });

  it('formats large weight with separator', () => {
    const result = formatWeight(1500);
    expect(result).toContain('kg');
    expect(result).toContain('1.500');
  });
});
