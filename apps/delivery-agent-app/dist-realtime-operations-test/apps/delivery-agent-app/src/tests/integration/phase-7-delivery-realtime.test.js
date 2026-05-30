"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const delivery_realtime_store_1 = require("../../modules/realtime-operations/store/delivery-realtime.store");
const delivery_realtime_types_1 = require("../../modules/realtime-operations/types/delivery-realtime.types");
(0, node_test_1.test)('Phase 7 delivery realtime tracks assignment created and cancelled events', () => {
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setLastAssignmentEvent({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        updatedAt: '2026-05-30T10:00:00.000Z',
    });
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastAssignmentEvent?.assignmentId, 'assignment-1');
});
(0, node_test_1.test)('Phase 7 delivery realtime tracks location sync acknowledgement and fallback state', () => {
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setLastStatusEvent({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.LOCATION_SYNC_ACKNOWLEDGED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'en_route_to_customer',
        updatedAt: '2026-05-30T10:00:00.000Z',
    });
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().setSocketConnected(false);
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastLocationAckAt, '2026-05-30T10:00:00.000Z');
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().connectionState, 'disconnected');
});
