"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const vendor_realtime_store_1 = require("../store/vendor-realtime.store");
const vendor_realtime_types_1 = require("../types/vendor-realtime.types");
(0, node_test_1.test)('vendor realtime store tracks socket state and clears connection errors', () => {
    const store = vendor_realtime_store_1.useVendorRealtimeStore.getState();
    store.clearVendorRealtimeState();
    store.setConnectionError('offline');
    store.setSocketConnected(true);
    const state = vendor_realtime_store_1.useVendorRealtimeStore.getState();
    strict_1.default.equal(state.socketConnected, true);
    strict_1.default.equal(state.connectionState, 'connected');
    strict_1.default.equal(state.connectionError, null);
});
(0, node_test_1.test)('vendor realtime store tracks order rooms without duplicates', () => {
    const store = vendor_realtime_store_1.useVendorRealtimeStore.getState();
    store.clearVendorRealtimeState();
    store.addOrderRoom(' order-1 ');
    store.addOrderRoom('order-1');
    strict_1.default.deepEqual(vendor_realtime_store_1.useVendorRealtimeStore.getState().activeOrderRooms, ['order-1']);
    vendor_realtime_store_1.useVendorRealtimeStore.getState().removeOrderRoom('order-1');
    strict_1.default.deepEqual(vendor_realtime_store_1.useVendorRealtimeStore.getState().activeOrderRooms, []);
});
(0, node_test_1.test)('vendor realtime store clears state on logout', () => {
    const store = vendor_realtime_store_1.useVendorRealtimeStore.getState();
    store.clearVendorRealtimeState();
    store.addOrderRoom('order-1');
    store.setLastOrderEvent({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.ORDER_CREATED,
        orderId: 'order-1',
        storeId: 'store-1',
        orderStatus: 'placed',
        totalAmount: 120,
        itemCount: 3,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        order: null,
    });
    store.clearVendorRealtimeState();
    const state = vendor_realtime_store_1.useVendorRealtimeStore.getState();
    strict_1.default.equal(state.socketConnected, false);
    strict_1.default.deepEqual(state.activeOrderRooms, []);
    strict_1.default.equal(state.lastOrderEvent, null);
    strict_1.default.equal(state.lastRealtimeEventAt, null);
});
