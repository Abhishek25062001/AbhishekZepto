import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import * as realtimeEmitterServiceModule from '../../realtime/services/realtime-emitter.service';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  publishInternalEvent,
} from '../services/internal-event-bus.service';
import { registerRealtimeEventSubscriber } from '../subscribers/realtime-event.subscriber';
import type { InternalEventMetadata } from '../types/internal-event.types';

type MutableRealtimeEmitterService = {
  emitAssignmentCreated: typeof realtimeEmitterServiceModule.emitAssignmentCreated;
  emitPickupCompleted: typeof realtimeEmitterServiceModule.emitPickupCompleted;
  emitDeliveryLocationUpdated: typeof realtimeEmitterServiceModule.emitDeliveryLocationUpdated;
  emitDeliveryCompleted: typeof realtimeEmitterServiceModule.emitDeliveryCompleted;
  emitSlaBreachCreated: typeof realtimeEmitterServiceModule.emitSlaBreachCreated;
};

const realtimeEmitterService =
  realtimeEmitterServiceModule as unknown as MutableRealtimeEmitterService;

const originalEmitAssignmentCreated = realtimeEmitterService.emitAssignmentCreated;
const originalEmitPickupCompleted = realtimeEmitterService.emitPickupCompleted;
const originalEmitDeliveryLocationUpdated = realtimeEmitterService.emitDeliveryLocationUpdated;
const originalEmitDeliveryCompleted = realtimeEmitterService.emitDeliveryCompleted;
const originalEmitSlaBreachCreated = realtimeEmitterService.emitSlaBreachCreated;

const buildMetadata = (
  eventName: InternalEventMetadata['eventName'],
): InternalEventMetadata => ({
  eventId: `event-${eventName}`,
  eventName,
  sourceModule: 'test',
  actorId: null,
  actorRole: null,
  requestId: null,
  traceId: null,
  createdAt: new Date('2026-05-29T00:00:00.000Z').toISOString(),
});

test.afterEach(() => {
  realtimeEmitterService.emitAssignmentCreated = originalEmitAssignmentCreated;
  realtimeEmitterService.emitPickupCompleted = originalEmitPickupCompleted;
  realtimeEmitterService.emitDeliveryLocationUpdated =
    originalEmitDeliveryLocationUpdated;
  realtimeEmitterService.emitDeliveryCompleted = originalEmitDeliveryCompleted;
  realtimeEmitterService.emitSlaBreachCreated = originalEmitSlaBreachCreated;
  clearInternalEventSubscribersForTests();
});

test('realtime subscriber routes delivery events to realtime emitters', () => {
  const calls: Array<{
    eventType: string;
    delivery: IDeliveryAssignmentDocument;
  }> = [];

  realtimeEmitterService.emitAssignmentCreated = (delivery) => {
    calls.push({ eventType: 'assignment_created', delivery });
  };
  realtimeEmitterService.emitPickupCompleted = (delivery) => {
    calls.push({ eventType: 'pickup_completed', delivery });
  };
  realtimeEmitterService.emitDeliveryLocationUpdated = (delivery) => {
    calls.push({ eventType: 'location_updated', delivery });
  };
  realtimeEmitterService.emitDeliveryCompleted = (delivery) => {
    calls.push({ eventType: 'completed', delivery });
  };
  realtimeEmitterService.emitSlaBreachCreated = (delivery) => {
    calls.push({ eventType: 'sla_breach_created', delivery });
  };

  registerRealtimeEventSubscriber();

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      storeId: 'store-1',
      cityId: 'city-1',
      assignmentStatus: 'assigned',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      storeId: 'store-1',
      pickupStatus: 'picked_up',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      progressStatus: 'arrived_at_customer',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_LOCATION_UPDATED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      completionStatus: 'delivered',
      completedAt: '2026-05-29T01:00:00.000Z',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED,
    {
      breachId: 'breach-1',
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      storeId: 'store-1',
      cityId: 'city-1',
      slaType: 'pickup',
      breachStatus: 'breached',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_SLA_BREACH_CREATED),
  );

  assert.deepEqual(
    calls.map((call) => call.eventType),
    [
      'assignment_created',
      'pickup_completed',
      'location_updated',
      'completed',
      'sla_breach_created',
    ],
  );
  assert.equal(calls[0]?.delivery.deliveryStatus, 'assigned');
  assert.equal(calls[3]?.delivery.completedAt?.toISOString(), '2026-05-29T01:00:00.000Z');
  assert.equal(calls[4]?.delivery.cityId?.toString(), 'city-1');
});
