"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAssignmentAlertViewModel = void 0;
const delivery_realtime_types_1 = require("../types/delivery-realtime.types");
const formatPickupEta = (pickupEta) => pickupEta ? new Date(pickupEta).toLocaleTimeString() : 'Awaiting ETA';
const getNewAssignmentAlertViewModel = (event) => {
    if (!event || event.eventName !== delivery_realtime_types_1.DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED) {
        return null;
    }
    return {
        assignmentLabel: event.assignmentCode ?? event.assignmentId.slice(-8).toUpperCase(),
        orderId: event.orderId,
        pickupEtaLabel: formatPickupEta(event.pickupEta),
        navigationTarget: 'DeliveryHome',
    };
};
exports.getNewAssignmentAlertViewModel = getNewAssignmentAlertViewModel;
