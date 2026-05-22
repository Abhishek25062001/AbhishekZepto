import { writeAuditLog } from '../../audit';
import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import { ORDER_SLA_STATUS } from '../constants/order-sla.constant';
import {
  listOrdersForSlaEvaluation,
  updateOrderSlaById,
} from '../repositories/order.repository';
import type { OrderSlaMarkingResult } from '../types/order-sla.types';
import type { OrderRecord, OrderTimelineEvent } from '../types/order.types';
import { evaluateOrderSla } from './order-sla.service';

const buildSlaBreachTimelineEvent = ({
  evaluatedAt,
  order,
}: {
  evaluatedAt: Date;
  order: OrderRecord & { _id: { toString(): string } };
}): OrderTimelineEvent => ({
  actorId: null,
  actorRole: 'system',
  actorType: 'system',
  createdAt: evaluatedAt,
  event: ORDER_AUDIT_EVENTS.SLA_BREACHED,
  fromStatus: order.orderStatus,
  reason: 'sla_breached',
  toStatus: order.orderStatus,
});

export const markDelayedOrdersForSla = async (
  input: { evaluatedAt?: Date; limit?: number } = {},
): Promise<OrderSlaMarkingResult> => {
  const evaluatedAt = input.evaluatedAt ?? new Date();
  const orders = await listOrdersForSlaEvaluation({ limit: input.limit ?? 100 });
  let breachedCount = 0;
  let skippedCount = 0;

  for (const order of orders) {
    const evaluation = evaluateOrderSla(order, { evaluatedAt });

    if (
      evaluation.status !== ORDER_SLA_STATUS.BREACHED ||
      !evaluation.breachedStage ||
      (
        order.slaStatus === ORDER_SLA_STATUS.BREACHED &&
        order.slaBreachedStage === evaluation.breachedStage
      )
    ) {
      skippedCount += 1;
      continue;
    }

    await updateOrderSlaById(
      order._id.toString(),
      {
        slaBreachedStage: evaluation.breachedStage,
        slaStatus: ORDER_SLA_STATUS.BREACHED,
      },
      buildSlaBreachTimelineEvent({ evaluatedAt, order }),
    );
    await writeAuditLog({
      eventType: ORDER_AUDIT_EVENTS.SLA_BREACHED,
      actorId: null,
      actorRole: 'system',
      actorSurface: 'backend',
      entityType: 'order',
      entityId: order._id,
      vendorId: null,
      storeId: order.storeId,
      cityId: null,
      requestId: null,
      traceId: null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        evaluatedAt: evaluatedAt.toISOString(),
        newSlaStatus: ORDER_SLA_STATUS.BREACHED,
        orderId: order._id.toString(),
        previousSlaStatus: order.slaStatus,
        slaBreachedStage: evaluation.breachedStage,
      },
      status: 'success',
    });
    breachedCount += 1;
  }

  return {
    breachedCount,
    evaluatedCount: orders.length,
    skippedCount,
  };
};
