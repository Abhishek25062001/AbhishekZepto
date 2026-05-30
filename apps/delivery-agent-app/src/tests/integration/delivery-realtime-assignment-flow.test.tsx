import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useDeliveryStore } from '../../store/delivery.store';
import { handleDeliveryRealtimePayload } from '../../modules/realtime-operations/hooks/useDeliveryRealtimeEvents';
import { useDeliveryRealtimeStore } from '../../modules/realtime-operations/store/delivery-realtime.store';
import { DELIVERY_REALTIME_EVENTS } from '../../modules/realtime-operations/types/delivery-realtime.types';

test('delivery realtime assignment flow sets and clears active delivery state', () => {
  useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
  useDeliveryStore.getState().clearCurrentDelivery();

  handleDeliveryRealtimePayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
      emittedAt: '2026-01-01T10:00:01.000Z',
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        assignmentStatus: 'assigned',
        assignmentCode: 'DEL-100',
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  );

  assert.equal(
    useDeliveryRealtimeStore.getState().lastAssignmentEvent?.eventName,
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
  );
  assert.equal(useDeliveryStore.getState().currentAssignmentId, 'assignment-1');
  assert.equal(useDeliveryStore.getState().currentOrderId, 'order-1');
  assert.equal(useDeliveryStore.getState().currentDeliveryStatus, 'assigned');

  handleDeliveryRealtimePayload(
    {
      eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
      emittedAt: '2026-01-01T10:02:01.000Z',
      data: {
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        assignmentStatus: 'cancelled',
        updatedAt: '2026-01-01T10:02:00.000Z',
      },
    },
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
  );

  assert.equal(
    useDeliveryRealtimeStore.getState().lastAssignmentEvent?.eventName,
    DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
  );
  assert.equal(useDeliveryStore.getState().currentAssignmentId, null);
  assert.equal(useDeliveryStore.getState().currentOrderId, null);
  assert.equal(useDeliveryStore.getState().currentDeliveryStatus, null);
});

