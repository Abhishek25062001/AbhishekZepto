import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DELIVERY_STATUS } from '../../delivery/constants/delivery-status.constant';
import { mapDeliveryTrackingRealtimePayload } from '../utils/delivery-tracking-payload.mapper';

describe('mapDeliveryTrackingRealtimePayload', () => {
  it('maps only realtime delivery tracking fields', () => {
    const source = {
      _id: 'assignment-1',
      orderId: 'order-1',
      deliveryAgentId: 'agent-1',
      customerId: 'customer-1',
      storeId: 'store-1',
      cityId: 'city-1',
      deliveryStatus: DELIVERY_STATUS.EN_ROUTE_TO_CUSTOMER,
      currentLatitude: '28.6139',
      currentLongitude: 77.209,
      lastLocationUpdatedAt: new Date('2026-05-01T10:00:00.000Z'),
      estimatedDeliveryAt: new Date('2026-05-01T10:20:00.000Z'),
      updatedAt: new Date('2026-05-01T10:01:00.000Z'),
      __v: 1,
      deliveryOtp: '123456',
      proofImagePrivateMetadata: { bucket: 'private' },
      sessionToken: 'secret',
    };

    assert.deepEqual(mapDeliveryTrackingRealtimePayload(source), {
      orderId: 'order-1',
      assignmentId: 'assignment-1',
      deliveryAgentId: 'agent-1',
      customerId: 'customer-1',
      storeId: 'store-1',
      cityId: 'city-1',
      progressStatus: DELIVERY_STATUS.EN_ROUTE_TO_CUSTOMER,
      currentLatitude: 28.6139,
      currentLongitude: 77.209,
      lastLocationUpdatedAt: '2026-05-01T10:00:00.000Z',
      estimatedDeliveryAt: '2026-05-01T10:20:00.000Z',
      updatedAt: '2026-05-01T10:01:00.000Z',
    });
  });

  it('prefers explicit assignment and progress status fields', () => {
    const payload = mapDeliveryTrackingRealtimePayload({
      _id: 'fallback-assignment',
      assignmentId: 'assignment-2',
      orderId: 'order-2',
      deliveryAgentId: 'agent-2',
      customerId: 'customer-2',
      storeId: 'store-2',
      cityId: 'city-2',
      deliveryStatus: DELIVERY_STATUS.PICKED_UP,
      progressStatus: DELIVERY_STATUS.ARRIVED_AT_CUSTOMER,
      updatedAt: '2026-05-01T11:00:00.000Z',
    });

    assert.equal(payload.assignmentId, 'assignment-2');
    assert.equal(payload.progressStatus, DELIVERY_STATUS.ARRIVED_AT_CUSTOMER);
    assert.equal(payload.lastLocationUpdatedAt, '2026-05-01T11:00:00.000Z');
  });
});
