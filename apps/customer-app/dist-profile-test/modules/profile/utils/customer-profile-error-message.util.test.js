"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_profile_error_message_util_1 = require("./customer-profile-error-message.util");
(0, node_test_1.test)('getProfileErrorMessage maps PROFILE_VALIDATION_FAILED', () => {
    const error = {
        response: {
            data: {
                error: { code: 'PROFILE_VALIDATION_FAILED', details: {} },
                message: 'Validation failed',
            },
        },
    };
    strict_1.default.match((0, customer_profile_error_message_util_1.getProfileErrorMessage)(error, 'fallback'), /name and email/i);
});
(0, node_test_1.test)('getProfileErrorMessage maps USER_NOT_FOUND', () => {
    const error = {
        response: {
            data: {
                error: { code: 'USER_NOT_FOUND', details: {} },
                message: 'Not found',
            },
        },
    };
    strict_1.default.equal((0, customer_profile_error_message_util_1.getProfileErrorMessage)(error, 'fallback'), 'Profile not found.');
});
(0, node_test_1.test)('getProfileErrorMessage uses fallback for unknown errors', () => {
    strict_1.default.equal((0, customer_profile_error_message_util_1.getProfileErrorMessage)(new Error('network'), 'Could not load.'), 'Could not load.');
});
