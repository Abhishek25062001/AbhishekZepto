import { z } from 'zod';

const profileNameValidator = z.union([
  z.string().trim().min(1).max(100),
  z.null(),
]);

const profileEmailValidator = z.union([
  z.string().trim().email().max(254),
  z.null(),
]);

export const updateProfileBodyValidator = z
  .object({
    name: profileNameValidator.optional(),
    email: profileEmailValidator.optional(),
  })
  .refine((body) => body.name !== undefined || body.email !== undefined, {
    message: 'At least one of name or email is required',
  });
