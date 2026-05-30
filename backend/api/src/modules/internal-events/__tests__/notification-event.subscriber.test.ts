import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import * as deliveryNotificationServiceModule from '../../delivery/services/delivery-notification.service';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  publishInternalEvent,
} from '../services/internal-event-bus.service';
import { registerNotificationEventSubscriber } from '../subscribers/notification-event.subscriber';
import type { InternalEventMetadata } from '../types/internal-event.types';

type MutableDeliveryNotificationService = {
  publishDeliveryNotificationPlaceholders: typeof deliveryNotificationServiceModule.publishDeliveryNotificationPlaceholders;
};

const deliveryNotificationService =
  deliveryNotificationServiceModule as unknown as MutableDeliveryNotificationService;

const originalPublishDeliveryNotificationPlaceholders =
  deliveryNotificationService.publishDeliveryNotificationPlaceholders;

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
  deliveryNotificationService.publishDeliveryNotificationPlaceholders =
    originalPublishDeliveryNotificationPlaceholders;
  clearInternalEventSubscribersForTests();
});

test('notification subscriber routes delivery events to placeholder notifications', () => {
  const calls: Array<{
    delivery: IDeliveryAssignmentDocument;
    eventType: string;
  }> = [];

  deliveryNotificationService.publishDeliveryNotificationPlaceholders = async (
    delivery,
    eventType,
  ) => {
    calls.push({ delivery, eventType });
  };

  registerNotificationEventSubscriber();

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
      cityId: 'city-1',
      pickupStatus: 'picked_up',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_PICKUP_COMPLETED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      storeId: 'store-1',
      cityId: 'city-1',
      completionStatus: 'delivered',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED),
  );
  publishInternalEvent(
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
    {
      assignmentId: 'assignment-1',
      orderId: 'order-1',
      customerId: 'customer-1',
      deliveryAgentId: 'agent-1',
      storeId: 'store-1',
      cityId: 'city-1',
      progressStatus: 'failed',
    },
    buildMetadata(INTERNAL_EVENT_NAMES.DELIVERY_FAILED),
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
    ['assigned', 'picked_up', 'delivered', 'failed', 'sla_breached'],
  );
  assert.equal(calls[0]?.delivery._id?.toString(), 'assignment-1');
  assert.equal(calls[4]?.delivery.storeId?.toString(), 'store-1');
});
