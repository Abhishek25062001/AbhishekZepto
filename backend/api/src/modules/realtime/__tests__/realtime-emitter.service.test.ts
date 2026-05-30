import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import * as socketRoomService from '../services/socket-room.service';
import {
  emitAssignmentCreated,
  emitDeliveryCompleted,
  emitDeliveryLocationUpdated,
  emitPickupCompleted,
  emitSlaBreachCreated,
} from '../services/realtime-emitter.service';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';

type MutableSocketRoomService = {
  emitToRoom: typeof socketRoomService.emitToRoom;
};

const mutableSocketRoomService = socketRoomService as unknown as MutableSocketRoomService;
const originalEmitToRoom = mutableSocketRoomService.emitToRoom;

const buildDelivery = (): IDeliveryAssignmentDocument =>
  ({
    _id: new Types.ObjectId(),
    orderId: new Types.ObjectId(),
    customerId: new Types.ObjectId(),
    storeId: new Types.ObjectId(),
    cityId: new Types.ObjectId(),
    deliveryAgentId: new Types.ObjectId(),
    deliveryStatus: 'assigned',
    assignedAt: new Date('2026-05-29T00:00:00.000Z'),
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
    slaStatus: 'on_time',
    slaBreachedStage: null,
    slaAssignmentDeadline: null,
    slaPickupDeadline: null,
    slaDropDeadline: null,
    slaTotalDeadline: null,
    slaBreachedAt: null,
    createdAt: new Date('2026-05-29T00:00:00.000Z'),
    updatedAt: new Date('2026-05-29T00:00:00.000Z'),
  }) as unknown as IDeliveryAssignmentDocument;

test.afterEach(() => {
  mutableSocketRoomService.emitToRoom = originalEmitToRoom;
});

test('realtime emitter publishes assignment, pickup, delivery, and SLA events to scoped rooms', () => {
  const emitted: Array<{ roomName: string; eventName: string; namespace?: string }> = [];
  mutableSocketRoomService.emitToRoom = (roomName, eventName, _payload, namespace) => {
    emitted.push({ roomName, eventName, namespace });
  };
  const delivery = buildDelivery();

  emitAssignmentCreated(delivery);
  emitPickupCompleted(delivery);
  emitDeliveryLocationUpdated(delivery);
  emitDeliveryCompleted(delivery);
  emitSlaBreachCreated(delivery);

  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === `delivery:${delivery.deliveryAgentId?.toString()}` &&
        event.eventName === 'delivery.assignment_created' &&
        event.namespace === '/delivery',
    ),
  );
  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === `vendor:${delivery.storeId.toString()}` &&
        event.eventName === 'vendor.pickup_completed',
    ),
  );
  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === `order:${delivery.orderId.toString()}` &&
        event.eventName === 'customer.delivery_location_updated',
    ),
  );
  assert.ok(
    emitted.some(
      (event) =>
        event.roomName === 'admin:operations' &&
        event.eventName === 'admin.delivery_sla_breach_created',
    ),
  );
});
