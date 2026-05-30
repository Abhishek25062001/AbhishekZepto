"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const realtime_order_store_1 = require("../../modules/realtime-order-experience/store/realtime-order.store");
const realtime_order_types_1 = require("../../modules/realtime-order-experience/types/realtime-order.types");
(0, node_test_1.test)('Phase 7 customer realtime records order and delivery events without refresh', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
    realtime_order_store_1.useRealtimeOrderStore.getState().addRealtimeOrderEvent({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
        orderId: 'order-1',
        orderStatus: 'accepted',
        updatedAt: '2026-05-30T10:00:00.000Z',
    });
    realtime_order_store_1.useRealtimeOrderStore.getState().addDeliveryTrackingEvent({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        deliveryAgentId: 'agent-1',
        customerId: 'customer-1',
        storeId: 'store-1',
        cityId: 'city-1',
        progressStatus: 'en_route_to_customer',
        currentLatitude: 12.9,
        currentLongitude: 77.6,
        lastLocationUpdatedAt: '2026-05-30T10:00:00.000Z',
        estimatedDeliveryAt: null,
        updatedAt: '2026-05-30T10:00:00.000Z',
    });
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().realtimeOrderEvents.length, 1);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().deliveryTrackingEvents[0]?.currentLatitude, 12.9);
});
(0, node_test_1.test)('Phase 7 customer realtime tracks disconnect and room restoration inputs', () => {
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom('order-1');
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(false);
    strict_1.default.deepEqual(realtime_order_store_1.useRealtimeOrderStore.getState().activeOrderRooms, ['order-1']);
    strict_1.default.equal(realtime_order_store_1.useRealtimeOrderStore.getState().connectionState, 'disconnected');
});
