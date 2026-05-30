"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiErrorMessage = void 0;
const isRecord = (value) => {
    return typeof value === 'object' && value !== null;
};
const isApiErrorResponse = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return value.success === false && typeof value.message === 'string';
};
const getApiErrorMessage = (error, fallbackMessage = 'Something went wrong.') => {
    if (isApiErrorResponse(error)) {
        return error.message;
    }
    if (isRecord(error) && isRecord(error.response)) {
        const responseData = error.response.data;
        if (isApiErrorResponse(responseData)) {
            return responseData.message;
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallbackMessage;
};
exports.getApiErrorMessage = getApiErrorMessage;
