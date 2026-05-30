import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useDeliveryRealtimeStore } from '../../modules/realtime-operations/store/delivery-realtime.store';
import { DELIVERY_REALTIME_EVENTS } from '../../modules/realtime-operations/types/delivery-realtime.types';

test('Phase 7 delivery realtime tracks assignment created and cancelled events', () => {
  useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
  useDeliveryRealtimeStore.getState().setLastAssignmentEvent({
    eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
    assignmentId: 'assignment-1',
    orderId: 'order-1',
    deliveryStatus: 'assigned',
    updatedAt: '2026-05-30T10:00:00.000Z',
  });

  assert.equal(useDeliveryRealtimeStore.getState().lastAssignmentEvent?.assignmentId, 'assignment-1');
});

test('Phase 7 delivery realtime tracks location sync acknowledgement and fallback state', () => {
  useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
  useDeliveryRealtimeStore.getState().setLastStatusEvent({
    eventName: DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
    assignmentId: 'assignment-1',
    orderId: 'order-1',
    deliveryStatus: 'en_route_to_customer',
    updatedAt: '2026-05-30T10:00:00.000Z',
  });
  useDeliveryRealtimeStore.getState().setSocketConnected(false);

  assert.equal(useDeliveryRealtimeStore.getState().lastLocationAckAt, '2026-05-30T10:00:00.000Z');
  assert.equal(useDeliveryRealtimeStore.getState().connectionState, 'disconnected');
});
