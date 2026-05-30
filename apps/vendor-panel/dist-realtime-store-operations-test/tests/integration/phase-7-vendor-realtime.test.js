"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_store_1 = require("../../modules/realtime-store-operations/store/vendor-realtime.store");
const vendor_realtime_types_1 = require("../../modules/realtime-store-operations/types/vendor-realtime.types");
(0, node_test_1.test)('Phase 7 vendor realtime prepends order and pickup state inputs', () => {
    vendor_realtime_store_1.useVendorRealtimeStore.getState().clearVendorRealtimeState();
    vendor_realtime_store_1.useVendorRealtimeStore.getState().setLastOrderEvent({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'placed',
        totalAmount: 100,
        itemCount: 2,
        updatedAt: '2026-05-30T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    });
    vendor_realtime_store_1.useVendorRealtimeStore.getState().setLastPickupEvent({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
        orderId: 'order-1',
        assignmentId: 'assignment-1',
        riderId: 'rider-1',
        pickupStatus: 'arrived_at_store',
        arrivedAt: '2026-05-30T10:00:00.000Z',
        pickupCompletedAt: null,
        updatedAt: '2026-05-30T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
    });
    strict_1.default.equal(vendor_realtime_store_1.useVendorRealtimeStore.getState().lastOrderEvent?.eventName, 'vendor.order_created');
    strict_1.default.equal(vendor_realtime_store_1.useVendorRealtimeStore.getState().lastPickupEvent?.pickupStatus, 'arrived_at_store');
});
(0, node_test_1.test)('Phase 7 vendor realtime restores order rooms on reconnect input', () => {
    vendor_realtime_store_1.useVendorRealtimeStore.getState().clearVendorRealtimeState();
    vendor_realtime_store_1.useVendorRealtimeStore.getState().addOrderRoom('order-1');
    strict_1.default.deepEqual(vendor_realtime_store_1.useVendorRealtimeStore.getState().activeOrderRooms, ['order-1']);
});
