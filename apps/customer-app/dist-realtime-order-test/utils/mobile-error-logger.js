"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMobileError = void 0;
const env_1 = require("../config/env");
const logMobileError = (error, componentStack, screen) => {
    if (!env_1.isDevelopment) {
        return;
    }
    const payload = {
        message: error.message,
        stack: error.stack,
        componentStack,
        screen,
        timestamp: new Date().toISOString(),
    };
    console.error('Customer App mobile error', payload);
};
exports.logMobileError = logMobileError;
