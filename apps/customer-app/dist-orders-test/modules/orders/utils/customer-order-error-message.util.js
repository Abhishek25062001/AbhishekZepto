"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrderNotFoundError = exports.getOrderErrorCode = exports.getOrderErrorMessage = void 0;
const ERROR_MESSAGES = {
    ORDER_NOT_FOUND: 'Order not found.',
    ORDER_NOT_OWNED: 'You do not have access to this order.',
    ORDER_ALREADY_EXISTS: 'This order already exists.',
    ORDER_CANCELLATION_NOT_ALLOWED: 'This order can no longer be cancelled.',
    ORDER_CANCELLATION_REASON_REQUIRED: 'Cancellation reason is required.',
    ORDER_CREATION_FAILED: 'We could not confirm your order. Please contact support.',
};
const getOrderErrorMessage = (error, fallback) => {
    const axiosError = error;
    const code = axiosError.response?.data?.error?.code;
    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }
    return axiosError.response?.data?.message ?? fallback;
};
exports.getOrderErrorMessage = getOrderErrorMessage;
const getOrderErrorCode = (error) => {
    const axiosError = error;
    return axiosError.response?.data?.error?.code;
};
exports.getOrderErrorCode = getOrderErrorCode;
const isOrderNotFoundError = (error) => (0, exports.getOrderErrorCode)(error) === 'ORDER_NOT_FOUND';
exports.isOrderNotFoundError = isOrderNotFoundError;
