import { writeAuditLog } from '../../audit';
import {
  DELIVERY_SLA_BREACH_EVENT,
  DELIVERY_SLA_STATUS,
} from '../constants/delivery-sla.constant';
import {
  listDeliveriesForSlaEvaluation,
  updateDeliverySlaById,
} from '../repositories/delivery-assignment.repository';
import type { DeliverySlaMarkingResult } from '../types/delivery-sla.types';
import type { IDeliveryAssignmentBase, IDeliveryTimelineEvent } from '../types/delivery-assignment.types';
import { evaluateDeliverySla } from './delivery-sla.service';
import { publishDeliveryNotificationPlaceholders } from './delivery-notification.service';
import { emitSlaBreachCreated } from '../../realtime/services/realtime-emitter.service';
import { publishSlaBreachCreated } from '../../internal-events/publishers/sla-event.publisher';
import { areInternalEventSubscribersRegistered } from '../../internal-events/services/internal-event-registry.service';

const buildSlaBreachTimelineEvent = ({
  evaluatedAt,
  delivery,
  breachedStage,
}: {
  evaluatedAt: Date;
  delivery: Pick<IDeliveryAssignmentBase, 'deliveryStatus'>;
  breachedStage: string;
}): IDeliveryTimelineEvent => ({
  actorId: null,
  actorType: 'system',
  fromStatus: delivery.deliveryStatus,
  toStatus: delivery.deliveryStatus,
  reason: `delivery.sla.breached:${breachedStage}`,
  createdAt: evaluatedAt,
});

export const markDelayedDeliveriesForSla = async (
  input: { evaluatedAt?: Date; limit?: number } = {},
): Promise<DeliverySlaMarkingResult> => {
  const evaluatedAt = input.evaluatedAt ?? new Date();
  const deliveries = await listDeliveriesForSlaEvaluation({ limit: input.limit ?? 100 });
  let breachedCount = 0;
  let skippedCount = 0;

  for (const delivery of deliveries) {
    const evaluation = evaluateDeliverySla(delivery, { evaluatedAt });

    // Skip if not breached, or if already breached with the exact same stage (idempotency check)
    if (
      evaluation.status !== DELIVERY_SLA_STATUS.BREACHED ||
      !evaluation.breachedStage ||
      (
        delivery.slaStatus === DELIVERY_SLA_STATUS.BREACHED &&
        delivery.slaBreachedStage === evaluation.breachedStage
      )
    ) {
      skippedCount += 1;
      continue;
    }

    const updated = await updateDeliverySlaById(
      delivery._id.toString(),
      {
        slaStatus: DELIVERY_SLA_STATUS.BREACHED,
        slaBreachedStage: evaluation.breachedStage,
        slaBreachedAt: evaluatedAt,
      },
      buildSlaBreachTimelineEvent({
        evaluatedAt,
        delivery,
        breachedStage: evaluation.breachedStage,
      }),
    );

    if (updated) {
      publishSlaBreachCreated(updated);
      if (!areInternalEventSubscribersRegistered()) {
        publishDeliveryNotificationPlaceholders(updated, 'sla_breached').catch((err) => {
          console.error('Failed to trigger SLA breach notification:', err);
        });
        emitSlaBreachCreated(updated);
      }
    }

    await writeAuditLog({
      eventType: DELIVERY_SLA_BREACH_EVENT,
      actorId: null,
      actorRole: 'system',
      actorSurface: 'backend',
      entityType: 'delivery',
      entityId: delivery._id,
      vendorId: null,
      storeId: delivery.storeId,
      cityId: delivery.cityId,
      requestId: null,
      traceId: null,
      ipAddress: null,
      userAgent: null,
      metadata: {
        evaluatedAt: evaluatedAt.toISOString(),
        newSlaStatus: DELIVERY_SLA_STATUS.BREACHED,
        deliveryId: delivery._id.toString(),
        previousSlaStatus: delivery.slaStatus,
        slaBreachedStage: evaluation.breachedStage,
      },
      status: 'success',
    });

    breachedCount += 1;
  }

  return {
    breachedCount,
    evaluatedCount: deliveries.length,
    skippedCount,
  };
};
