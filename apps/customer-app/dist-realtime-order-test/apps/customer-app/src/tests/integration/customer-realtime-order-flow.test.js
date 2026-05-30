"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const useRealtimeDeliveryTrackingEvents_1 = require("../../modules/realtime-order-experience/hooks/useRealtimeDeliveryTrackingEvents");
const useRealtimeOrderEvents_1 = require("../../modules/realtime-order-experience/hooks/useRealtimeOrderEvents");
const realtime_order_store_1 = require("../../modules/realtime-order-experience/store/realtime-order.store");
const realtime_order_types_1 = require("../../modules/realtime-order-experience/types/realtime-order.types");
(0, node_test_1.default)('customer realtime order flow joins a room and applies order and delivery events', () => {
    const orderId = 'order-realtime-1';
    realtime_order_store_1.useRealtimeOrderStore.getState().clearRealtimeOrderState();
    realtime_order_store_1.useRealtimeOrderStore.getState().setSocketConnected(true);
    realtime_order_store_1.useRealtimeOrderStore.getState().joinOrderRoom(orderId);
    (0, useRealtimeOrderEvents_1.handleRealtimeOrderPayload)({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY,
        emittedAt: '2026-05-30T08:00:00.000Z',
        data: {
            eventId: 'evt-out-for-delivery',
            orderId,
            orderStatus: 'shipped',
            updatedAt: '2026-05-30T08:00:00.000Z',
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_OUT_FOR_DELIVERY);
    (0, useRealtimeDeliveryTrackingEvents_1.handleRealtimeDeliveryTrackingPayload)({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED,
        emittedAt: '2026-05-30T08:01:00.000Z',
        data: {
            eventId: 'evt-location',
            orderId,
            assignmentId: 'assignment-1',
            deliveryAgentId: 'agent-1',
            customerId: 'customer-1',
            storeId: 'store-1',
            cityId: 'city-1',
            progressStatus: 'out_for_delivery',
            currentLatitude: 19.076,
            currentLongitude: 72.8777,
            lastLocationUpdatedAt: '2026-05-30T08:01:00.000Z',
            estimatedDeliveryAt: '2026-05-30T08:20:00.000Z',
            updatedAt: '2026-05-30T08:01:00.000Z',
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.DELIVERY_LOCATION_UPDATED);
    (0, useRealtimeOrderEvents_1.handleRealtimeOrderPayload)({
        eventName: realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED,
        emittedAt: '2026-05-30T08:18:00.000Z',
        data: {
            eventId: 'evt-delivered',
            orderId,
            orderStatus: 'delivered',
            updatedAt: '2026-05-30T08:18:00.000Z',
        },
    }, realtime_order_types_1.CUSTOMER_REALTIME_EVENTS.ORDER_DELIVERED);
    const state = realtime_order_store_1.useRealtimeOrderStore.getState();
    const latestOrderEvent = state.realtimeOrderEvents.at(-1);
    const latestTrackingEvent = state.deliveryTrackingEvents.at(-1);
    strict_1.default.deepEqual(state.activeOrderRooms, [orderId]);
    strict_1.default.equal(latestOrderEvent?.orderStatus, realtime_order_types_1.CUSTOMER_REALTIME_ORDER_STATUS.DELIVERED);
    strict_1.default.equal(latestTrackingEvent?.currentLatitude, 19.076);
    strict_1.default.equal(latestTrackingEvent?.currentLongitude, 72.8777);
    strict_1.default.equal(state.lastRealtimeEventAt, '2026-05-30T08:18:00.000Z');
});
