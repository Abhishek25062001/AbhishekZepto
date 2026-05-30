import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleRealtimeOrderPayload } from '../hooks/useRealtimeOrderEvents';
import { useRealtimeOrderStore } from '../store/realtime-order.store';
import {
  CUSTOMER_REALTIME_EVENTS,
  CUSTOMER_REALTIME_ORDER_STATUS,
} from '../types/realtime-order.types';

test.afterEach(() => {
  useRealtimeOrderStore.getState().clearRealtimeOrderState();
});

test('order event handler stores packed realtime order event', () => {
  handleRealtimeOrderPayload(
    {
      emittedAt: '2026-05-30T01:00:01.000Z',
      data: {
        orderId: 'order-1',
        orderStatus: 'packing',
        updatedAt: '2026-05-30T01:00:00.000Z',
      },
    },
    CUSTOMER_REALTIME_EVENTS.ORDER_PACKED,
  );

  const [event] = useRealtimeOrderStore.getState().realtimeOrderEvents;
  assert.equal(event?.orderStatus, CUSTOMER_REALTIME_ORDER_STATUS.PACKED);
});

test('order event handler stores delivered realtime order event', () => {
  handleRealtimeOrderPayload(
    {
      emittedAt: '2026-05-30T01:05:01.000Z',
      data: {
        orderId: 'order-1',
        orderStatus: 'delivered',
        updatedAt: '2026-05-30T01:05:00.000Z',
      },
    },
    CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
  );

  const [event] = useRealtimeOrderStore.getState().realtimeOrderEvents;
  assert.equal(event?.orderStatus, CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED);
});
