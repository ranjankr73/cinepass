import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGINS: z.string().default(''),
  OTP_SECRET: z
    .string({
      error: 'OTP_SECRET is required in the environment variables',
    })
    .min(32, { message: 'OTP_SECRET must be at least 32 characters long' }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment configuration:');
  console.error(z.treeifyError(result.error));
  throw new Error('Environment validation failed');
}

export const env = result.data;

export const corsOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
