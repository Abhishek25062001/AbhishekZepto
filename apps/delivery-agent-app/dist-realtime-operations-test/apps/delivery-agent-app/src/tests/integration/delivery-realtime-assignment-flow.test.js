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
(0, node_test_1.test)('delivery realtime assignment flow sets and clears active delivery state', () => {
    delivery_realtime_store_1.useDeliveryRealtimeStore.getState().clearDeliveryRealtimeState();
    delivery_store_1.useDeliveryStore.getState().clearCurrentDelivery();
    (0, useDeliveryRealtimeEvents_1.handleDeliveryRealtimePayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        emittedAt: '2026-01-01T10:00:01.000Z',
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            assignmentStatus: 'assigned',
            assignmentCode: 'DEL-100',
            updatedAt: '2026-01-01T10:00:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastAssignmentEvent?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentAssignmentId, 'assignment-1');
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentOrderId, 'order-1');
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentDeliveryStatus, 'assigned');
    (0, useDeliveryRealtimeEvents_1.handleDeliveryRealtimePayload)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
        emittedAt: '2026-01-01T10:02:01.000Z',
        data: {
            assignmentId: 'assignment-1',
            orderId: 'order-1',
            assignmentStatus: 'cancelled',
            updatedAt: '2026-01-01T10:02:00.000Z',
        },
    }, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED);
    strict_1.default.equal(delivery_realtime_store_1.useDeliveryRealtimeStore.getState().lastAssignmentEvent?.eventName, delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentAssignmentId, null);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentOrderId, null);
    strict_1.default.equal(delivery_store_1.useDeliveryStore.getState().currentDeliveryStatus, null);
});
