"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_store_1 = require("../../store/delivery.store");
const useDeliveryRealtimeEvents_1 = require("../../modules/realtime-operations/hooks/useDeliveryRealtimeEvents");
const delivery_realtime_store_1 = require("../../modules/realtime-operations/store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../../modules/realtime-operations/types/delivery-realtime.types");
(0, node_test_1.test)('delivery realtime active flow applies pickup and active delivery status updates', () => {
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
    delivery_store_1.useDeliveryStore.getState().clearCurrentDelivery();
    (0, useDeliveryRealtimeEvents_1.handleDeliveryRealtimePayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED,
        emittedAt: '2026-01-01T10:05:01.000Z',
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            pickupStatus: 'picked_up',
            pickedUpAt: '2026-01-01T10:05:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED);
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastStatusEvent?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.PICKUP_UPDATED);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentAssignmentId, 'assignment-1');
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentDeliveryStatus, 'picked_up');
    (0, useDeliveryRealtimeEvents_1.handleDeliveryRealtimePayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED,
        emittedAt: '2026-01-01T10:10:01.000Z',
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            progressStatus: 'arrived_at_customer',
            updatedAt: '2026-01-01T10:10:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED);
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastStatusEvent?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.DELIVERY_STATUS_UPDATED);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentDeliveryStatus, 'arrived_at_customer');
});
(0, node_test_1.test)('delivery realtime active flow pauses location sync after rejection', () => {
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
    delivery_store_1.useDeliveryStore.getState().clearCurrentDelivery();
    (0, useDeliveryRealtimeEvents_1.handleDeliveryRealtimePayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED,
        emittedAt: '2026-01-01T10:11:01.000Z',
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            status: 'en_route_to_customer',
            rejectionReason: 'location too old',
            lastLocationUpdatedAt: '2026-01-01T10:11:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED);
    const realtimeState = delivery_realtime_store_1.useDeliveryRealtimeStore.getState();
    strict_1.default.equal(realtimeState.lastStatusEvent?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_REJECTED);
    strict_1.default.equal(realtimeState.locationSyncPaused, true);
    strict_1.default.equal(realtimeState.locationSyncError, 'location too old');
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentDeliveryStatus, 'en_route_to_customer');
});
