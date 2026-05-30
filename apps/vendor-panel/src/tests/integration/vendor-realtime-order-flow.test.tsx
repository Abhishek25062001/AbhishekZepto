import assert from 'node:assert/strict';
import { test } from 'node:test';

import { useVendorRealtimeStore } from '../../modules/realtime-store-operations/store/vendor-realtime.store';
import {
  VENDOR_REALTIME_EVENTS,
  type VendorOrderRealtimeEvent,
} from '../../modules/realtime-store-operations/types/vendor-realtime.types';
import { handleVendorRealtimePayload } from '../../modules/realtime-store-operations/utils/vendor-realtime-event-handler.util';
import { applyVendorRealtimeOrderEventToList } from '../../modules/realtime-store-operations/utils/vendor-realtime-order-list.util';
import type { VendorOrderListItem } from '../../modules/orders/types/vendor-orders.types';

const incomingOrderFilter = (order: VendorOrderListItem): boolean =>
  order.orderStatus === 'placed' && order.storeStatus === 'pending_acceptance';

const activeOrderFilter = (order: VendorOrderListItem): boolean =>
  order.orderStatus !== 'cancelled' && order.storeStatus === 'accepted';

const getLastOrderEvent = (): VendorOrderRealtimeEvent => {
  const event = useVendorRealtimeStore.getState().lastOrderEvent;
  assert.ok(event);
  return event;
};

test('vendor realtime order flow prepends, updates, and removes rows', () => {
  useVendorRealtimeStore.getState().clearVendorRealtimeState();
  let incomingOrders: VendorOrderListItem[] = [];
  let activeOrders: VendorOrderListItem[] = [];

  handleVendorRealtimePayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.ORDER_CREATED,
      emittedAt: '2026-01-01T10:00:01.000Z',
      data: {
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        storeId: 'store-1',
        customerId: 'customer-1',
        orderStatus: 'placed',
        storeStatus: 'pending_acceptance',
        totalAmount: 250,
        itemCount: 2,
        updatedAt: '2026-01-01T10:00:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.ORDER_CREATED,
  );

  incomingOrders = applyVendorRealtimeOrderEventToList(
    incomingOrders,
    getLastOrderEvent(),
    incomingOrderFilter,
  );
  assert.deepEqual(
    incomingOrders.map((order) => order.orderId),
    ['order-1'],
  );

  handleVendorRealtimePayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
      emittedAt: '2026-01-01T10:01:01.000Z',
      data: {
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        storeId: 'store-1',
        customerId: 'customer-1',
        orderStatus: 'accepted',
        storeStatus: 'accepted',
        totalAmount: 250,
        itemCount: 2,
        updatedAt: '2026-01-01T10:01:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
  );

  const acceptedEvent = getLastOrderEvent();
  incomingOrders = applyVendorRealtimeOrderEventToList(
    incomingOrders,
    acceptedEvent,
    incomingOrderFilter,
  );
  activeOrders = applyVendorRealtimeOrderEventToList(
    activeOrders,
    acceptedEvent,
    activeOrderFilter,
  );
  assert.deepEqual(incomingOrders, []);
  assert.equal(activeOrders[0]?.orderStatus, 'accepted');

  handleVendorRealtimePayload(
    {
      eventName: VENDOR_REALTIME_EVENTS.ORDER_CANCELLED,
      emittedAt: '2026-01-01T10:02:01.000Z',
      data: {
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        storeId: 'store-1',
        customerId: 'customer-1',
        orderStatus: 'cancelled',
        storeStatus: 'accepted',
        totalAmount: 250,
        itemCount: 2,
        updatedAt: '2026-01-01T10:02:00.000Z',
      },
    },
    VENDOR_REALTIME_EVENTS.ORDER_CANCELLED,
  );

  activeOrders = applyVendorRealtimeOrderEventToList(
    activeOrders,
    getLastOrderEvent(),
    activeOrderFilter,
  );
  assert.deepEqual(activeOrders, []);
});
