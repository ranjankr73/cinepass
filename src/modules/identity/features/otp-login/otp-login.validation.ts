import { z } from 'zod';
import { emailSchema } from '../../identity.validation.js';

export const requestOtpSchema = z.strictObject({
  email: emailSchema,
});

export const verifyOtpSchema = z.strictObject({
  email: emailSchema,
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});
