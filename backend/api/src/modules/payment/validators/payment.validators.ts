import { z } from 'zod';
import { PAYMENT_GATEWAY_VALUES } from '../constants/payment-gateway.constant';
import { PAYMENT_STATUS_VALUES } from '../constants/payment-status.constant';

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

export const paymentIdParamsValidator = z.object({
  paymentId: objectIdString,
});

export const verifyPaymentByIdBodyValidator = z
  .object({
    gatewayOrderId: z.string().trim().min(1).optional(),
    gatewayPaymentId: z.string().trim().min(1).optional(),
    gatewaySignature: z.string().trim().min(1).optional(),
    razorpayOrderId: z.string().trim().min(1).optional(),
    razorpayPaymentId: z.string().trim().min(1).optional(),
    razorpaySignature: z.string().trim().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    const orderId = value.gatewayOrderId ?? value.razorpayOrderId;
    const gatewayPaymentId = value.gatewayPaymentId ?? value.razorpayPaymentId;
    const signature = value.gatewaySignature ?? value.razorpaySignature;

    if (!orderId || !gatewayPaymentId || !signature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'gatewayOrderId, gatewayPaymentId, and gatewaySignature are required',
      });
    }
  });

export const listAdminPaymentsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  customerId: objectIdString.optional(),
  orderId: objectIdString.optional(),
  storeId: objectIdString.optional(),
  vendorId: objectIdString.optional(),
  cityId: objectIdString.optional(),
  paymentStatus: z.enum(PAYMENT_STATUS_VALUES).optional(),
  gateway: z.enum(PAYMENT_GATEWAY_VALUES).optional(),
  paymentMethod: z.string().trim().min(1).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().trim().min(1).optional(),
});

export const razorpayWebhookBodyValidator = z.object({
  event: z.string().trim().min(1),
  payload: z.record(z.unknown()).optional(),
});
