import { z } from 'zod';

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

export const createPaymentOrderBodyValidator = z.object({
  checkoutSessionId: objectIdString,
  idempotencyKey: z.string().trim().min(1).max(128),
});

export const verifyPaymentBodyValidator = z.object({
  paymentId: objectIdString,
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  razorpaySignature: z.string().trim().min(1),
});

export const razorpayWebhookBodyValidator = z.object({
  event: z.string().trim().min(1),
  payload: z.record(z.unknown()).optional(),
});
