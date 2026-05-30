/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, test } from 'node:test';
import * as notificationRepositoryModule from '../../orders/repositories/order-notification-placeholder.repository';
import * as orderRepositoryModule from '../../orders/repositories/order.repository';
import type { IDeliveryAssignmentDocument } from '../types/delivery-assignment.types';
import type { OrderRecord } from '../../orders/types/order.types';
import { publishDeliveryNotificationPlaceholders } from './delivery-notification.service';

const notificationRepository = notificationRepositoryModule as unknown as {
  createOrderNotificationPlaceholders: typeof notificationRepositoryModule.createOrderNotificationPlaceholders;
};

const orderRepository = orderRepositoryModule as unknown as {
  findOrderById: typeof orderRepositoryModule.findOrderById;
};

afterEach(() => {
  notificationRepository.createOrderNotificationPlaceholders =
    notificationRepositoryModule.createOrderNotificationPlaceholders;
  orderRepository.findOrderById = orderRepositoryModule.findOrderById;
});

const buildDelivery = (overrides: Partial<IDeliveryAssignmentDocument> = {}): IDeliveryAssignmentDocument => ({
  _id: new Types.ObjectId(),
  orderId: new Types.ObjectId(),
  customerId: new Types.ObjectId(),
  storeId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  deliveryAgentId: new Types.ObjectId(),
  deliveryStatus: 'assigned',
  assignedAt: new Date(),
  arrivedAtStoreAt: null,
  pickedUpAt: null,
  enRouteToCustomerAt: null,
  arrivedAtCustomerAt: null,
  completedAt: null,
  deliveredAt: null,
  failedAt: null,
  failureReason: null,
  cancelledAt: null,
  cancellationReason: null,
  timeline: [],
  slaStatus: 'not_started',
  slaBreachedStage: null,
  slaAssignmentDeadline: null,
  slaPickupDeadline: null,
  slaDropDeadline: null,
  slaTotalDeadline: null,
  slaBreachedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as unknown as IDeliveryAssignmentDocument);

test('publishDeliveryNotificationPlaceholders triggers queued placeholder notifications', async () => {
  const delivery = buildDelivery();
  const capturedPayloads: any[] = [];

  // Stub order fetch
  orderRepository.findOrderById = async () =>
    ({
      _id: delivery.orderId,
      orderNumber: 'ORD-NOTIFY-123',
    } as unknown as OrderRecord & { _id: Types.ObjectId });

  // Stub placeholder creation
  notificationRepository.createOrderNotificationPlaceholders = async (payloads) => {
    capturedPayloads.push(...payloads);
    return [];
  };

  // Test assigned event
  await publishDeliveryNotificationPlaceholders(delivery, 'assigned');

  assert.equal(capturedPayloads.length, 1);
  const [firstPayload] = capturedPayloads;
  assert.ok(firstPayload);
  assert.equal(firstPayload.title, 'New Assignment');
  assert.equal(firstPayload.body, 'Order #ORD-NOTIFY-123 is assigned to you');
  assert.equal(firstPayload.recipient.recipientType, 'agent');
  assert.equal(firstPayload.recipient.recipientId?.toString(), delivery.deliveryAgentId?.toString());
  assert.equal(firstPayload.status, 'queued_placeholder');

  // Test arrived_at_store event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'arrived_at_store');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Rider Arrived at Store');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'vendor');

  // Test picked_up event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'picked_up');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Order Picked Up');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'customer');

  // Test arrived_at_customer event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'arrived_at_customer');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Rider Arrived');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'customer');

  // Test delivered event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'delivered');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Order Delivered');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'customer');

  // Test failed event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'failed');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Delivery Failed');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'customer');

  // Test cancelled event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'cancelled');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Delivery Cancelled');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'customer');

  // Test sla_breached event
  capturedPayloads.length = 0;
  await publishDeliveryNotificationPlaceholders(delivery, 'sla_breached');

  assert.equal(capturedPayloads.length, 1);
  assert.equal(capturedPayloads[0].title, 'Delivery SLA Breach');
  assert.equal(capturedPayloads[0].recipient.recipientType, 'admin');
});
