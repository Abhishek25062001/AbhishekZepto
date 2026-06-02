import { z } from 'zod';

import {
  DELIVERY_AGENT_STATUS_OPTIONS,
  DELIVERY_AGENT_VERIFICATION_OPTIONS,
} from '../constants/admin-delivery-agents.constants';

const statusValues = DELIVERY_AGENT_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]];
const verificationValues = DELIVERY_AGENT_VERIFICATION_OPTIONS.map(option => option.value) as [
  string,
  ...string[],
];

export const deliveryAgentStatusFormSchema = z.object({
  status: z.enum(statusValues),
  reason: z.string().trim().min(5).max(500),
});

export type DeliveryAgentStatusFormValues = z.input<typeof deliveryAgentStatusFormSchema>;

export const deliveryAgentVerificationFormSchema = z.object({
  verificationStatus: z.enum(verificationValues),
  reason: z.string().trim().min(5).max(500),
});

export type DeliveryAgentVerificationFormValues = z.input<
  typeof deliveryAgentVerificationFormSchema
>;
