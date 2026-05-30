"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeliveryPushPayload = void 0;
const getAssignmentId = (payload) => typeof payload.assignmentId === 'string' && payload.assignmentId.trim()
    ? payload.assignmentId.trim()
    : null;
const handleDeliveryPushPayload = (payload, navigation) => {
    const assignmentId = getAssignmentId(payload);
    if (payload.type === 'assignment_created' && assignmentId) {
        navigation.navigate('ActiveDelivery', { assignmentId });
        return true;
    }
    navigation.navigate('DeliveryHome');
    return false;
};
exports.handleDeliveryPushPayload = handleDeliveryPushPayload;
