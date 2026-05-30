import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { INTERNAL_EVENT_NAMES } from '../../internal-events/constants/internal-event-names.constant';
import * as eventBusModule from '../../internal-events/services/internal-event-bus.service';
import type {
  InternalEventEnvelope,
  InternalEventHandler,
} from '../../internal-events/types/internal-event.types';
import * as deliveryPushServiceModule from '../services/delivery-push-notification.service';
import {
  registerPushNotificationSubscriber,
  unregisterPushNotificationSubscriber,
} from '../subscribers/push-notification.subscriber';

const eventBus = eventBusModule as unknown as {
  subscribeToInternalEvent: typeof eventBusModule.subscribeToInternalEvent;
  unsubscribeFromInternalEvent: typeof eventBusModule.unsubscribeFromInternalEvent;
};

const deliveryPushService = deliveryPushServiceModule as unknown as {
  sendAssignmentCreatedPush: typeof deliveryPushServiceModule.sendAssignmentCreatedPush;
  sendDeliveryFailedPush: typeof deliveryPushServiceModule.sendDeliveryFailedPush;
  sendOrderDeliveredPush: typeof deliveryPushServiceModule.sendOrderDeliveredPush;
  sendOrderOutForDeliveryPush: typeof deliveryPushServiceModule.sendOrderOutForDeliveryPush;
};

const buildEvent = (payload: Record<string, unknown>): InternalEventEnvelope => ({
  eventName: INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
  metadata: {
    actorId: null,
    actorRole: null,
    createdAt: '2026-05-30T10:00:00.000Z',
    eventId: 'event-1',
    eventName: INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    requestId: null,
    sourceModule: 'test',
    traceId: null,
  },
  payload,
});

afterEach(() => {
  unregisterPushNotificationSubscriber();
  eventBus.subscribeToInternalEvent = eventBusModule.subscribeToInternalEvent;
  eventBus.unsubscribeFromInternalEvent = eventBusModule.unsubscribeFromInternalEvent;
  deliveryPushService.sendAssignmentCreatedPush =
    deliveryPushServiceModule.sendAssignmentCreatedPush;
  deliveryPushService.sendDeliveryFailedPush = deliveryPushServiceModule.sendDeliveryFailedPush;
  deliveryPushService.sendOrderDeliveredPush = deliveryPushServiceModule.sendOrderDeliveredPush;
  deliveryPushService.sendOrderOutForDeliveryPush =
    deliveryPushServiceModule.sendOrderOutForDeliveryPush;
});

test('registerPushNotificationSubscriber subscribes to supported delivery events once', () => {
  const subscribedEvents: string[] = [];
  eventBus.subscribeToInternalEvent = (eventName) => {
    subscribedEvents.push(eventName);
  };
  eventBus.unsubscribeFromInternalEvent = () => undefined;

  registerPushNotificationSubscriber();
  registerPushNotificationSubscriber();

  assert.deepEqual(subscribedEvents, [
    INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED,
    INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY,
    INTERNAL_EVENT_NAMES.DELIVERY_COMPLETED,
    INTERNAL_EVENT_NAMES.DELIVERY_FAILED,
  ]);
});

test('assignment created handler sends delivery assignment push', async () => {
  const handlers = new Map<string, InternalEventHandler>();
  let capturedAgentId: string | null = null;

  eventBus.subscribeToInternalEvent = (eventName, handler) => {
    handlers.set(eventName, handler);
  };
  eventBus.unsubscribeFromInternalEvent = () => undefined;
  deliveryPushService.sendAssignmentCreatedPush = async (deliveryAgentId) => {
    capturedAgentId = deliveryAgentId;
    return [];
  };

  registerPushNotificationSubscriber();
  await handlers.get(INTERNAL_EVENT_NAMES.DELIVERY_ASSIGNMENT_CREATED)?.(
    buildEvent({ deliveryAgentId: 'agent-1' }),
  );

  assert.equal(capturedAgentId, 'agent-1');
});

test('delivery lifecycle handlers ignore events without customer id', async () => {
  const handlers = new Map<string, InternalEventHandler>();
  let callCount = 0;

  eventBus.subscribeToInternalEvent = (eventName, handler) => {
    handlers.set(eventName, handler);
  };
  eventBus.unsubscribeFromInternalEvent = () => undefined;
  deliveryPushService.sendOrderOutForDeliveryPush = async () => {
    callCount += 1;
    return [];
  };

  registerPushNotificationSubscriber();
  await handlers.get(INTERNAL_EVENT_NAMES.DELIVERY_OUT_FOR_DELIVERY)?.(buildEvent({ orderId: 'order-1' }));

  assert.equal(callCount, 0);
});
