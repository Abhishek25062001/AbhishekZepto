import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

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

/**
 * Validates the body for picked-up transition request.
 */
export const pickedUpBodySchema = z.object({
  verificationMethod: z.enum(['otp', 'barcode', 'manual']).optional(),
  verificationValue: z.string().optional(),
  notes: z.string().max(500).optional(),
}).optional();

