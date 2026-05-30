import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { DELIVERY_STATUS_VALUES } from '../constants/delivery-status.constant';
import { DELIVERY_SLA_STATUS_VALUES } from '../constants/delivery-sla.constant';

/**
 * Validates path parameters for POST /api/v1/admin/deliveries/:deliveryId/dispatch.
 */
export const dispatchParamSchema = z.object({
  deliveryId: mongoObjectIdValidator,
});

/**
 * Validates query parameters for GET /api/v1/admin/deliveries/pending.
 */
export const pendingListQuerySchema = z.object({
  cityId: mongoObjectIdValidator.optional(),
});

/**
 * Validates path parameters containing assignmentId.
 */
export const assignmentParamSchema = z.object({
  assignmentId: mongoObjectIdValidator,
});

export const pickedUpBodySchema = z.object({
  verificationMethod: z.enum(['otp', 'barcode', 'manual']).optional(),
  verificationValue: z.string().optional(),
  notes: z.string().max(500).optional(),
}).optional();

/**
 * Validates the body for delivered transition request.
 */
export const deliveredBodySchema = z.object({
  verificationMethod: z.enum(['otp', 'photo', 'manual']).optional(),
  verificationValue: z.string().optional(),
  notes: z.string().max(500).optional(),
}).optional();

/**
 * Validates the body for failed transition request.
 */
export const failedBodySchema = z.object({
  failureReason: z.string({ required_error: 'failureReason is required' }).trim().min(1, 'Reason cannot be empty'),
});

// ---------------------------------------------------------------------------
// Module 15 — Admin Delivery Operations Validators
// ---------------------------------------------------------------------------

/**
 * Validates query parameters for GET /api/v1/admin/deliveries (admin list).
 */
export const adminDeliveryListQuerySchema = z.object({
  status: z.enum(DELIVERY_STATUS_VALUES).optional(),
  agentId: mongoObjectIdValidator.optional(),
  storeId: mongoObjectIdValidator.optional(),
  cityId: mongoObjectIdValidator.optional(),
  slaStatus: z.enum(DELIVERY_SLA_STATUS_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Validates path parameter for GET /api/v1/admin/deliveries/:deliveryId
 * and POST /api/v1/admin/deliveries/:deliveryId/override.
 */
export const deliveryIdParamSchema = z.object({
  deliveryId: mongoObjectIdValidator,
});

/**
 * Validates request body for POST /api/v1/admin/deliveries/:deliveryId/override.
 */
export const adminOverrideBodySchema = z.object({
  targetStatus: z.enum(['cancelled', 'failed'] as const, {
    required_error: 'targetStatus is required',
    invalid_type_error: 'targetStatus must be "cancelled" or "failed"',
  }),
  reason: z
    .string({ required_error: 'reason is required' })
    .trim()
    .min(5, 'reason must be at least 5 characters'),
});
