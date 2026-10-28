import z from 'zod';

export const nameSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .refine((name) => name[0]?.toUpperCase() + name.substring(1));
export const emailSchema = z.string().trim().min(1).max(50).toLowerCase().pipe(z.email());
export const passwordSchema = z
  .string()
  .min(8)
  .max(255)
  .regex(/^[A-Z]/, 'Must contain uppercase')
  .regex(/^[a-z]/)
  .regex(/^[0-9]/);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
