import { z } from 'zod';

const nameSchema = z
  .string({ error: 'Name is required' })
  .trim()
  .min(2, { error: 'Name must be at least 2 characters long' })
  .transform((val) => {
    return val.replace(/\b\w/g, (char) => char.toUpperCase());
  });

const emailSchema = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .max(254, { error: 'Email is too long' })
  .pipe(z.email({ error: 'Please enter a valid email address' }));

const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters long' })
  .max(72, { error: 'Password must be at most 72 characters long' })
  .regex(/[A-Z]/, {
    error: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    error: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, { error: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, {
    error: 'Password must contain at least one special character',
  });

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
