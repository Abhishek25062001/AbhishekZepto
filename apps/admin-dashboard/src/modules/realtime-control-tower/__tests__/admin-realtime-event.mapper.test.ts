import assert from 'node:assert/strict';
import test from 'node:test';

import { mapAdminRealtimeEventPayload } from '../utils/admin-realtime-event.mapper';
import { ADMIN_REALTIME_EVENTS } from '../types/control-tower-realtime.types';

const emittedAt = '2026-05-30T00:00:00.000Z';

test('maps admin order realtime payloads into live order events', () => {
  const event = mapAdminRealtimeEventPayload({
    emittedAt,
    data: {
      cityId: 'city-1',
      customerId: 'customer-1',
      grandTotal: 199,
      itemCount: 3,
      orderId: 'order-1',
      orderNumber: 'ORD-1',
      orderStatus: 'placed',
      storeId: 'store-1',
      updatedAt: emittedAt,
    },
  }, ADMIN_REALTIME_EVENTS.ORDER_CREATED);

  assert.equal(event?.eventName, ADMIN_REALTIME_EVENTS.ORDER_CREATED);
  assert.equal(event?.orderId, 'order-1');
  assert.equal(event?.order?.grandTotal, 199);
});

test('maps admin delivery realtime payloads into delivery events', () => {
  const event = mapAdminRealtimeEventPayload(
    {
      emittedAt,
      data: {
        currentLatitude: '12.91',
        currentLongitude: '77.64',
        deliveryAgentId: 'agent-1',
        deliveryId: 'delivery-1',
        deliveryStatus: 'en_route_to_customer',
        orderId: 'order-1',
        updatedAt: emittedAt,
      },
    },
    ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  assert.equal(event?.eventName, ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
  assert.equal(event?.deliveryId, 'delivery-1');
  assert.equal(event?.delivery?.latitude, 12.91);
});

test('maps admin sla breach payloads into sla events', () => {
  const event = mapAdminRealtimeEventPayload(
    {
      emittedAt,
      data: {
        assignmentId: 'assignment-1',
        breachedAt: emittedAt,
        breachId: 'breach-1',
        breachType: 'delivery_sla',
        escalationLevel: 'level_1',
        orderId: 'order-1',
      },
    },
    ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
  );

  assert.equal(event?.eventName, ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED);
  assert.equal(event?.breachId, 'breach-1');
});
