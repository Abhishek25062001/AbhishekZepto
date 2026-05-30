import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';
import { DELIVERY_REALTIME_EVENTS } from '../types/delivery-realtime.types';

test('delivery realtime store tracks rooms without duplicates', () => {
  const store = useDeliveryRealtimeStore.getState();
  store.clearDeliveryRealtimeState();

  store.addAssignmentRoom(' assignment-1 ');
  store.addAssignmentRoom('assignment-1');

  assert.deepEqual(useDeliveryRealtimeStore.getState().activeAssignmentRooms, [
    'assignment-1',
  ]);

  useDeliveryRealtimeStore.getState().removeAssignmentRoom('assignment-1');
  assert.deepEqual(useDeliveryRealtimeStore.getState().activeAssignmentRooms, []);
});

test('delivery realtime store records location ack and clears sync errors', () => {
  const store = useDeliveryRealtimeStore.getState();
  store.clearDeliveryRealtimeState();
  store.setLocationSyncPaused(true);
  store.setLocationSyncError('location rejected');

  store.setLastStatusEvent({
    eventName: DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
    assignmentId: 'assignment-1',
    orderId: 'order-1',
    deliveryStatus: 'en_route_to_customer',
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: '2026-01-01T10:00:01.000Z',
    eventId: 'event-1',
    rejectionReason: null,
  });

  const state = useDeliveryRealtimeStore.getState();
  assert.equal(state.lastLocationAckAt, '2026-01-01T10:00:01.000Z');
  assert.equal(state.locationSyncPaused, false);
  assert.equal(state.locationSyncError, null);
});

