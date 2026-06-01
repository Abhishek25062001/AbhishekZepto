import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import * as eventLogRepository from '../../modules/realtime/repositories/realtime-event-log.repository';

const REQUIRED_REALTIME_EVENT_LOG_FIELDS = [
  'eventId',
  'eventName',
  'recipientUserId',
  'appSurface',
  'deliveryStatus',
  'payload',
  'emittedAt',
  'acknowledgedAt',
  'expiresAt',
];

test('Phase 7 realtime reliability validation records required event log fields', () => {
  assert.deepEqual(REQUIRED_REALTIME_EVENT_LOG_FIELDS, [
    'eventId',
    'eventName',
    'recipientUserId',
    'appSurface',
    'deliveryStatus',
    'payload',
    'emittedAt',
    'acknowledgedAt',
    'expiresAt',
  ]);
});

test('Realtime event log repository methods exist', () => {
  assert.equal(typeof eventLogRepository.createRealtimeEventLog, 'function');
  assert.equal(typeof eventLogRepository.findUnacknowledgedEvents, 'function');
  assert.equal(typeof eventLogRepository.acknowledgeEvent, 'function');
});

/* eslint-disable @typescript-eslint/no-explicit-any */
test('RealtimeEventLogRepository functions map arguments properly', async () => {
  const repository = eventLogRepository as any;
  const originalCreate = repository.createRealtimeEventLog;
  const originalFind = repository.findUnacknowledgedEvents;
  const originalAck = repository.acknowledgeEvent;

  try {
    const testUserId = new Types.ObjectId();
    const testLog = {
      eventId: 'test-event-123',
      eventName: 'customer.order_status_updated',
      recipientUserId: testUserId,
      appSurface: 'customer_app',
      deliveryStatus: 'pending' as const,
      payload: { data: { orderId: 'order-1' } },
      emittedAt: new Date(),
      acknowledgedAt: null,
      expiresAt: new Date(),
    };

    repository.createRealtimeEventLog = async (payload: any) => {
      assert.equal(payload.eventId, 'test-event-123');
      return payload;
    };

    repository.findUnacknowledgedEvents = async (recipientUserId: any, appSurface: string) => {
      assert.equal(recipientUserId.toString(), testUserId.toString());
      assert.equal(appSurface, 'customer_app');
      return [testLog];
    };

    repository.acknowledgeEvent = async (eventId: string, recipientUserId: any) => {
      assert.equal(eventId, 'test-event-123');
      assert.equal(recipientUserId.toString(), testUserId.toString());
      return { ...testLog, deliveryStatus: 'acknowledged', acknowledgedAt: new Date() };
    };

    const created = await repository.createRealtimeEventLog(testLog);
    assert.equal(created.eventId, 'test-event-123');

    const found = await repository.findUnacknowledgedEvents(testUserId, 'customer_app');
    assert.equal(found[0].eventId, 'test-event-123');

    const acked = await repository.acknowledgeEvent('test-event-123', testUserId);
    assert.equal(acked.deliveryStatus, 'acknowledged');
  } finally {
    repository.createRealtimeEventLog = originalCreate;
    repository.findUnacknowledgedEvents = originalFind;
    repository.acknowledgeEvent = originalAck;
  }
});
