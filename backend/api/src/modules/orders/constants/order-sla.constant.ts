export const ORDER_SLA_STAGES = {
  ACCEPTANCE: 'acceptance',
  PACKING: 'packing',
  PICKING: 'picking',
  READY_FOR_PICKUP: 'ready_for_pickup',
} as const;

export const ORDER_SLA_STAGE_VALUES = [
  ORDER_SLA_STAGES.ACCEPTANCE,
  ORDER_SLA_STAGES.PICKING,
  ORDER_SLA_STAGES.PACKING,
  ORDER_SLA_STAGES.READY_FOR_PICKUP,
] as const;

export type OrderSlaStage = (typeof ORDER_SLA_STAGE_VALUES)[number];

export const ORDER_SLA_STATUS = {
  AT_RISK: 'at_risk',
  BREACHED: 'breached',
  NOT_APPLICABLE: 'not_applicable',
  NOT_STARTED: 'not_started',
  ON_TRACK: 'on_track',
} as const;

export const ORDER_SLA_STATUS_VALUES = [
  ORDER_SLA_STATUS.NOT_STARTED,
  ORDER_SLA_STATUS.ON_TRACK,
  ORDER_SLA_STATUS.AT_RISK,
  ORDER_SLA_STATUS.BREACHED,
  ORDER_SLA_STATUS.NOT_APPLICABLE,
] as const;

export type OrderSlaStatus = (typeof ORDER_SLA_STATUS_VALUES)[number];

export const ORDER_SLA_STAGE_CONFIG: Record<
  OrderSlaStage,
  { atRiskAfterMinutes: number; breachAfterMinutes: number }
> = {
  [ORDER_SLA_STAGES.ACCEPTANCE]: {
    atRiskAfterMinutes: 5,
    breachAfterMinutes: 10,
  },
  [ORDER_SLA_STAGES.PICKING]: {
    atRiskAfterMinutes: 10,
    breachAfterMinutes: 20,
  },
  [ORDER_SLA_STAGES.PACKING]: {
    atRiskAfterMinutes: 5,
    breachAfterMinutes: 10,
  },
  [ORDER_SLA_STAGES.READY_FOR_PICKUP]: {
    atRiskAfterMinutes: 5,
    breachAfterMinutes: 10,
  },
};
