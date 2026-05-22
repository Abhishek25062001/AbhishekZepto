import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import {
  ORDER_SLA_STAGE_CONFIG,
  ORDER_SLA_STAGES,
  ORDER_SLA_STATUS,
  type OrderSlaStage,
} from '../constants/order-sla.constant';
import { ORDER_STATUS } from '../constants/order-status.constant';
import type { OrderSlaEvaluationInput, OrderSlaEvaluationResult } from '../types/order-sla.types';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';

const MINUTE_IN_MS = 60_000;

const TERMINAL_STATUSES = new Set<string>([
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.READY_FOR_PICKUP,
]);

const findLatestTimelineEvent = (
  timeline: OrderTimelineEvent[],
  eventType: string,
): OrderTimelineEvent | null =>
  [...timeline]
    .filter((event) => event.event === eventType)
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ?? null;

const resolveActiveSlaStage = (
  order: Pick<
    OrderRecord,
    | 'acceptedAt'
    | 'orderStatus'
    | 'packingStatus'
    | 'pickerStatus'
    | 'placedAt'
    | 'readyForPickupAt'
    | 'timeline'
  >,
): { stage: OrderSlaStage | null; startedAt: Date | null } => {
  if (TERMINAL_STATUSES.has(order.orderStatus)) {
    return { stage: null, startedAt: null };
  }

  if (order.orderStatus === ORDER_STATUS.PLACED) {
    return { stage: ORDER_SLA_STAGES.ACCEPTANCE, startedAt: order.placedAt };
  }

  if (order.orderStatus === ORDER_STATUS.ACCEPTED) {
    return { stage: ORDER_SLA_STAGES.PICKING, startedAt: order.acceptedAt };
  }

  const pickingCompletedAt =
    findLatestTimelineEvent(order.timeline, ORDER_AUDIT_EVENTS.PICKING_COMPLETED)?.createdAt ?? null;
  const packingStartedAt =
    findLatestTimelineEvent(order.timeline, ORDER_AUDIT_EVENTS.PACKING_STARTED)?.createdAt ?? null;
  const packingCompletedAt =
    findLatestTimelineEvent(order.timeline, ORDER_AUDIT_EVENTS.PACKING_COMPLETED)?.createdAt ?? null;

  if (order.orderStatus === ORDER_STATUS.PICKING) {
    if (order.pickerStatus === 'completed') {
      return {
        stage: ORDER_SLA_STAGES.PACKING,
        startedAt: pickingCompletedAt,
      };
    }

    return { stage: ORDER_SLA_STAGES.PICKING, startedAt: order.acceptedAt };
  }

  if (order.orderStatus === ORDER_STATUS.PACKING && order.packingStatus === 'completed') {
    return {
      stage: ORDER_SLA_STAGES.READY_FOR_PICKUP,
      startedAt: packingCompletedAt,
    };
  }

  if (order.orderStatus === ORDER_STATUS.PACKING) {
    return {
      stage: ORDER_SLA_STAGES.PACKING,
      startedAt: pickingCompletedAt ?? packingStartedAt,
    };
  }

  if (order.readyForPickupAt) {
    return { stage: null, startedAt: null };
  }

  return { stage: null, startedAt: null };
};

export const evaluateOrderSla = (
  order: Pick<
    OrderRecord,
    | 'acceptedAt'
    | 'orderStatus'
    | 'packingStatus'
    | 'pickerStatus'
    | 'placedAt'
    | 'readyForPickupAt'
    | 'timeline'
  >,
  input: OrderSlaEvaluationInput = {},
): OrderSlaEvaluationResult => {
  const evaluatedAt = input.evaluatedAt ?? new Date();
  const { stage, startedAt } = resolveActiveSlaStage(order);

  if (!stage) {
    return {
      breachedStage: null,
      evaluatedAt,
      stage: null,
      startedAt: null,
      status: ORDER_SLA_STATUS.NOT_APPLICABLE,
    };
  }

  if (!startedAt) {
    return {
      breachedStage: null,
      evaluatedAt,
      stage,
      startedAt: null,
      status: ORDER_SLA_STATUS.NOT_STARTED,
    };
  }

  const elapsedMinutes = Math.max(0, evaluatedAt.getTime() - startedAt.getTime()) / MINUTE_IN_MS;
  const config = ORDER_SLA_STAGE_CONFIG[stage];

  if (elapsedMinutes >= config.breachAfterMinutes) {
    return {
      breachedStage: stage,
      evaluatedAt,
      stage,
      startedAt,
      status: ORDER_SLA_STATUS.BREACHED,
    };
  }

  if (elapsedMinutes >= config.atRiskAfterMinutes) {
    return {
      breachedStage: null,
      evaluatedAt,
      stage,
      startedAt,
      status: ORDER_SLA_STATUS.AT_RISK,
    };
  }

  return {
    breachedStage: null,
    evaluatedAt,
    stage,
    startedAt,
    status: ORDER_SLA_STATUS.ON_TRACK,
  };
};
