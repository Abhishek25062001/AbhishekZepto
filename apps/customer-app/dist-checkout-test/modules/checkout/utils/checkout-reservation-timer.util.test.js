"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const checkout_reservation_timer_util_1 = require("./checkout-reservation-timer.util");
(0, node_test_1.test)('computeCheckoutReservationTimer returns countdown for future expiry', () => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const state = (0, checkout_reservation_timer_util_1.computeCheckoutReservationTimer)(expiresAt, Date.now());
    strict_1.default.equal(state.isExpired, false);
    strict_1.default.ok(state.remainingSeconds > 0);
    strict_1.default.match(state.formatted, /^\d{2}:\d{2}$/);
});
(0, node_test_1.test)('computeCheckoutReservationTimer marks past expiry as expired', () => {
    const expiresAt = new Date(Date.now() - 1000).toISOString();
    const state = (0, checkout_reservation_timer_util_1.computeCheckoutReservationTimer)(expiresAt, Date.now());
    strict_1.default.equal(state.isExpired, true);
    strict_1.default.equal(state.remainingSeconds, 0);
    strict_1.default.equal(state.formatted, '00:00');
});
