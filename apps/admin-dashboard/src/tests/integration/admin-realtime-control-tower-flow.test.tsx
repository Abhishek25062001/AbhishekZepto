import assert from 'node:assert/strict';
import test from 'node:test';

import { useAdminRealtimeStore } from '../../modules/realtime-control-tower/store/admin-realtime.store';
import { ADMIN_REALTIME_EVENTS } from '../../modules/realtime-control-tower/types/control-tower-realtime.types';
import { applyAdminRealtimeEventsToMetrics } from '../../modules/realtime-control-tower/utils/control-tower-metrics.util';
import { handleAdminRealtimePayload } from '../../modules/realtime-control-tower/utils/admin-realtime-event-handler.util';
import { applyAdminRealtimeDeliveryEventToLocations } from '../../modules/realtime-control-tower/utils/live-delivery-locations.util';
import { applyAdminRealtimeOrderEventToList } from '../../modules/realtime-control-tower/utils/live-orders.util';
import { applyAdminRealtimeSlaEventToList } from '../../modules/realtime-control-tower/utils/live-sla-breaches.util';

const now = '2026-05-30T00:00:00.000Z';

test('admin realtime control tower flow applies socket payloads to live view state', () => {
  useAdminRealtimeStore.getState().clearAdminRealtimeState();

  handleAdminRealtimePayload(
    {
      emittedAt: now,
      data: {
        cityId: 'city-1',
        customerId: 'customer-1',
        grandTotal: 250,
        itemCount: 2,
        orderId: 'order-1',
        orderNumber: 'ORD-1',
        orderStatus: 'placed',
        storeId: 'store-1',
        updatedAt: now,
      },
    },
    ADMIN_REALTIME_EVENTS.ORDER_CREATED,
  );

  const orderEvent = useAdminRealtimeStore.getState().lastOrderEvent;
  const orders = applyAdminRealtimeOrderEventToList([], orderEvent);
  const orderMetrics = applyAdminRealtimeEventsToMetrics(
    {
      activeOrdersCount: 0,
      assignedRidersCount: 0,
      delayedOrdersCount: 0,
      openSlaBreachesCount: 0,
      outForDeliveryCount: 0,
    },
    orderEvent,
    null,
    null,
  );

  assert.equal(orders.length, 1);
  assert.equal(orderMetrics.activeOrdersCount, 1);

  handleAdminRealtimePayload(
    {
      emittedAt: now,
      data: {
        cityId: 'city-1',
        currentLatitude: 12.91,
        currentLongitude: 77.64,
        deliveryAgentId: 'agent-1',
        deliveryId: 'delivery-1',
        deliveryStatus: 'en_route_to_customer',
        orderId: 'order-1',
        updatedAt: '2026-05-30T00:01:00.000Z',
      },
    },
    ADMIN_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
  );

  const deliveryEvent = useAdminRealtimeStore.getState().lastDeliveryEvent;
  const deliveries = applyAdminRealtimeDeliveryEventToLocations([], deliveryEvent);

  assert.equal(deliveries.length, 1);
  assert.equal(deliveries[0]?.latitude, 12.91);

  handleAdminRealtimePayload(
    {
      emittedAt: now,
      data: {
        assignmentId: 'delivery-1',
        breachedAt: '2026-05-30T00:02:00.000Z',
        breachId: 'breach-1',
        breachType: 'delivery_sla',
        cityId: 'city-1',
        deliveryId: 'delivery-1',
        escalationLevel: 'level_1',
        orderId: 'order-1',
      },
    },
    ADMIN_REALTIME_EVENTS.DELIVERY_SLA_BREACH_CREATED,
  );

  const slaEvent = useAdminRealtimeStore.getState().lastSlaEvent;
  const breaches = applyAdminRealtimeSlaEventToList([], slaEvent);
  const finalMetrics = applyAdminRealtimeEventsToMetrics(
    orderMetrics,
    null,
    deliveryEvent,
    slaEvent,
  );

  assert.equal(breaches.length, 1);
  assert.equal(finalMetrics.outForDeliveryCount, 1);
  assert.equal(finalMetrics.openSlaBreachesCount, 1);
});

