import { z } from 'zod';

export const loginIdentifierSchema = z.object({
  identifier: z
    .string()
    .min(5, 'Login identifier must be at least 5 characters.')
    .max(80, 'Login identifier must be at most 80 characters.'),
});

export type LoginIdentifierFormValues = z.infer<typeof loginIdentifierSchema>;
