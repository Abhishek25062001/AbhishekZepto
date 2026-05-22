"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCheckoutReservationTimer = void 0;
const formatSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const computeCheckoutReservationTimer = (expiresAt, nowMs = Date.now()) => {
    if (!expiresAt) {
        return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
    }
    const expiresMs = new Date(expiresAt).getTime();
    if (Number.isNaN(expiresMs)) {
        return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
    }
    const remainingMs = expiresMs - nowMs;
    if (remainingMs <= 0) {
        return { remainingSeconds: 0, isExpired: true, formatted: '00:00' };
    }
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    return {
        remainingSeconds,
        isExpired: false,
        formatted: formatSeconds(remainingSeconds),
    };
};
exports.computeCheckoutReservationTimer = computeCheckoutReservationTimer;
