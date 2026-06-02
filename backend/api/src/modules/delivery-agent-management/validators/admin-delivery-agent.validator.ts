import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { AVAILABILITY_STATUS_VALUES } from '../../delivery/constants/delivery-agent-status.constant';
import { DELIVERY_STATUS_VALUES } from '../../delivery/constants/delivery-status.constant';

export const DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES = ['active', 'inactive'] as const;
export const DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES = ['verified', 'unverified'] as const;

export const deliveryAgentIdParamValidator = {
  params: z.object({
    deliveryAgentId: mongoObjectIdValidator,
  }),
};

export const updateDeliveryAgentStatusValidator = {
  body: z.object({
    status: z.enum(DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const updateDeliveryAgentVerificationValidator = {
  body: z.object({
    verificationStatus: z.enum(DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const listDeliveryAgentsQueryValidator = {
  query: z.object({
    status: z.enum(DELIVERY_AGENT_MANAGEMENT_STATUS_VALUES).optional(),
    availabilityStatus: z.enum(AVAILABILITY_STATUS_VALUES).optional(),
    verificationStatus: z.enum(DELIVERY_AGENT_MANAGEMENT_VERIFICATION_STATUS_VALUES).optional(),
    cityId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const listDeliveryAgentAssignmentsQueryValidator = {
  query: z.object({
    status: z.enum(DELIVERY_STATUS_VALUES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const listDeliveryAgentAuditQueryValidator = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};
