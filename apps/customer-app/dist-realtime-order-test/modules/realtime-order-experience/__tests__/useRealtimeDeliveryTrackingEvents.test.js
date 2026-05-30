"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const useRealtimeDeliveryTrackingEvents_1 = require("../hooks/useRealtimeDeliveryTrackingEvents");
const realtime_order_store_1 = require("../store/realtime-order.store");
const realtime_order_types_1 = require("../types/realtime-order.types");
const buildLocationPayload = (lastLocationUpdatedAt) => ({
    emittedAt: lastLocationUpdatedAt,
    data: {
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        deliveryAgentId: 'agent-1',
        customerId: 'customer-1',
        storeId: 'store-1',
        cityId: 'city-1',
        progressStatus: 'en_route_to_customer',
        currentLatitude: 28.6139,
        currentLongitude: 77.209,
        lastLocationUpdatedAt,
        updatedAt: lastLocationUpdatedAt,
    },
});
node_test_1.test.afterEach(() => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
});
(0, node_test_1.test)('delivery tracking event handler stores location event', () => {
    (0, useRealtimeDeliveryTrackingEvents_1.handleRealtimeDeliveryTrackingPayload)(buildLocationPayload('2026-05-30T01:00:00.000Z'), realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().deliveryTrackingEvents.length, 1);
});
(0, node_test_1.test)('delivery tracking event handler ignores stale location event', () => {
    (0, useRealtimeDeliveryTrackingEvents_1.handleRealtimeDeliveryTrackingPayload)(buildLocationPayload('2026-05-30T01:02:00.000Z'), realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    (0, useRealtimeDeliveryTrackingEvents_1.handleRealtimeDeliveryTrackingPayload)(buildLocationPayload('2026-05-30T01:01:00.000Z'), realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().deliveryTrackingEvents.length, 1);
});
