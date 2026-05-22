import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { VEHICLE_TYPE_VALUES, AVAILABILITY_STATUS_VALUES } from '../constants/delivery-agent-status.constant';

/**
 * Validates the body for PATCH /api/v1/delivery/profile.
 * All fields are optional — send only what you want to change.
 *
 * NOT allowed in this body: availabilityStatus, userId, phone, isVerified, isActive.
 * availabilityStatus is owned by Module 3 (PATCH /api/v1/delivery/availability).
 */
export const updateProfileBodySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(200).nullable().optional(),
  profilePhotoUrl: z.string().trim().url().max(500).nullable().optional(),
  vehicleType: z.enum(VEHICLE_TYPE_VALUES).optional(),
  vehicleNumber: z.string().trim().max(50).nullable().optional(),
});

/**
 * Validates the body for PATCH /api/v1/delivery/availability.
 */
export const updateAvailabilityBodySchema = z.object({
  status: z.enum(AVAILABILITY_STATUS_VALUES, {
    errorMap: () => ({ message: 'Status must be online or offline' }),
  }),
});

/**
 * Validates query parameters for GET /api/v1/admin/agents.
 */
export const adminAgentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  availabilityStatus: z.string().optional(),
  cityId: mongoObjectIdValidator.optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => {
      if (v === 'true') return true;
      if (v === 'false') return false;

      return undefined;
    }),
});

/**
 * Validates the :agentId path parameter for GET /api/v1/admin/agents/:agentId.
 */
export const agentIdParamSchema = z.object({
  agentId: mongoObjectIdValidator,
});
