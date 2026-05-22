"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileErrorCode = exports.getProfileErrorMessage = void 0;
const ERROR_MESSAGES = {
    PROFILE_VALIDATION_FAILED: 'Please check your name and email.',
    USER_NOT_FOUND: 'Profile not found.',
};
const getProfileErrorMessage = (error, fallback) => {
    const axiosError = error;
    const code = axiosError.response?.data?.error?.code;
    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }
    return axiosError.response?.data?.message ?? fallback;
};
exports.getProfileErrorMessage = getProfileErrorMessage;
const getProfileErrorCode = (error) => {
    const axiosError = error;
    return axiosError.response?.data?.error?.code;
};
exports.getProfileErrorCode = getProfileErrorCode;
