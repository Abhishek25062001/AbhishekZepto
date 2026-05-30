import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useDeliveryStore } from '../../store/delivery.store';
import { handleDeliveryRealtimePayload } from '../../modules/realtime-operations/hooks/useDeliveryRealtimeEvents';
import { useDeliveryRealtimeStore } from '../../modules/realtime-operations/store/delivery-realtime.store';
import { DELIVERY_REALTIME_EVENTS } from '../../modules/realtime-operations/types/delivery-realtime.types';

test('delivery realtime active flow applies pickup and active delivery status updates', () => {
  useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
  useDeliveryStore.getState().clearCurrentDelivery();

  handleDeliveryRealtimePayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
      emittedAt: '2026-01-01T10:05:01.000Z',
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        pickupStatus: 'picked_up',
        pickedUpAt: '2026-01-01T10:05:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
  );

  assert.equal(
    useDeliveryRealtimeStore.getState().lastStatusEvent?.eventName,
    DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
  );
  assert.equal(useDeliveryStore.getState().currentAssignmentId, 'assignment-1');
  assert.equal(useDeliveryStore.getState().currentDeliveryStatus, 'picked_up');

  handleDeliveryRealtimePayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
      emittedAt: '2026-01-01T10:10:01.000Z',
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        progressStatus: 'arrived_at_customer',
        updatedAt: '2026-01-01T10:10:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
  );

  assert.equal(
    useDeliveryRealtimeStore.getState().lastStatusEvent?.eventName,
    DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
  );
  assert.equal(
    useDeliveryStore.getState().currentDeliveryStatus,
    'arrived_at_customer',
  );
});

test('delivery realtime active flow pauses location sync after rejection', () => {
  useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
  useDeliveryStore.getState().clearCurrentDelivery();

  handleDeliveryRealtimePayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
      emittedAt: '2026-01-01T10:11:01.000Z',
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        status: 'en_route_to_customer',
        rejectionReason: 'location too old',
        lastLocationUpdatedAt: '2026-01-01T10:11:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
  );

  const realtimeState = useDeliveryRealtimeStore.getState();
  assert.equal(
    realtimeState.lastStatusEvent?.eventName,
    DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
  );
  assert.equal(realtimeState.locationSyncPaused, true);
  assert.equal(realtimeState.locationSyncError, 'location too old');
  assert.equal(
    useDeliveryStore.getState().currentDeliveryStatus,
    'en_route_to_customer',
  );
});

