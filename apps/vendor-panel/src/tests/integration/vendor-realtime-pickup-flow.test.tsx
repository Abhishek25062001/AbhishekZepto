import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useVendorRealtimeStore } from '../../modules/realtime-store-operations/store/vendor-realtime.store';
import {
  VENDOR_REALTIME_EVENTS,
  type VendorPickupRealtimeEvent,
} from '../../modules/realtime-store-operations/types/vendor-realtime.types';
import { handleVendorRealtimePayload } from '../../modules/realtime-store-operations/utils/vendor-realtime-event-handler.util';
import { getVendorRealtimePickupStatusForOrder } from '../../modules/realtime-store-operations/utils/vendor-realtime-pickup-status.util';

const getLastPickupEvent = (): VendorPickupRealtimeEvent => {
  const event = useVendorRealtimeStore.getState().lastPickupEvent;
  assert.ok(event);
  return event;
};

test('vendor realtime pickup flow updates rider arrival and pickup completion states', () => {
  useVendorRealtimeStore.getState().clearVendorRealtimeState();

  handleVendorRealtimePayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
      emittedAt: '2026-01-01T10:05:01.000Z',
      data: {
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        arrivedAt: '2026-01-01T10:05:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
  );

  const arrivalEvent = getLastPickupEvent();
  assert.equal(arrivalEvent.pickupStatus, 'arrived_at_store');
  assert.equal(
    getVendorRealtimePickupStatusForOrder(arrivalEvent, 'order-1'),
    'arrived_at_store',
  );

  handleVendorRealtimePayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
      emittedAt: '2026-01-01T10:08:01.000Z',
      data: {
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupCompletedAt: '2026-01-01T10:08:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
  );

  const pickupEvent = getLastPickupEvent();
  assert.equal(pickupEvent.pickupStatus, 'pickup_completed');
  assert.equal(
    getVendorRealtimePickupStatusForOrder(pickupEvent, 'order-1'),
    'picked_up',
  );
});
