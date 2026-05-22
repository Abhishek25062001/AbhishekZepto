"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractApiErrorCode = exports.mapVendorOrderErrorCodeToMessage = void 0;
const ORDER_ERROR_MESSAGES = {
    ORDER_ACCESS_FORBIDDEN: 'You do not have access to this order.',
    ORDER_ACCEPTANCE_NOT_ALLOWED: 'This order cannot be accepted or rejected now.',
    ORDER_REJECTION_REASON_REQUIRED: 'Add a rejection reason before rejecting.',
    ORDER_NOT_FOUND: 'Order not found.',
};
const normalizeCode = (errorCode) => errorCode.includes('.') ? (errorCode.split('.').pop() ?? errorCode) : errorCode;
const mapVendorOrderErrorCodeToMessage = (errorCode, fallback) => {
    if (!errorCode) {
        return fallback;
    }
    return ORDER_ERROR_MESSAGES[normalizeCode(errorCode)] ?? fallback;
};
exports.mapVendorOrderErrorCodeToMessage = mapVendorOrderErrorCodeToMessage;
const extractApiErrorCode = (error) => {
    if (typeof error !== 'object' || error === null || !('response' in error)) {
        return undefined;
    }
    const response = error.response;
    return response?.data?.error?.code;
};
exports.extractApiErrorCode = extractApiErrorCode;
