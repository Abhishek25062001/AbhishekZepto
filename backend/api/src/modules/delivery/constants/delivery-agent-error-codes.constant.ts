/**
 * Delivery agent error codes.
 *
 * These codes match the values documented in:
 * docs/errors/phase-6-delivery-error-codes.md
 */
export const DELIVERY_AGENT_ERROR_CODES = Object.freeze({
  NOT_FOUND: 'DELIVERY_AGENT_NOT_FOUND',
  ACCESS_FORBIDDEN: 'DELIVERY_ACCESS_FORBIDDEN',
  PROFILE_INCOMPLETE: 'DELIVERY_AGENT_PROFILE_INCOMPLETE',
  SCOPE_REQUIRED: 'DELIVERY_SCOPE_REQUIRED',
} as const);

export type DeliveryAgentErrorCode =
  (typeof DELIVERY_AGENT_ERROR_CODES)[keyof typeof DELIVERY_AGENT_ERROR_CODES];
