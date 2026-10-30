import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';

const OTP_LENGTH = 6;
const OTP_MAX = 10 ** OTP_LENGTH;
const HASH_ALGORITHM = 'sha256';

export function generateOTP(): string {
  return randomInt(0, OTP_MAX).toString().padStart(OTP_LENGTH, '0');
}

export function hashOTP(email: string, otp: string): string {
  return createHmac(HASH_ALGORITHM, env.OTP_SECRET).update(`${email}:${otp}`).digest('hex');
}

export function matchOTP(email: string, otp: string, storedHash: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false;
  }

  const actual = Buffer.from(hashOTP(email, otp), 'hex');
  const expected = Buffer.from(storedHash, 'hex');

  return timingSafeEqual(actual, expected);
}
