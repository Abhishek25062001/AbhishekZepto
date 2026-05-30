import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INTERNAL_EVENT_NAMES } from '../constants/internal-event-names.constant';
import {
  clearInternalEventSubscribersForTests,
  publishInternalEvent,
  subscribeToInternalEvent,
  unsubscribeFromInternalEvent,
} from '../services/internal-event-bus.service';
import type { InternalEventMetadata } from '../types/internal-event.types';

const buildMetadata = (
  eventName: InternalEventMetadata['eventName'],
): InternalEventMetadata => ({
  eventId: 'event-1',
  eventName,
  sourceModule: 'test',
  actorId: null,
  actorRole: null,
  requestId: null,
  traceId: null,
  createdAt: new Date('2026-05-29T00:00:00.000Z').toISOString(),
});

test.afterEach(() => {
  clearInternalEventSubscribersForTests();
});

test('internal event bus publishes envelopes to subscribers', () => {
  const received: unknown[] = [];

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_CREATED, (event) => {
    received.push(event);
  });

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_CREATED,
    { orderId: 'order-1' },
    buildMetadata(INTERNAL_EVENT_NAMES.ORDER_CREATED),
  );

  assert.equal(received.length, 1);
  assert.deepEqual(received[0], {
    eventName: INTERNAL_EVENT_NAMES.ORDER_CREATED,
    payload: { orderId: 'order-1' },
    metadata: buildMetadata(INTERNAL_EVENT_NAMES.ORDER_CREATED),
  });
});

test('internal event bus removes unsubscribed handlers', () => {
  let callCount = 0;
  const handler = () => {
    callCount += 1;
  };

  subscribeToInternalEvent(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED, handler);
  unsubscribeFromInternalEvent(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED, handler);

  publishInternalEvent(
    INTERNAL_EVENT_NAMES.ORDER_ACCEPTED,
    { orderId: 'order-1' },
    buildMetadata(INTERNAL_EVENT_NAMES.ORDER_ACCEPTED),
  );

  assert.equal(callCount, 0);
});

test('internal event bus rejects unknown event names', () => {
  assert.throws(
    () =>
      publishInternalEvent(
        'order.unknown' as InternalEventMetadata['eventName'],
        { orderId: 'order-1' },
        buildMetadata('order.unknown' as InternalEventMetadata['eventName']),
      ),
    /Unsupported internal event name/,
  );
});
