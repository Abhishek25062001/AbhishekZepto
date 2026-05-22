"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const customer_profile_validation_util_1 = require("./customer-profile-validation.util");
(0, node_test_1.test)('validateProfileInput accepts valid input', () => {
    const result = (0, customer_profile_validation_util_1.validateProfileInput)({ name: 'Demo', email: 'user@example.com' });
    strict_1.default.equal(result.valid, true);
});
(0, node_test_1.test)('validateProfileInput rejects invalid email', () => {
    const result = (0, customer_profile_validation_util_1.validateProfileInput)({ name: 'Demo', email: 'bad' });
    strict_1.default.equal(result.valid, false);
    strict_1.default.ok(result.emailError);
});
(0, node_test_1.test)('validateProfileInput rejects long name', () => {
    const result = (0, customer_profile_validation_util_1.validateProfileInput)({ name: 'a'.repeat(101), email: '' });
    strict_1.default.equal(result.valid, false);
    strict_1.default.ok(result.nameError);
});
