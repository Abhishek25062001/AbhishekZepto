import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, test } from 'node:test';
import { ORDER_NOTIFICATION_EVENTS } from '../constants/order-notification-events.constant';
import * as notificationRepositoryModule from '../repositories/order-notification-placeholder.repository';
import { publishOrderNotificationPlaceholders } from './order-notification-placeholder.service';

const notificationRepository = notificationRepositoryModule as unknown as {
  createOrderNotificationPlaceholders: typeof notificationRepositoryModule.createOrderNotificationPlaceholders;
};

afterEach(() => {
  notificationRepository.createOrderNotificationPlaceholders =
    notificationRepositoryModule.createOrderNotificationPlaceholders;
});

test('publishOrderNotificationPlaceholders creates customer vendor and admin records', async () => {
  const orderId = new Types.ObjectId();
  const customerId = new Types.ObjectId();
  const storeId = new Types.ObjectId();

  notificationRepository.createOrderNotificationPlaceholders = async (payloads) =>
    payloads.map((payload) => ({
      ...payload,
      createdAt: new Date('2026-05-21T10:00:00.000Z'),
      processedAt: null,
      recipientId: payload.recipient.recipientId,
      recipientType: payload.recipient.recipientType,
      updatedAt: new Date('2026-05-21T10:00:00.000Z'),
    }));

  const records = await publishOrderNotificationPlaceholders({
    event: ORDER_NOTIFICATION_EVENTS.STORE_ACCEPTED,
    metadata: { source: 'test' },
    order: {
      _id: orderId,
      customerId,
      orderNumber: 'ORD-NOTIFY',
      storeId,
    },
    timelineEvent: {
      actorId: storeId,
      actorType: 'store',
      reason: null,
    },
  });

  assert.equal(records.length, 3);
  assert.deepEqual(
    records.map((record) => record.recipientType).sort(),
    ['admin', 'customer', 'vendor'],
  );
  const [firstRecord] = records;
  assert.ok(firstRecord);
  assert.equal(firstRecord.event, ORDER_NOTIFICATION_EVENTS.STORE_ACCEPTED);
  assert.equal(firstRecord.metadata.orderNumber, 'ORD-NOTIFY');
  assert.equal(firstRecord.metadata.actorType, 'store');
});
