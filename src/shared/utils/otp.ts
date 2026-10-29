import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';

export function generateOTP(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function hashOTP(email: string, otp: string): string {
  return createHmac('sha256', env.OTP_SECRET).update(`${email}:${otp}`).digest('hex');
}

export function matchOTP(email: string, otp: string, storedHash: string): boolean {
  const actual = Buffer.from(hashOTP(email, otp), 'hex');
  const expected = Buffer.from(storedHash, 'hex');

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
