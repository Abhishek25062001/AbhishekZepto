"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
(0, node_test_1.test)('delivery realtime store tracks rooms without duplicates', () => {
    const store = delivery_realtime_store_1.useDeliveryRealtimeStore.getState();
    store.clearDeliveryRealtimeState();
    store.addAssignmentRoom(' assignment-1 ');
    store.addAssignmentRoom('assignment-1');
    strict_1.default.deepEqual(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().activeAssignmentRooms, [
        'assignment-1',
    ]);
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().removeAssignmentRoom('assignment-1');
    strict_1.default.deepEqual(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().activeAssignmentRooms, []);
});
(0, node_test_1.test)('delivery realtime store records location ack and clears sync errors', () => {
    const store = delivery_realtime_store_1.useDeliveryRealtimeStore.getState();
    store.clearDeliveryRealtimeState();
    store.setLocationSyncPaused(true);
    store.setLocationSyncError('location rejected');
    store.setLastStatusEvent({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'en_route_to_customer',
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: '2026-01-01T10:00:01.000Z',
        eventId: 'event-1',
        rejectionReason: null,
    });
    const state = delivery_realtime_store_1.useDeliveryRealtimeStore.getState();
    strict_1.default.equal(state.lastLocationAckAt, '2026-01-01T10:00:01.000Z');
    strict_1.default.equal(state.locationSyncPaused, false);
    strict_1.default.equal(state.locationSyncError, null);
});
