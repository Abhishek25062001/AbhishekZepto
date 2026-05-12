import { z } from 'zod';

export const loginPhoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters.')
    .max(15, 'Phone number must be at most 15 characters.'),
});

export type LoginPhoneFormValues = z.infer<typeof loginPhoneSchema>;
