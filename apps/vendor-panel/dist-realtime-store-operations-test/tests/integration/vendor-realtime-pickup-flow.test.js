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
const vendor_realtime_pickup_status_util_1 = require("../../modules/realtime-store-operations/utils/vendor-realtime-pickup-status.util");
const getLastPickupEvent = () => {
    const event = vendor_realtime_store_1.useVendorRealtimeStore.getState().lastPickupEvent;
    strict_1.default.ok(event);
    return event;
};
(0, node_test_1.test)('vendor realtime pickup flow updates rider arrival and pickup completion states', () => {
    vendor_realtime_store_1.useVendorRealtimeStore.getState().clearVendorRealtimeState();
    (0, vendor_realtime_event_handler_util_1.handleVendorRealtimePayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED,
        emittedAt: '2026-01-01T10:05:01.000Z',
        data: {
            orderId: 'order-1',
            assignmentId: 'assignment-1',
            riderId: 'rider-1',
            arrivedAt: '2026-01-01T10:05:00.000Z',
        },
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.RIDER_ARRIVED);
    const arrivalEvent = getLastPickupEvent();
    strict_1.default.equal(arrivalEvent.pickupStatus, 'arrived_at_store');
    strict_1.default.equal((0, vendor_realtime_pickup_status_util_1.getVendorRealtimePickupStatusForOrder)(arrivalEvent, 'order-1'), 'arrived_at_store');
    (0, vendor_realtime_event_handler_util_1.handleVendorRealtimePayload)({
        eventName: vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED,
        emittedAt: '2026-01-01T10:08:01.000Z',
        data: {
            orderId: 'order-1',
            assignmentId: 'assignment-1',
            riderId: 'rider-1',
            pickupCompletedAt: '2026-01-01T10:08:00.000Z',
        },
    }, vendor_realtime_types_1.VENDOR_REALTIME_EVENTS.PICKUP_COMPLETED);
    const pickupEvent = getLastPickupEvent();
    strict_1.default.equal(pickupEvent.pickupStatus, 'pickup_completed');
    strict_1.default.equal((0, vendor_realtime_pickup_status_util_1.getVendorRealtimePickupStatusForOrder)(pickupEvent, 'order-1'), 'picked_up');
});
