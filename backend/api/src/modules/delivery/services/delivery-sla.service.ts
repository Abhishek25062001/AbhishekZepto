import {
  DELIVERY_SLA_STAGE_CONFIG,
  DELIVERY_SLA_STAGES,
  DELIVERY_SLA_STATUS,
  DELIVERY_TERMINAL_STATUSES,
  type DeliverySlaStage,
} from '../constants/delivery-sla.constant';
import type { DeliverySlaEvaluationInput, DeliverySlaEvaluationResult } from '../types/delivery-sla.types';
import type { IDeliveryAssignmentBase } from '../types/delivery-assignment.types';

const MINUTE_IN_MS = 60_000;

const resolveActiveSlaStage = (
  deliveryStatus: string,
  delivery: Pick<
    IDeliveryAssignmentBase,
    'createdAt' | 'assignedAt' | 'pickedUpAt'
  >,
): { stage: DeliverySlaStage | null; startedAt: Date | null } => {
  if (DELIVERY_TERMINAL_STATUSES.has(deliveryStatus)) {
    return { stage: null, startedAt: null };
  }

  if (deliveryStatus === 'pending_assignment') {
    return { stage: DELIVERY_SLA_STAGES.ASSIGNMENT, startedAt: delivery.createdAt };
  }

  if (
    deliveryStatus === 'assigned' ||
    deliveryStatus === 'en_route_to_store' ||
    deliveryStatus === 'arrived_at_store'
  ) {
    return { stage: DELIVERY_SLA_STAGES.PICKUP, startedAt: delivery.assignedAt };
  }

  if (
    deliveryStatus === 'picked_up' ||
    deliveryStatus === 'en_route_to_customer' ||
    deliveryStatus === 'arrived_at_customer'
  ) {
    return { stage: DELIVERY_SLA_STAGES.DROP, startedAt: delivery.pickedUpAt };
  }

  return { stage: null, startedAt: null };
};

export const evaluateDeliverySla = (
  delivery: Pick<
    IDeliveryAssignmentBase,
    'deliveryStatus' | 'createdAt' | 'assignedAt' | 'pickedUpAt' | 'deliveredAt' | 'slaStatus'
  >,
  input: DeliverySlaEvaluationInput = {},
): DeliverySlaEvaluationResult => {
  const evaluatedAt = input.evaluatedAt ?? new Date();

  // If terminal status, SLA is not applicable
  if (DELIVERY_TERMINAL_STATUSES.has(delivery.deliveryStatus)) {
    return {
      breachedStage: null,
      evaluatedAt,
      activeStage: null,
      startedAt: null,
      status: DELIVERY_SLA_STATUS.NOT_APPLICABLE,
    };
  }

  const { stage, startedAt } = resolveActiveSlaStage(delivery.deliveryStatus, delivery);

  if (!stage) {
    return {
      breachedStage: null,
      evaluatedAt,
      activeStage: null,
      startedAt: null,
      status: DELIVERY_SLA_STATUS.NOT_STARTED,
    };
  }

  if (!startedAt) {
    return {
      breachedStage: null,
      evaluatedAt,
      activeStage: stage,
      startedAt: null,
      status: DELIVERY_SLA_STATUS.NOT_STARTED,
    };
  }

  // Calculate breach times
  const activeConfig = DELIVERY_SLA_STAGE_CONFIG[stage];
  const activeBreachTime = startedAt.getTime() + activeConfig.breachAfterMinutes * MINUTE_IN_MS;
  const activeAtRiskTime = startedAt.getTime() + activeConfig.atRiskAfterMinutes * MINUTE_IN_MS;

  const totalConfig = DELIVERY_SLA_STAGE_CONFIG[DELIVERY_SLA_STAGES.TOTAL];
  const totalBreachTime = delivery.createdAt.getTime() + totalConfig.breachAfterMinutes * MINUTE_IN_MS;

  const evalTime = evaluatedAt.getTime();

  const isActiveBreached = evalTime >= activeBreachTime;
  const isTotalBreached = evalTime >= totalBreachTime;

  if (isActiveBreached || isTotalBreached) {
    // If both are breached, return the one that breached first (earlier breach time)
    let breachedStage: DeliverySlaStage = stage;
    if (isActiveBreached && isTotalBreached) {
      breachedStage = activeBreachTime <= totalBreachTime ? stage : DELIVERY_SLA_STAGES.TOTAL;
    } else if (isTotalBreached) {
      breachedStage = DELIVERY_SLA_STAGES.TOTAL;
    }

    return {
      breachedStage,
      evaluatedAt,
      activeStage: stage,
      startedAt,
      status: DELIVERY_SLA_STATUS.BREACHED,
    };
  }

  if (evalTime >= activeAtRiskTime) {
    return {
      breachedStage: null,
      evaluatedAt,
      activeStage: stage,
      startedAt,
      status: DELIVERY_SLA_STATUS.AT_RISK,
    };
  }

  return {
    breachedStage: null,
    evaluatedAt,
    activeStage: stage,
    startedAt,
    status: DELIVERY_SLA_STATUS.ON_TIME,
  };
};
