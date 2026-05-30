// ---------------------------------------------------------------------------
// Delivery SLA Constants
// Mirrors: backend/api/src/modules/orders/constants/order-sla.constant.ts
// ---------------------------------------------------------------------------

export const DELIVERY_SLA_STAGES = {
  ASSIGNMENT: 'assignment',
  PICKUP: 'pickup',
  DROP: 'drop',
  TOTAL: 'total',
} as const;

export const DELIVERY_SLA_STAGE_VALUES = [
  DELIVERY_SLA_STAGES.ASSIGNMENT,
  DELIVERY_SLA_STAGES.PICKUP,
  DELIVERY_SLA_STAGES.DROP,
  DELIVERY_SLA_STAGES.TOTAL,
] as const;

export type DeliverySlaStage = (typeof DELIVERY_SLA_STAGE_VALUES)[number];

// ---------------------------------------------------------------------------

export const DELIVERY_SLA_STATUS = {
  NOT_STARTED: 'not_started',
  ON_TIME: 'on_time',
  AT_RISK: 'at_risk',
  BREACHED: 'breached',
  NOT_APPLICABLE: 'not_applicable',
} as const;

export const DELIVERY_SLA_STATUS_VALUES = [
  DELIVERY_SLA_STATUS.NOT_STARTED,
  DELIVERY_SLA_STATUS.ON_TIME,
  DELIVERY_SLA_STATUS.AT_RISK,
  DELIVERY_SLA_STATUS.BREACHED,
  DELIVERY_SLA_STATUS.NOT_APPLICABLE,
] as const;

export type DeliverySlaStatus = (typeof DELIVERY_SLA_STATUS_VALUES)[number];

// ---------------------------------------------------------------------------
// Per-stage threshold config
// ---------------------------------------------------------------------------

export const DELIVERY_SLA_STAGE_CONFIG: Record<
  DeliverySlaStage,
  { atRiskAfterMinutes: number; breachAfterMinutes: number }
> = {
  [DELIVERY_SLA_STAGES.ASSIGNMENT]: {
    atRiskAfterMinutes: 3,
    breachAfterMinutes: 5,
  },
  [DELIVERY_SLA_STAGES.PICKUP]: {
    atRiskAfterMinutes: 10,
    breachAfterMinutes: 15,
  },
  [DELIVERY_SLA_STAGES.DROP]: {
    atRiskAfterMinutes: 20,
    breachAfterMinutes: 30,
  },
  // Total SLA — no at-risk threshold, only breach
  [DELIVERY_SLA_STAGES.TOTAL]: {
    atRiskAfterMinutes: Infinity,
    breachAfterMinutes: 45,
  },
};

// ---------------------------------------------------------------------------
// Terminal statuses — SLA evaluation skips these
// ---------------------------------------------------------------------------

export const DELIVERY_TERMINAL_STATUSES = new Set<string>([
  'delivered',
  'failed',
  'cancelled',
]);

// ---------------------------------------------------------------------------
// Breach audit / timeline event type
// ---------------------------------------------------------------------------

export const DELIVERY_SLA_BREACH_EVENT = 'delivery.sla.breached' as const;
