import { z } from 'zod';

const objectIdString = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId');

export const initiateCheckoutBodyValidator = z
  .object({
    addressId: objectIdString,
    storeId: objectIdString.optional(),
    idempotencyKey: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

export const getCheckoutSummaryQueryValidator = z
  .object({
    checkoutSessionId: objectIdString.optional(),
  })
  .strict();

export const cancelCheckoutBodyValidator = z
  .object({
    checkoutSessionId: objectIdString,
    reason: z.string().trim().min(1).max(200).optional(),
  })
  .strict();
