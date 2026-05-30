"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_store_1 = require("../../modules/realtime-store-operations/store/vendor-realtime.store");
const vendor_realtime_types_1 = require("../../modules/realtime-store-operations/types/vendor-realtime.types");
const vendor_realtime_event_handler_util_1 = require("../../modules/realtime-store-operations/utils/vendor-realtime-event-handler.util");
const vendor_realtime_order_list_util_1 = require("../../modules/realtime-store-operations/utils/vendor-realtime-order-list.util");
const incomingOrderFilter = (order) => order.orderStatus === 'placed' && order.storeStatus === 'pending_acceptance';
const activeOrderFilter = (order) => order.orderStatus !== 'cancelled' && order.storeStatus === 'accepted';
const getLastOrderEvent = () => {
    const event = vendor_realtime_store_1.useVendorRealtimeStore.getState().lastOrderEvent;
    strict_1.default.ok(event);
    return event;
};
(0, node_test_1.test)('vendor realtime order flow prepends, updates, and removes rows', () => {
    vendor_realtime_store_1.useVendorRealtimeStore.getState().clearVendorRealtimeState();
    let incomingOrders = [];
    let activeOrders = [];
    (0, vendor_realtime_event_handler_util_1.handleVendorRealtimePayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
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
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED);
    incomingOrders = (0, vendor_realtime_order_list_util_1.applyVendorRealtimeOrderEventToList)(incomingOrders, getLastOrderEvent(), incomingOrderFilter);
    strict_1.default.deepEqual(incomingOrders.map((order) => order.orderId), ['order-1']);
    (0, vendor_realtime_event_handler_util_1.handleVendorRealtimePayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED,
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
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_STATUS_UPDATED);
    const acceptedEvent = getLastOrderEvent();
    incomingOrders = (0, vendor_realtime_order_list_util_1.applyVendorRealtimeOrderEventToList)(incomingOrders, acceptedEvent, incomingOrderFilter);
    activeOrders = (0, vendor_realtime_order_list_util_1.applyVendorRealtimeOrderEventToList)(activeOrders, acceptedEvent, activeOrderFilter);
    strict_1.default.deepEqual(incomingOrders, []);
    strict_1.default.equal(activeOrders[0]?.orderStatus, 'accepted');
    (0, vendor_realtime_event_handler_util_1.handleVendorRealtimePayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CANCELLED,
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
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CANCELLED);
    activeOrders = (0, vendor_realtime_order_list_util_1.applyVendorRealtimeOrderEventToList)(activeOrders, getLastOrderEvent(), activeOrderFilter);
    strict_1.default.deepEqual(activeOrders, []);
});
