"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logClientError = void 0;
const env_1 = require("../config/env");
const logClientError = (error, componentStack) => {
    if (!env_1.isDevelopment) {
        return;
    }
    const payload = {
        message: error.message,
        stack: error.stack,
        componentStack,
        route: window.location.pathname,
        timestamp: new Date().toISOString(),
    };
    console.error('Vendor Panel client error', payload);
};
exports.logClientError = logClientError;
