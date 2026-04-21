import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/auth';
import { eventSchema, locationSchema } from '../validations/event';
import { animalSchema } from '../validations/animal';
import { recipientSchema } from '../validations/recipient';
import { donorSchema } from '../validations/donor';

describe('loginSchema', () => {
  it('accepts valid data', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validData = {
    organization_name: 'Masjid Al-Ikhlas',
    name: 'Ahmad',
    email: 'ahmad@example.com',
    password: 'password123',
    password_confirmation: 'password123',
  };

  it('accepts valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects password mismatch', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password_confirmation: 'different',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: '123',
      password_confirmation: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'bad' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts valid data', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'test@example.com',
      password: 'newpassword123',
      password_confirmation: 'newpassword123',
      token: 'abc-token',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password mismatch', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'test@example.com',
      password: 'newpassword123',
      password_confirmation: 'different',
      token: 'abc-token',
    });
    expect(result.success).toBe(false);
  });
});

describe('eventSchema', () => {
  it('accepts valid data', () => {
    const result = eventSchema.safeParse({ name: 'Kurban 2025', event_date: '2025-06-01' });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = eventSchema.safeParse({ name: 'K' });
    expect(result.success).toBe(false);
  });
});

describe('locationSchema', () => {
  it('accepts valid data', () => {
    const result = locationSchema.safeParse({ name: 'Masjid Al-Ikhlas' });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = locationSchema.safeParse({ name: 'M' });
    expect(result.success).toBe(false);
  });
});

describe('animalSchema', () => {
  it('accepts valid data', () => {
    const result = animalSchema.safeParse({
      donor_id: 'uuid-123',
      type: 'sapi',
      weight: 350,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing donor_id', () => {
    const result = animalSchema.safeParse({
      donor_id: '',
      type: 'sapi',
      weight: 350,
    });
    expect(result.success).toBe(false);
  });

  it('rejects weight less than 1', () => {
    const result = animalSchema.safeParse({
      donor_id: 'uuid-123',
      type: 'sapi',
      weight: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing type', () => {
    const result = animalSchema.safeParse({
      donor_id: 'uuid-123',
      type: '',
      weight: 350,
    });
    expect(result.success).toBe(false);
  });
});

describe('recipientSchema', () => {
  it('accepts valid data', () => {
    const result = recipientSchema.safeParse({ name: 'Pak Ahmad' });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = recipientSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
  });
});

describe('donorSchema', () => {
  it('accepts valid data', () => {
    const result = donorSchema.safeParse({ name: 'Bu Siti' });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = donorSchema.safeParse({ name: 'B' });
    expect(result.success).toBe(false);
  });

  it('accepts optional email when empty string', () => {
    const result = donorSchema.safeParse({ name: 'Bu Siti', email: '' });
    expect(result.success).toBe(true);
  });
});
