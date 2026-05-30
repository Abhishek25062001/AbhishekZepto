"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const new_assignment_alert_util_1 = require("../utils/new-assignment-alert.util");
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
(0, node_test_1.test)('new assignment alert builds view model for assignment created event', () => {
    const viewModel = (0, new_assignment_alert_util_1.getNewAssignmentAlertViewModel)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-12345678',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: 'DEL-100',
        pickupEta: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
    });
    strict_1.default.deepEqual(viewModel, {
        assignmentLabel: 'DEL-100',
        orderId: 'order-1',
        pickupEtaLabel: 'Awaiting ETA',
        navigationTarget: 'DeliveryHome',
    });
});
(0, node_test_1.test)('new assignment alert falls back to assignment id suffix', () => {
    const viewModel = (0, new_assignment_alert_util_1.getNewAssignmentAlertViewModel)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
        assignmentId: 'assignment-abcdef12',
        orderId: 'order-1',
        deliveryStatus: 'assigned',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
    });
    strict_1.default.equal(viewModel?.assignmentLabel, 'ABCDEF12');
});
(0, node_test_1.test)('new assignment alert is hidden for cancellation events', () => {
    const viewModel = (0, new_assignment_alert_util_1.getNewAssignmentAlertViewModel)({
        eventName: delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
        assignmentId: 'assignment-1',
        orderId: 'order-1',
        deliveryStatus: 'cancelled',
        assignmentCode: null,
        pickupEta: null,
        updatedAt: '2026-01-01T10:00:00.000Z',
        emittedAt: null,
        eventId: null,
        assignment: null,
    });
    strict_1.default.equal(viewModel, null);
});
