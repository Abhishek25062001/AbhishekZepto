import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';

export const orderIdParamValidator = z.object({
  orderId: mongoObjectIdValidator,
});

export const storeIdParamValidator = z.object({
  storeId: mongoObjectIdValidator,
});

export const agentIdParamValidator = z.object({
  agentId: mongoObjectIdValidator,
});

export const slaIdParamValidator = z.object({
  slaId: mongoObjectIdValidator,
});

export const adminActionReasonBodyValidator = z.object({
  reason: z.string().trim().min(5).max(500),
});

export const forceAssignAgentBodyValidator = adminActionReasonBodyValidator.extend({
  deliveryAgentId: mongoObjectIdValidator,
});

export const slaEscalationBodyValidator = adminActionReasonBodyValidator.extend({
  escalationLevel: z.coerce.number().int().min(1).max(5).default(1),
});
